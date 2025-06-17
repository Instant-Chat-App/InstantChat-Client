import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import { getUserChats } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { Attachment, Chat } from "../types/Chat"
import { FileAttachment } from "../components/ChatInput"


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
        staleTime: 1000 * 60,
    })

    // Join all available chats on socket connection
    useEffect(() => {
        const socket = getSocket()
        if (!socket || !chats || chats.length === 0) return

        // Join all chats to receive updates
        const chatIds = chats.map(chat => chat.chatId)
        socket.emit("joinMultipleChats", chatIds)

        return () => {
            // Cleanup
            if (socket.connected) {
                socket.emit("leaveAllChats")
            }
        }
    }, [chats])

    // const memberJoined = useCallback((userId: number[]) => {
    //     const socket = getSocket()
    //     if (!socket) return;
    //     socket.emit("memberJoined", { chats, userId })
    // }, [chats])

    // const memberLeft = useCallback((chatId: number, userId: number) => {
    //     const socket = getSocket()
    //     if (!socket) return;
    //     socket.emit("memberLeft", { chatId, userId })
    // }, [chats]);

    

    // const changeGroupName = useCallback((newName: string) => {
    //     const socket = getSocket()
    //     if (!socket) return;
    //     socket.emit("changeGroupName", { chatId, newName })
    // }, [chats])

    // const changeGroupCover = useCallback((newCover: FileAttachment) => {
    //     const socket = getSocket()
    //     if (!socket) return;
    //     socket.emit("changeGroupCover", { chatId, newCover })
    // }, [chats])

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
