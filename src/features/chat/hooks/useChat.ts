import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getUserChats } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { Chat } from "../types/Chat"


export const AUTH_STORAGE_KEY = 'auth_tokens'

function useChat() {
    const [error, setError] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const {
        data: chats,
        isLoading,
        isError,
        refetch,
    } = useQuery<Chat[]>({
        queryKey: ['chats'],
        queryFn:  getUserChats,
        staleTime: 1000 * 60, // giữ cache trong 1 phút
    })

    // Join all available chats on socket connection
    useEffect(() => {
        const socket = getSocket()
        if (!socket || !chats || chats.length === 0) return

        // Join all chats to receive updates
        const chatIds = chats.map(chat => chat.chatId)
        socket.emit("joinMultipleChats", chatIds)

        return () => {
            // Cleanup: leave all chats when unmounting
            if (socket.connected) {
                socket.emit("leaveAllChats")
            }
        }
    }, [chats])

    // Listen to all chat events regardless of current active chat
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleChatUpdate = () => {
            // Invalidate and refetch chats when any chat is updated
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        };

        // Listen for any message events in any chat
        socket.on("newMessage", handleChatUpdate);
        socket.on("messageEdited", handleChatUpdate);
        socket.on("messageDeleted", handleChatUpdate);
        socket.on("messageReacted", handleChatUpdate);
        socket.on("reactionDeleted", handleChatUpdate);

        // Listen for chat update events
        socket.on("chatUpdated", handleChatUpdate);
        socket.on("memberJoined", handleChatUpdate);
        socket.on("memberLeft", handleChatUpdate);
        socket.on("chatDeleted", handleChatUpdate);

        return () => {
            socket.off("newMessage", handleChatUpdate);
            socket.off("messageEdited", handleChatUpdate);
            socket.off("messageDeleted", handleChatUpdate);
            socket.off("messageReacted", handleChatUpdate);
            socket.off("reactionDeleted", handleChatUpdate);
            socket.off("chatUpdated", handleChatUpdate);
            socket.off("memberJoined", handleChatUpdate);
            socket.off("memberLeft", handleChatUpdate);
            socket.off("chatDeleted", handleChatUpdate);
        };
    }, [queryClient]);

    return {
        chats,
        isLoading,
        isError,
        refetch,
        error,
        setError,
    }
}

export default useChat
