import { useEffect } from "react";
import { useSocketContext } from "../Context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (newMessage) => {
            useConversation.setState(prev => ({
                messages: [...prev.messages, {
                    ...newMessage,
                    shouldShake: true,
                    createdAt: Date.now()
                }]
            }));
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket]);

    return null;
};
export default useListenMessages;