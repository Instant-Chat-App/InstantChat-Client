import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { getChatMessages } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { useEffect } from "react"
import { ChatMessage } from "../types/Chat"
import { getCurrentUser } from "@/features/auth/services/AuthService"

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

    // Listen to real-time socket events
    const sendMessage = useCallback(
        (content: string, attachments?: File[], replyTo?: number) => {
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

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !chatId) return;

        const handleNew = (payload: { chatId: number }) => {
            if (payload.chatId === chatId) {
                queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            }
        };

        socket.on("newMessage", handleNew);
        socket.on("messageEdited", handleNew);
        socket.on("messageDeleted", handleNew);
        socket.on("messageReacted", handleNew);
        socket.on("reactionDeleted", handleNew);

        return () => {
            socket.off("newMessage", handleNew);
            socket.off("messageEdited", handleNew);
            socket.off("messageDeleted", handleNew);
            socket.off("messageReacted", handleNew);
            socket.off("reactionDeleted", handleNew);
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
        currentUser
    }
}

export default useMessage
