import React, { useEffect } from "react";
import { View, SafeAreaView, StatusBar, Platform } from "react-native";
import { Chat } from "../components/Chat";
import { useChat } from "../context/ChatContext";

export default function ChatScreen() {
  const { setIsChatStarted } = useChat();

  useEffect(() => {
    setIsChatStarted(true);
    return () => setIsChatStarted(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Chat />
    </View>
  );
}
