import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
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

    // Updated to match server's expected parameters and types
    const reactMessage = useCallback(
        (messageId: number, reaction: Reaction['type']) => {
            const socket = getSocket();
            if (!socket || !chatId || !currentUser) {
                console.error("Missing required data for reaction:", { socket, chatId, currentUser });
                return;
            }

            try {
                // Send reaction with the expected parameters
                socket.emit("reactMessage", chatId, messageId, reaction);
            } catch (err) {
                console.error("Error sending reaction:", err);
                setError("Failed to send reaction. Please try again.");
            }
        },
        [chatId, currentUser]
    );

    const deleteReaction = useCallback(
        (messageId: number, reaction: Reaction['type']) => {
            const socket = getSocket();
            if (!socket || !chatId || !currentUser) {
                console.error("Missing required data for deleting reaction:", { socket, chatId, currentUser });
                return;
            }

            try {
                socket.emit("deleteReaction", messageId, currentUser.id, reaction);
            } catch (err) {
                console.error("Error deleting reaction:", err);
                setError("Failed to delete reaction. Please try again.");
            }
        },
        [chatId, currentUser]
    );

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chatId) return;

        const handleMessageEvent = (payload: { chatId: number }) => {
            if (payload.chatId === chatId) {
                queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            }
        };

        // Message events
        socket.on("newMessage", handleMessageEvent);
        socket.on("editMessage", handleMessageEvent);
        socket.on("deleteMessage", handleMessageEvent);

        // Reaction events with specific handlers
        socket.on("messageReacted", (payload: { messageId: number, userId: number, reaction: Reaction['type'] }) => {
            console.log("Reaction received:", payload);
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        });

        socket.on("reactionDeleted", (payload: { messageId: number, userId: number, reaction: Reaction['type'] }) => {
            console.log("Reaction deleted:", payload);
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        });

        // Success handlers for reactions
        socket.on("reactSuccess", (payload: { messageId: number, reaction: Reaction['type'] }) => {
            console.log("Reaction success:", payload);
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            setError(null); // Clear any previous errors
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

        // Error handlers for reactions
        socket.on("reactError", (payload: { error: string }) => {
            console.error("Reaction error:", payload.error);
            setError(payload.error);
        });

        return () => {
            socket.off("newMessage", handleMessageEvent);
            socket.off("editMessage", handleMessageEvent);
            socket.off("deleteMessage", handleMessageEvent);
            socket.off("messageReacted");
            socket.off("reactionDeleted");
            socket.off("reactSuccess");
            socket.off("readSuccess");
            socket.off("readError");
            socket.off("reactError");
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
