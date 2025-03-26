// src/zustand/useConversation.js
import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null, // { _id: string, isLawyer: boolean }
  messages: [],
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  clearConversation: () =>
    set({ selectedConversation: null, messages: [] }),
}));

export default useConversation;