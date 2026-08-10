import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { askAI } from "../ai/aiService";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessagesList";
import { requestCalendarPermissions } from "../calendar/calendarService";
import { useChat } from "../context/ChatContext";
import { STRINGS } from "../constants/strings";
import { SafeAreaView } from "react-native-safe-area-context";

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
          STRINGS.permissionRequiredTitle,
          STRINGS.permissionRequiredMessage,
          [{ text: STRINGS.ok }],
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
      const isCalendarRequest = STRINGS.calendarKeywordsRegex.test(userMessage);

      if (isCalendarRequest && !hasCalendarPermission) {
        const granted = await requestCalendarPermissions();
        setHasCalendarPermission(granted);

        if (!granted) {
          setTimeout(() => {
            setIsTyping(false);
            inputRef.current?.setProcessing?.(false);

            const errorMessageObj = {
              id: `error-${Date.now()}`,
              text: STRINGS.calendarPermissionDeniedMessage,
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
          text: STRINGS.genericErrorMessage,
          isUser: false,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessageObj]);
      }, 700);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <MessageList messages={messages} isTyping={isTyping} />

        <ChatInput
          ref={inputRef}
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          placeholder={STRINGS.chatInputPlaceholder}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  flexOne: {
    flex: 1,
  },
});
