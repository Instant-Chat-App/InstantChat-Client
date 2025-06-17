import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { getChatMessages } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { useEffect } from "react"
import { ChatMessage } from "../types/Chat"
import { getCurrentUser } from "@/features/auth/services/AuthService"

interface FileAttachment {
    fileName: string;
    mimeType: string;
    base64Data: string;
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
        data: messages,
        isLoading,
        isError,
        refetch
    } = useQuery<ChatMessage[]>({
        queryKey: ['messages', chatId],
        queryFn: () => {
            if (!chatId) return Promise.resolve([])
            return getChatMessages(chatId)
        },
        enabled: !!chatId, // Only run query if chatId exists
        staleTime: 1000 * 60 // Cache for 1 minute
    })

    // Process messages to add isOwner flag
    const processedMessages = messages?.map(message => {
        // Check if the message sender is the current user
        const isCurrentUser = currentUser && message.sender.userId === currentUser.id
        
        const processedMessage: ChatMessage = {
            ...message,
            isOwner: isCurrentUser || false 
        }
        
        return processedMessage
    }) || []

    // Socket event to mark messages as read
    const markMessagesAsRead = useCallback(() => {
        const socket = getSocket();
        if (!socket || !chatId) return;

        socket.emit("readMessages", chatId);
    }, [chatId]);

    // Socket event to send a new message
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

    const deleteMessage = useCallback(
        (messageId: number) => {
            const socket = getSocket();
            if (!socket || !chatId) return;
            socket.emit("deleteMessage", { chatId, messageId });
        },
        [chatId]
    );

    const editMessage = useCallback(
        (messageId: number, content: string) => {
            const socket = getSocket();
            if (!socket || !chatId) return;
            socket.emit("editMessage", { chatId, messageId, content });
        },
        [chatId]
    );

    const reactMessage = useCallback(
        (messageId: number, emoji: string) => {
            const socket = getSocket();
            if (!socket || !chatId) return;
            socket.emit("reactMessage", { chatId, messageId, emoji });
        },
        [chatId]
    );

    const deleteReaction = useCallback(
        (messageId: number, emoji: string) => {
            const socket = getSocket();
            if (!socket || !chatId) return;
            socket.emit("deleteReaction", { chatId, messageId });
        },
        [chatId]
    );

    


    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chatId) return;

        const handleNewMessage = (payload: { chatId: number }) => {
            if (payload.chatId === chatId) {
                queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            }
        };

        // Message events
        socket.on("newMessage", handleNewMessage);
        socket.on("editMessage", handleNewMessage);
        socket.on("deleteMessage", handleNewMessage);
        socket.on("reactMessage", handleNewMessage);
        socket.on("deleteReaction", handleNewMessage);

        // Read status events
        socket.on("readSuccess", (payload: { chatId: number }) => {
            if (payload.chatId === chatId) {
                queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
                queryClient.invalidateQueries({ queryKey: ['chats'] }); // Update chat list to reflect read status
            }
        });

        socket.on("readError", (payload: { error: string }) => {
            console.error("Error marking messages as read:", payload.error);
            setError(payload.error);
        });

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageEdited", handleNewMessage);
            socket.off("messageDeleted", handleNewMessage);
            socket.off("messageReacted", handleNewMessage);
            socket.off("reactionDeleted", handleNewMessage);
            socket.off("readSuccess");
            socket.off("readError");
        };
    }, [chatId, queryClient]);

    // Auto mark messages as read when chat is opened
    useEffect(() => {
        if (chatId) {
            markMessagesAsRead();
        }
    }, [chatId, markMessagesAsRead]);

    return {
        messages: processedMessages,
        isLoading,
        isError,
        error,
        setError,
        refetch,
        sendMessage,
        currentUser,
        markMessagesAsRead,
        deleteMessage,
        editMessage,
        reactMessage,
        deleteReaction
    }
}

export default useMessage
