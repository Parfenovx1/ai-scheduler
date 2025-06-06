import React, { createContext, useState, useContext, ReactNode } from "react";
import { MessageType } from "../components/Chat";

interface ChatContextType {
  isChatStarted: boolean;
  setIsChatStarted: (started: boolean) => void;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const clearChat = () => setMessages([]);

  return (
    <ChatContext.Provider
      value={{
        isChatStarted,
        setIsChatStarted,
        messages,
        setMessages,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
