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

    //Join multiple chats on socket connection
    useEffect(() => {
        const socket = getSocket()
        if (!socket || !chats || chats.length === 0) return

        const chatIds = chats.map(chat => chat.chatId || chat.chatId)
        socket.emit("joinMultipleChats", chatIds)
    }, [chats])

    // Chat socket event listeners
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleMessageChange = (payload: { chatId: number }) => {
            queryClient.invalidateQueries({ queryKey: ['chatMessages', payload.chatId] });
        };

        socket.on("newMessage", handleMessageChange);
        socket.on("messageEdited", handleMessageChange);
        socket.on("messageDeleted", handleMessageChange);
        socket.on("messageReacted", handleMessageChange);
        socket.on("reactionDeleted", handleMessageChange);

        return () => {
            socket.off("newMessage", handleMessageChange);
            socket.off("messageEdited", handleMessageChange);
            socket.off("messageDeleted", handleMessageChange);
            socket.off("messageReacted", handleMessageChange);
            socket.off("reactionDeleted", handleMessageChange);
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
