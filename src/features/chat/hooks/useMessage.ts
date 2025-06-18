import { useInfiniteQuery, useQuery, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import { getChatMessages } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { useEffect } from "react"
import { ChatMessage, Reaction } from "../types/Chat"
import { getCurrentUser } from "@/features/auth/services/AuthService"

interface FileAttachment {
    fileName: string;
    mimeType: string;
    base64Data: string;
}

export interface PaginatedMessages {
    data: ChatMessage[];
    hasMore: boolean;
    nextCursor?: string;
}

function useMessage(chatId: number | null) {
    const [error, setError] = useState<string | null>(null)
    const queryClient = useQueryClient()

    // Get current user
    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await getCurrentUser()
            return response.data
        },
        staleTime: Infinity // Current user info rarely changes
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch
    } = useInfiniteQuery<PaginatedMessages, Error>({
        queryKey: ['messages', chatId],
        queryFn: async ({ pageParam = undefined }) => {
            if (!chatId) {
                return {
                    data: [],
                    hasMore: false,
                    nextCursor: undefined
                }
            }
            const response = await getChatMessages(chatId, {
                limit: 20,
                cursor: pageParam as string | undefined,
                direction: 'before'
            })
            return response
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined
        },
        enabled: !!chatId,
    })

    // Process messages to combine all pages
    const processedMessages = useMemo(() => {
        if (!data?.pages) return []
        // Flatten all pages and sort by createdAt
        const allMessages = data.pages.flatMap(page => page.data)
        return allMessages.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    }, [data?.pages])

    const sendMessage = useCallback(
        (content: string, attachments?: FileAttachment[], replyTo?: number) => {
            const socket = getSocket();
            if (!socket || !chatId) return;

            socket.emit("sendMessage", {
                chatId,
                content,
                attachments,
                replyTo,
            });
        },
        [chatId]
    );

    const deleteMessage = useCallback((messageId: number) => {
        const socket = getSocket();
        if (!socket || !chatId) return;
        socket.emit("deleteMessage", chatId, messageId);
    }, [chatId]);

    const editMessage = useCallback(
        (messageId: number, content: string) => {
            const socket = getSocket();
            if (!socket || !chatId) {
                console.error('Socket or chatId not available:', { socket, chatId })
                return;
            }
            socket.emit("editMessage", { chatId, messageId, content });
        },
        [chatId]
    );

    // Updated to match server's expected parameters and types
    const reactMessage = useCallback(
        (messageId: number, reaction: Reaction['type']) => {
            const socket = getSocket();
            if (!socket || !chatId) {
                console.error("Socket or chatId not available:", { socket, chatId });
                return;
            }

            socket.emit("reactMessage", chatId, messageId, reaction);
        },
        [chatId]
    );

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chatId) return;

        // Handle message events
        socket.on("newMessage", (payload: { chatId: number }) => {
                queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            
        });

        // Handle delete message events
        socket.on("deleteSuccess", (payload: { messageId: number }) => {
            queryClient.setQueryData<InfiniteData<PaginatedMessages>>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData;
                const newPages = oldData.pages.map(page => ({
                    ...page,
                    data: page.data.map(msg => 
                        msg.messageId === payload.messageId 
                            ? { ...msg, isDeleted: true, content: 'This message has been deleted' }
                            : msg
                    )
                }));
                return {
                    ...oldData,
                    pages: newPages
                };
            });
            setError(null);
        });

        socket.on("messageDeleted", (payload: { messageId: number }) => {
            queryClient.setQueryData<InfiniteData<PaginatedMessages>>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData;
                const newPages = oldData.pages.map(page => ({
                    ...page,
                    data: page.data.map(msg => 
                        msg.messageId === payload.messageId 
                            ? { ...msg, isDeleted: true, content: 'This message has been deleted' }
                            : msg
                    )
                }));
                return {
                    ...oldData,
                    pages: newPages
                };
            });
        });

        socket.on("deleteError", (payload: { error: string }) => {
            console.error("Delete message error:", payload.error);
            setError(payload.error);
        });

        // Handle edit message events
        socket.on("editSuccess", (payload: { messageId: number, content: string }) => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            setError(null);
        });

        socket.on("messageEdited", (payload: { messageId: number }) => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        });

        socket.on("editError", (payload: { error: string }) => {
            console.error("Edit message error:", payload.error);
            setError(payload.error);
        });

        // Reaction events with specific handlers
        socket.on("reactSuccess", (payload: { messageId: number, reaction: Reaction['type'] }) => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            setError(null);
        });

        socket.on("messageReacted", (payload: { messageId: number, userId: number, reaction: Reaction['type'] }) => {
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        });

        socket.on("reactError", (payload: { error: string }) => {
            console.error("Reaction error:", payload.error);
            setError(payload.error);
        });

        // Read status events
        socket.on("readSuccess", (payload: { chatId: number }) => {
            if (payload.chatId === chatId) {
                queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
                queryClient.invalidateQueries({ queryKey: ['chats'] });
            }
        });

        socket.on("readError", (payload: { error: string }) => {
            console.error("Error marking messages as read:", payload.error);
            setError(payload.error);
        });

        return () => {
            socket.off("newMessage");
            socket.off("deleteSuccess");
            socket.off("messageDeleted");
            socket.off("deleteError");
            socket.off("editSuccess");
            socket.off("messageEdited");
            socket.off("editError");
            socket.off("reactSuccess");
            socket.off("messageReacted");
            socket.off("reactError");
            socket.off("readSuccess");
            socket.off("readError");
        };
    }, [chatId, queryClient]);

    return {
        messages: processedMessages,
        isLoading,
        isError,
        error,
        setError,
        refetch,
        sendMessage,
        currentUser,
        deleteMessage,
        editMessage,
        reactMessage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    }
}

export default useMessage
