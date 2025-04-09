import { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import sodium from "libsodium-wrappers";

const useGetMessages = () => {
  // State to manage loading, errors, and pagination
  const [loading, setLoading] = useState(false); // Indicates if messages are being fetched
  const [error, setError] = useState(null); // Stores any error that occurs during fetching
  const [hasMore, setHasMore] = useState(true); // Indicates if there are more messages to load

  // Access conversation state and context values
  const { messages, setMessages, selectedConversation } = useConversation();
  const { backendUrl, userData, lawyerData, privateKey, getPublicKey } = useContext(AppContext);

  // Function to decrypt a message using Libsodium
  const decryptMessage = async (encryptedMessage, nonce, senderPublicKey, receiverPrivateKey) => {
    await sodium.ready; // Ensure Libsodium is ready
    if (!senderPublicKey || !receiverPrivateKey || !encryptedMessage || !nonce) {
      throw new Error("Missing required parameters for decryption");
    }
    try {
      // Decrypt the message using Libsodium
      const decrypted = sodium.crypto_box_open_easy(
        sodium.from_hex(encryptedMessage),
        sodium.from_hex(nonce),
        sodium.from_hex(senderPublicKey),
        sodium.from_hex(receiverPrivateKey)
      );
      return sodium.to_string(decrypted); // Convert decrypted message to string
    } catch (err) {
      console.error("Decryption failed:", err);
      throw err;
    }
  };

  // Function to fetch messages from the backend
  const getMessages = useCallback(
    async (before = null) => {
      const currentUser = userData || lawyerData; // Determine the current user
      if (!currentUser || !privateKey) {
        setError("You must be logged in to view messages");
        return [];
      }

      if (!selectedConversation) {
        setError("No conversation selected");
        return [];
      }

      const otherUserId = selectedConversation._id; // Get the ID of the other user in the conversation
      if (!otherUserId) {
        setError("Invalid conversation partner");
        return [];
      }

      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        // Fetch messages from the backend
        const params = before ? { before } : {}; // Add pagination parameter if provided
        const res = await axios.get(`${backendUrl}/api/messages/${otherUserId}`, {
          params,
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        const data = res.data;
        if (data.success) {
          const newMessages = data.data;

          // Decrypt each message
          const decryptedMessages = await Promise.all(
            newMessages.map(async (msg) => {
              const isOwnMessage = msg.senderId.toString() === currentUser._id.toString(); // Check if the message is sent by the current user
              if (isOwnMessage) {
                // Retrieve plaintext from local storage for sent messages
                const localPlaintext = localStorage.getItem(`message_${msg._id}`);
                return {
                  ...msg,
                  message: localPlaintext || "[Message sent]",
                  messagePlaintext: localPlaintext,
                };
              }
              if (msg.message && msg.nonce) {
                // Decrypt received messages
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
              return msg; // Return the message as-is if it cannot be decrypted
            })
          );

          // Update the messages state
          if (before) {
            setMessages((prev) => [...decryptedMessages, ...prev]); // Append older messages
          } else {
            setMessages(decryptedMessages); // Replace with new messages
          }
          setHasMore(data.hasMore); // Update pagination state
          return decryptedMessages;
        } else {
          throw new Error("No messages found");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.error || "Failed to fetch messages");
        return [];
      } finally {
        setLoading(false); // Stop loading
      }
    },
    [backendUrl, userData, lawyerData, privateKey, setMessages, selectedConversation, getPublicKey]
  );

  // Function to load more messages (pagination)
  const loadMore = useCallback(() => {
    if (messages.length > 0 && hasMore) {
      getMessages(messages[0].createdAt); // Fetch older messages
    }
  }, [messages, hasMore, getMessages]);

  // WebSocket setup to listen for new messages in real-time
  useEffect(() => {
    const wsUrl = backendUrl.replace(/^http/, "ws"); // Convert HTTP URL to WebSocket URL
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      const userId = userData?._id || lawyerData?._id; // Get the current user's ID
      if (userId) {
        ws.send(JSON.stringify({ type: "register", userId })); // Register the user with the WebSocket server
      }
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data); // Parse incoming WebSocket message
      if (data.type === "message") {
        const { message } = data;
        const currentUser = userData || lawyerData;
        const isOwnMessage = message.senderId.toString() === currentUser._id.toString(); // Check if the message is sent by the current user
        let decryptedText;
        if (isOwnMessage) {
          // Retrieve plaintext from local storage for sent messages
          const localPlaintext = localStorage.getItem(`message_${message._id}`);
          decryptedText = localPlaintext || "[Message sent]";
        } else if (message.nonce) {
          // Decrypt received messages
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
          decryptedText = message.message; // Use the raw message if no decryption is needed
        }
        const newMessage = {
          ...message,
          message: decryptedText,
          messagePlaintext: isOwnMessage ? decryptedText : undefined,
        };
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) {
            return prev; // Avoid duplicate messages
          }
          return [...prev, newMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort messages by creation date
        });
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error); // Log WebSocket errors
    return () => ws.close(); // Cleanup WebSocket connection on component unmount
  }, [backendUrl, userData, lawyerData, privateKey, setMessages, getPublicKey, selectedConversation]);

  return { loading, error, messages, getMessages, loadMore, hasMore }; // Return the hook's state and functions
};

export default useGetMessages;