import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import sodium from "libsodium-wrappers";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { backendUrl, userData, lawyerData, privateKey, getPublicKey } = useContext(AppContext);

  const decryptMessage = async (encryptedMessage, nonce, senderPublicKey, receiverPrivateKey) => {
    await sodium.ready;
    if (!senderPublicKey || !receiverPrivateKey || !encryptedMessage || !nonce) {
      throw new Error("Missing required parameters for decryption");
    }
    try {
      const decrypted = sodium.crypto_box_open_easy(
        sodium.from_hex(encryptedMessage),
        sodium.from_hex(nonce),
        sodium.from_hex(senderPublicKey),
        sodium.from_hex(receiverPrivateKey)
      );
      return sodium.to_string(decrypted);
    } catch (err) {
      console.error("Decryption failed:", err);
      throw err;
    }
  };

  const getMessages = useCallback(
    async (before = null) => {
      const currentUser = userData || lawyerData;
      if (!currentUser || !privateKey) {
        setError("You must be logged in to view messages");
        return [];
      }

      if (!selectedConversation) {
        setError("No conversation selected");
        return [];
      }

      const otherUserId = selectedConversation._id;
      if (!otherUserId) {
        setError("Invalid conversation partner");
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const params = before ? { before } : {};
        const res = await axios.get(`${backendUrl}/api/messages/${otherUserId}`, {
          params,
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        const data = res.data;
        if (data.success) {
          const newMessages = data.data;
          const decryptedMessages = await Promise.all(
            newMessages.map(async (msg) => {
              const isOwnMessage = msg.senderId.toString() === currentUser._id.toString();
              if (isOwnMessage) {
                const localPlaintext = localStorage.getItem(`message_${msg._id}`);
                return {
                  ...msg,
                  message: localPlaintext || "[Message sent]",
                  messagePlaintext: localPlaintext,
                };
              }
              if (msg.message && msg.nonce) {
                const senderPublicKey = await getPublicKey(msg.senderId.toString(), selectedConversation.isLawyer);
                if (!senderPublicKey) {
                  return { ...msg, message: "[Failed to decrypt: Missing sender key]" };
                }
                try {
                  const decryptedText = await decryptMessage(
                    msg.message,
                    msg.nonce,
                    senderPublicKey,
                    privateKey
                  );
                  return { ...msg, message: decryptedText };
                } catch (err) {
                  return { ...msg, message: "[Decryption failed]" };
                }
              }
              return msg;
            })
          );

          if (before) {
            setMessages((prev) => [...decryptedMessages, ...prev]);
          } else {
            setMessages(decryptedMessages);
          }
          setHasMore(data.hasMore);
          return decryptedMessages;
        } else {
          throw new Error("No messages found");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.error || "Failed to fetch messages");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, userData, lawyerData, privateKey, setMessages, selectedConversation, getPublicKey]
  );

  const loadMore = useCallback(() => {
    if (messages.length > 0 && hasMore) {
      getMessages(messages[0].createdAt);
    }
  }, [messages, hasMore, getMessages]);

  useEffect(() => {
    const wsUrl = backendUrl.replace(/^http/, "ws");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      const userId = userData?._id || lawyerData?._id;
      if (userId) {
        ws.send(JSON.stringify({ type: "register", userId }));
      }
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        const { message } = data;
        const currentUser = userData || lawyerData;
        const isOwnMessage = message.senderId.toString() === currentUser._id.toString();
        let decryptedText;
        if (isOwnMessage) {
          const localPlaintext = localStorage.getItem(`message_${message._id}`);
          decryptedText = localPlaintext || "[Message sent]";
        } else if (message.nonce) {
          const senderPublicKey = await getPublicKey(message.senderId.toString(), selectedConversation?.isLawyer);
          if (senderPublicKey) {
            try {
              decryptedText = await decryptMessage(
                message.message,
                message.nonce,
                senderPublicKey,
                privateKey
              );
            } catch (err) {
              decryptedText = "[Decryption failed]";
            }
          } else {
            decryptedText = "[Failed to decrypt: Missing sender key]";
          }
        } else {
          decryptedText = message.message;
        }
        const newMessage = {
          ...message,
          message: decryptedText,
          messagePlaintext: isOwnMessage ? decryptedText : undefined,
        };
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) {
            return prev;
          }
          return [...prev, newMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    return () => ws.close();
  }, [backendUrl, userData, lawyerData, privateKey, setMessages, getPublicKey, selectedConversation]);

  return { loading, error, messages, getMessages, loadMore, hasMore };
};

export default useGetMessages;