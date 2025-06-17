import { getSocket } from "./socket-io";

export const sendMessage = (chatId: number, content: string, attachments: File[], replyTo?: number) => {
    const filesToBuffer = attachments?.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return {
            fileName: file.name,
            mimeType: file.type,
            buffer: arrayBuffer,
        };
    });

    const socket = getSocket();
    Promise.all(filesToBuffer || []).then((buffers) => {
        if (socket) {
            socket.emit("sendMessage", {
                chatId,
                content,
                attachments: buffers,
                replyTo
            });
        }
    });
};

export function newMessage(callback: (message: any) => void) {
    const socket = getSocket();
    if (socket) {
        socket.on("newMessage", callback);
        return () => socket.off("newMessage", callback);
    }
}

