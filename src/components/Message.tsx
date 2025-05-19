import { useRef, useEffect } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { TypingIndicator } from "./TypingIndicator";

interface MessageProps {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

export const Message = ({ text, isUser, isTyping = false }: MessageProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        { opacity: fadeAnim },
      ]}
    >
      {isTyping ? (
        <TypingIndicator />
      ) : (
        <Text
          selectable
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {text}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    borderTopRightRadius: 4,
  },
  aiMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#333",
  },
});
