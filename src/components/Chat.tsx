import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { askAI } from "../ai/aiService";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessagesList";
import { requestCalendarPermissions } from "../calendar/calendarService";
import { useChat } from "../context/ChatContext";

export interface MessageType {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export interface ChatInputRef extends TextInput {
  setProcessing: (processing: boolean) => void;
}

export const Chat = () => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<ChatInputRef>(null);
  const [hasCalendarPermission, setHasCalendarPermission] = useState(false);

  const { messages, setMessages } = useChat();

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestCalendarPermissions();
      setHasCalendarPermission(granted);

      if (!granted) {
        Alert.alert(
          "Требуется разрешение",
          "Для добавления событий в календарь необходимо разрешение. Вы можете изменить это в настройках приложения.",
          [{ text: "OK" }]
        );
      }
    };

    checkPermissions();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    const userMessageObj = {
      id: `user-${Date.now()}`,
      text: userMessage,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessageObj]);

    setIsTyping(true);
    inputRef.current?.setProcessing?.(true);
    Keyboard.dismiss();

    try {
      const isCalendarRequest =
        /добавь|запланируй|запиши|создай.+встречу|событие|календар/i.test(
          userMessage
        );

      if (isCalendarRequest && !hasCalendarPermission) {
        const granted = await requestCalendarPermissions();
        setHasCalendarPermission(granted);

        if (!granted) {
          setTimeout(() => {
            setIsTyping(false);
            inputRef.current?.setProcessing?.(false);

            const errorMessageObj = {
              id: `error-${Date.now()}`,
              text: "Для добавления событий в календарь необходимо разрешение. Пожалуйста, предоставьте разрешение в настройках приложения.",
              isUser: false,
              timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, errorMessageObj]);
          }, 700);
          return;
        }
      }

      const response = await askAI(userMessage);

      setTimeout(() => {
        setIsTyping(false);
        inputRef.current?.setProcessing?.(false);

        const aiMessageObj = {
          id: `ai-${Date.now()}`,
          text: response,
          isUser: false,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessageObj]);
      }, 700);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(false);
        inputRef.current?.setProcessing?.(false);

        const errorMessageObj = {
          id: `error-${Date.now()}`,
          text: "Ошибка при обращении к AI",
          isUser: false,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessageObj]);
      }, 700);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <SafeAreaView style={styles.container}>

      <MessageList messages={messages} isTyping={isTyping} />

      <ChatInput
        ref={inputRef}
        value={input}
        onChangeText={setInput}
        onSend={handleSend}
        placeholder="Задайте вопрос или создайте событие..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
