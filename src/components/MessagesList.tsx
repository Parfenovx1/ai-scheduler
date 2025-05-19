import React, { useRef, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { MessageType } from "./Chat";
import { EmptyChat } from "./EmptyChat";
import { Message } from "./Message";

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
}

export const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <ScrollView
      style={styles.chatContainer}
      ref={scrollViewRef}
      contentContainerStyle={styles.chatContent}
    >
      {messages.length === 0 ? (
        <EmptyChat />
      ) : (
        <View style={styles.messagesContainer}>
          {messages.map((message) => (
            <Message
              key={message.id}
              text={message.text}
              isUser={message.isUser}
            />
          ))}

          {isTyping && <Message isTyping={true} isUser={false} text="" />}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  messagesContainer: {
    width: "100%",
  },
});
