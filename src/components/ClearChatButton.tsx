import React from "react";
import { TouchableOpacity } from "react-native";
import { Trash2Icon } from "lucide-react-native";
import { useChat } from "../context/ChatContext";

const ClearChatButton = () => {
  const { messages, clearChat } = useChat();

  if (messages.length === 0) return null;

  return (
    <TouchableOpacity onPress={clearChat} style={{ paddingRight: 16 }}>
      <Trash2Icon color="#666" />
    </TouchableOpacity>
  );
};

export default ClearChatButton;
