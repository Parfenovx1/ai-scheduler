import { Trash2Icon } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TrashIcon = ({ color }: { color: string }) => (
  <View
    style={{
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Trash2Icon color={color} />
  </View>
);

interface ChatHeaderProps {
  title: string;
  showClearButton: boolean;
  onClearChat: () => void;
}

export const ChatHeader = ({
  title,
  showClearButton,
  onClearChat,
}: ChatHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {showClearButton && (
        <TouchableOpacity onPress={onClearChat} style={styles.clearButton}>
          <TrashIcon color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  clearButton: {
    padding: 5,
  },
});
