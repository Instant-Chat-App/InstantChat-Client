import { useInfiniteQuery, useQuery, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import { getChatMessages } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { ChatMessage, Reaction, User } from "../types/Chat"
import { getCurrentUser } from "@/features/auth/services/AuthService"
import { UserInfo } from "@/features/user/types/User"

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
    const hasJoinedRef = useRef(false)

    // Get current user
    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await getCurrentUser()
            return response.data
        },
        staleTime: Infinity
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

    // Join chat room when chatId changes
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chatId || hasJoinedRef.current) return;

        socket.emit("joinMultipleChats", [chatId]);
        hasJoinedRef.current = true;

        socket.on("joinSuccess", ({ chatId: joinedChatId }) => {
            console.log(`Successfully joined chat ${joinedChatId}`);
        });

        socket.on("joinError", (error) => {
            console.error("Error joining chat:", error);
            setError(error.error);
        });

        return () => {
            socket.off("joinSuccess");
            socket.off("joinError");
            hasJoinedRef.current = false;
        };
    }, [chatId]);

    // Process messages to combine all pages
    const processedMessages = useMemo(() => {
        if (!data?.pages) return []
        const allMessages = data.pages.flatMap(page => page.data)
        return allMessages.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    }, [data?.pages])

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chatId) return;

        const handleNewMessage = (payload: {
            messageId: number,
            chatId: number,
            content: string,
            attachments: any[],
            senderId: number,
            timestamp: string,
            replyTo?: number | null,
            isEdited: boolean,
            isDeleted: boolean
        }) => {
            if (payload.chatId !== chatId) return;

            queryClient.setQueryData<InfiniteData<PaginatedMessages>>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData;

                const newPages = oldData.pages.map(page => {
                    const pageData = [...page.data];
                    
                    // For our own messages, update the optimistic entry
                    if (payload.senderId === currentUser?.id) {
                        const optimisticIndex = pageData.findIndex(
                            msg => msg.content === payload.content && 
                                  msg.senderId === payload.senderId &&
                                  msg.messageId === undefined
                        );
                        
                        if (optimisticIndex !== -1) {
                            pageData[optimisticIndex] = {
                                ...pageData[optimisticIndex],
                                messageId: payload.messageId, // Update with real messageId from server
                                chatId: payload.chatId,
                                content: payload.content,
                                senderId: payload.senderId,
                                createdAt: payload.timestamp,
                                isEdited: payload.isEdited,
                                isDeleted: payload.isDeleted,
                                replyTo: payload.replyTo || null,
                                attachments: payload.attachments || []
                            };
                        }
                    } else {
                        // For messages from others, add to the end
                        const newMessage: ChatMessage = {
                            messageId: payload.messageId, // Use real messageId from server
                            chatId: payload.chatId,
                            content: payload.content,
                            senderId: payload.senderId,
                            createdAt: payload.timestamp,
                            isEdited: payload.isEdited,
                            isDeleted: payload.isDeleted,
                            replyTo: payload.replyTo || null,
                            replyToMessage: null,
                            attachments: payload.attachments || [],
                            reactions: [],
                            messageStatus: [],
                            sender: {
                                userId: payload.senderId,
                                fullName: '',  // Will be updated on next fetch
                                email: '',
                                avatar: '',
                                dob: '',
                                gender: 'MALE',
                                bio: ''
                            },
                            isOwner: false
                        };
                        pageData.push(newMessage);
                    }
                    
                    // Sort messages by timestamp
                    return {
                        ...page,
                        data: pageData.sort((a, b) => 
                            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        )
                    };
                });

                return {
                    ...oldData,
                    pages: newPages
                };
            });

            // Fetch latest data to get complete message info (including sender details)
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        };

        socket.on("newMessage", handleNewMessage);

        socket.on("messageError", (error: { error: string }) => {
            console.error("Error sending message:", error);
            setError(error.error);
            
            // Remove failed optimistic updates
            queryClient.setQueryData<InfiniteData<PaginatedMessages>>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData;
                const newPages = oldData.pages.map(page => ({
                    ...page,
                    data: page.data.filter(msg => msg.messageId !== undefined)
                }));
                return {
                    ...oldData,
                    pages: newPages
                };
            });
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
            socket.off("messageError");
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
    }, [chatId, queryClient, currentUser]);

    const sendMessage = useCallback(
        (content: string, attachments?: FileAttachment[], replyTo?: number) => {
            const socket = getSocket();
            if (!socket || !chatId) {
                setError("Socket connection not available");
                return;
            }

            if (!content && (!attachments || attachments.length === 0)) {
                setError("Message content cannot be empty");
                return;
            }

            // Create optimistic message without messageId
            const optimisticMessage: ChatMessage = {
                messageId: undefined as any, // Will be updated when we get real messageId from server
                chatId: chatId,
                content: content,
                senderId: currentUser?.id || 0,
                createdAt: new Date().toISOString(),
                isEdited: false,
                isDeleted: false,
                replyTo: replyTo || null,
                replyToMessage: null,
                attachments: attachments ? attachments.map(att => ({
                    url: URL.createObjectURL(new Blob([att.base64Data], { type: att.mimeType })),
                    type: determineAttachmentType(att.mimeType),
                    name: att.fileName
                })) : [],
                reactions: [],
                messageStatus: [],
                sender: {
                    userId: currentUser?.id || 0,
                    fullName: currentUser?.fullName || '',
                    email: currentUser?.email || '',
                    avatar: currentUser?.avatar || '',
                    dob: typeof currentUser?.dob === 'string' ? currentUser.dob : new Date().toISOString(),
                    gender: currentUser?.gender || 'MALE',
                    bio: currentUser?.bio || ''
                },
                isOwner: true
            };

            // Optimistic update
            queryClient.setQueryData<InfiniteData<PaginatedMessages>>(['messages', chatId], (oldData) => {
                if (!oldData) return oldData;
                const newPages = [...oldData.pages];
                const lastPage = newPages[newPages.length - 1];
                lastPage.data = [...lastPage.data, optimisticMessage];
                return {
                    ...oldData,
                    pages: newPages
                };
            });

            // Send message through socket
            socket.emit("sendMessage", {
                chatId,
                content,
                attachments,
                replyTo
            });
        },
        [chatId, currentUser, queryClient]
    );

    // Helper function to determine attachment type
    const determineAttachmentType = (mimeType: string): 'IMAGE' | 'VIDEO' | 'RAW' => {
        if (mimeType.startsWith('image/')) return 'IMAGE';
        if (mimeType.startsWith('video/')) return 'VIDEO';
        return 'RAW';
    };

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
