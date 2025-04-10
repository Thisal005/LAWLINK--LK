import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useConversation from "../zustand/useConversation";
import { AppContext } from "../Context/AppContext";
import sodium from "libsodium-wrappers";

const useSendMessage = () => {
  // State to manage loading status
  const [loading, setLoading] = useState(false);

  // Access conversation state and context values
  const { messages, setMessages, selectedConversation } = useConversation();
  const { backendUrl, userData, lawyerData, privateKey, getPublicKey } = useContext(AppContext);

  // Function to encrypt a message using Libsodium
  const encryptMessage = async (message, senderPrivateKey, receiverPublicKey) => {
    await sodium.ready; // Ensure Libsodium is ready
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES); // Generate a random nonce
    const encrypted = sodium.crypto_box_easy(
      message,
      nonce,
      sodium.from_hex(receiverPublicKey), // Convert receiver's public key to bytes
      sodium.from_hex(senderPrivateKey) // Convert sender's private key to bytes
    );
    console.log("Encryption - Sender Private:", senderPrivateKey, "Receiver Public:", receiverPublicKey);
    return {
      encrypted: sodium.to_hex(encrypted), // Convert encrypted message to hex
      nonce: sodium.to_hex(nonce), // Convert nonce to hex
    };
  };

  // Function to send a message
  const sendMessage = async (messageText, files = []) => {
    // Prevent sending if no message or files are provided, or if already loading
    if ((!messageText.trim() && files.length === 0) || loading) return;

    // Get the current user (either userData or lawyerData)
    const currentUser = userData || lawyerData;
    if (!currentUser || !privateKey) {
      toast.error("You must be logged in to send messages");
      return;
    }

    // Ensure a conversation is selected
    if (!selectedConversation) {
      toast.error("No conversation selected");
      return;
    }

    // Get the receiver's ID and whether they are a lawyer
    const receiverId = selectedConversation._id;
    const isReceiverLawyer = selectedConversation.isLawyer;

    // Fetch the receiver's public key
    const receiverPublicKey = await getPublicKey(receiverId, isReceiverLawyer);
    if (!receiverPublicKey) {
      toast.error("Failed to fetch receiver's public key");
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      let encryptedMessage = "";
      let nonce = "";

      // Encrypt the message text if provided
      if (messageText.trim()) {
        const { encrypted, nonce: messageNonce } = await encryptMessage(
          messageText,
          privateKey,
          receiverPublicKey
        );
        encryptedMessage = encrypted;
        nonce = messageNonce;
      }

      // Prepare the form data for the API request
      const formData = new FormData();
      formData.append("message", encryptedMessage); // Add encrypted message
      formData.append("nonce", nonce); // Add nonce
      files.forEach((file) => {
        formData.append("documents", file); // Add attached files
      });

      // Send the message to the backend
      const res = await axios.post(`${backendUrl}/api/messages/send/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Handle successful response
      if (res.data.success) {
        const newMessage = {
          ...res.data.data,
          message: messageText, // Display plaintext for the sender immediately
          messagePlaintext: messageText, // Store plaintext locally in state
          isPending: false, // Mark the message as sent
        };
        localStorage.setItem(`message_${String(newMessage._id)}`, messageText); // Cache plaintext in local storage
        setMessages((prev) => [...prev, newMessage]); // Update the messages state
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message"); // Show error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Return the loading state and sendMessage function
  return { loading, sendMessage };
};

export default useSendMessage;