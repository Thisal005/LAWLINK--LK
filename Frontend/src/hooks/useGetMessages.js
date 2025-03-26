import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import sodium from "libsodium-wrappers";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { backendUrl, userData, lawyerData, privateKey, getPublicKey } = useContext(AppContext);

  const decryptMessage = async (encryptedMessage, nonce, senderPublicKey, receiverPrivateKey) => {
    await sodium.ready;
    if (!senderPublicKey || !receiverPrivateKey || !encryptedMessage || !nonce) {
      throw new Error("Missing required parameters for decryption");
    }
    console.log("Decryption Attempt:");
    console.log("Encrypted Message:", encryptedMessage);
    console.log("Nonce:", nonce);
    console.log("Sender Public Key:", senderPublicKey);
    console.log("Receiver Private Key:", receiverPrivateKey);
    try {
      const decrypted = sodium.crypto_box_open_easy(
        sodium.from_hex(encryptedMessage),
        sodium.from_hex(nonce),
        sodium.from_hex(senderPublicKey),
        sodium.from_hex(receiverPrivateKey)
      );
      const decryptedText = sodium.to_string(decrypted);
      console.log("Decrypted Text:", decryptedText);
      return decryptedText;
    } catch (err) {
      console.error("Decryption failed with error:", err);
      throw err;
    }
  };

  const getMessages = useCallback(
    async (forceRefresh = false) => {
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
      const isOtherUserLawyer = selectedConversation.isLawyer;

      if (!otherUserId) {
        setError("Invalid conversation partner");
        return [];
      }

      if (!forceRefresh && lastFetch && Date.now() - lastFetch < 2000) {
        return Array.isArray(messages) ? messages : [];
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backendUrl}/api/messages/${otherUserId}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        console.log("Fetched Messages Response:", res.data);

        const data = res.data;
        setLastFetch(Date.now());

        if (data.success) {
          const messageArray = Array.isArray(data.data) ? data.data : [];
          const decryptedMessages = await Promise.all(
            messageArray.map(async (msg) => {
              const isOwnMessage = msg.senderId.toString() === currentUser._id.toString();

              if (isOwnMessage) {
                const localPlaintext =
                  localStorage.getItem(`message_${msg._id}`) ||
                  messages.find((m) => m._id === msg._id)?.messagePlaintext;
                return {
                  ...msg,
                  message: localPlaintext || "[Message sent]", // Use localStorage or state
                  messagePlaintext: localPlaintext, // Preserve for future use
                };
              }

              if (msg.message && msg.nonce) {
                const senderPublicKey = await getPublicKey(
                  msg.senderId.toString(),
                  isOtherUserLawyer
                );
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

          const pendingMessages = Array.isArray(messages)
            ? messages.filter((msg) => msg.isPending)
            : [];
          const serverMessageIds = new Set(decryptedMessages.map((msg) => msg._id));
          const filteredPendingMessages = pendingMessages.filter(
            (msg) => !serverMessageIds.has(msg._id)
          );

          const combinedMessages = [...decryptedMessages, ...filteredPendingMessages];
          combinedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          console.log("Final Messages State:", combinedMessages);
          setMessages(combinedMessages);
          return combinedMessages;
        } else {
          throw new Error("No messages found");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.error || "Failed to fetch messages");
        return Array.isArray(messages) ? messages : [];
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, userData, lawyerData, privateKey, messages, setMessages, lastFetch, getPublicKey, selectedConversation]
  );

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

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
        console.log("WebSocket Message Received:", message);
        const currentUser = userData || lawyerData;
        const isOwnMessage = message.senderId.toString() === currentUser._id.toString();

        let decryptedText;
        if (isOwnMessage) {
          const localPlaintext =
            localStorage.getItem(`message_${message._id}`) ||
            messages.find((m) => m._id === message._id)?.messagePlaintext;
          decryptedText = localPlaintext || "[Message sent]";
        } else if (message.nonce) {
          const isSenderLawyer = message.senderId === selectedConversation?._id && selectedConversation?.isLawyer;
          const senderPublicKey = await getPublicKey(
            message.senderId.toString(),
            isSenderLawyer
          );
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
          messagePlaintext: isOwnMessage ? decryptedText : undefined, // Preserve plaintext locally
        };
        setMessages((prev) => [...prev, newMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    return () => ws.close();
  }, [userData, lawyerData, privateKey, setMessages, getPublicKey, selectedConversation, messages]);

  const safeMessages = Array.isArray(messages) ? messages : [];

  return { loading, error, messages: safeMessages, getMessages };
};

export default useGetMessages;