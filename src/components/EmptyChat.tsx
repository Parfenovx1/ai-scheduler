// EmptyChat.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STRINGS } from "../constants/strings";

interface EmptyChatProps {
  message?: string;
}

export const EmptyChat = ({ message = STRINGS.emptyChatMessage }: EmptyChatProps) => {
  return (
    <View style={styles.emptyChat}>
      <Text style={styles.emptyChatText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 300,
  },
  emptyChatText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },
});