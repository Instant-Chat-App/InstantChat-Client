import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState, useMemo } from "react"
import { getUserChats } from "../services/ChatService"
import { getSocket } from "@/socket/socket-io"
import { Attachment, Chat } from "../types/Chat"
import { FileAttachment } from "../components/ChatInput"
import { useSearchParams } from "react-router-dom"

export const AUTH_STORAGE_KEY = 'auth_tokens'

function useChat() {
    const [error, setError] = useState<string | null>(null)
    const queryClient = useQueryClient()
    const [searchParams] = useSearchParams()
    const currentChatId = searchParams.get('id')

    const {
        data: rawChats,
        isLoading,
        isError,
        refetch,
    } = useQuery<Chat[]>({
        queryKey: ['chats'],
        queryFn:  getUserChats,
        staleTime: 1000* 60,
    })

    // Sort chats by most recent message
    const chats = useMemo(() => {
        if (!rawChats) return [];
        return [...rawChats].sort((a, b) => {
            const timeA = a.messageCreatedAt ? new Date(a.messageCreatedAt).getTime() : 0;
            const timeB = b.messageCreatedAt ? new Date(b.messageCreatedAt).getTime() : 0;
            return timeB - timeA; // Sort in descending order (newest first)
        });
    }, [rawChats]);

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

    // Listen to all chat events regardless of current active chat
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (payload: { chatId: number }) => {
            // If the message is in a different chat than the current one, mark it as unread
            if (payload.chatId !== Number(currentChatId)) {
                queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
                    if (!oldChats) return oldChats;
                    return oldChats.map(chat =>
                        chat.chatId === payload.chatId
                            ? { ...chat, readStatus: 'UNREAD' }
                            : chat
                    );
                });
            }
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        };

        const handleChatUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        };

        // Listen for any message events in any chat
        socket.on("newMessage", handleNewMessage);

        socket.on("messageDeleted", handleChatUpdate);
        socket.on("messageReacted", handleChatUpdate);
        socket.on("reactionDeleted", handleChatUpdate);

        // Listen for chat update events
        socket.on("chatUpdated", handleChatUpdate);
        socket.on("memberJoined", handleChatUpdate);
        socket.on("memberLeft", handleChatUpdate);
        socket.on("chatDeleted", handleChatUpdate);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageEdited", handleChatUpdate);
            socket.off("messageDeleted", handleChatUpdate);
            socket.off("messageReacted", handleChatUpdate);
            socket.off("reactionDeleted", handleChatUpdate);
            socket.off("chatUpdated", handleChatUpdate);
            socket.off("memberJoined", handleChatUpdate);
            socket.off("memberLeft", handleChatUpdate);
            socket.off("chatDeleted", handleChatUpdate);
        };
    }, [queryClient, currentChatId]);

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
