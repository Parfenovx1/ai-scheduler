import { ArrowUp } from "lucide-react-native";
import React, { forwardRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

const SendIcon = ({ color }: { color: string }) => (
  <View
    style={{
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <ArrowUp color={color} />
  </View>
);

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export const ChatInput = forwardRef<TextInput, ChatInputProps>(
  (
    { value, onChangeText, onSend, placeholder = "Напиши сообщение..." },
    ref
  ) => {
    const isDisabled = !value.trim();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref}
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, isDisabled && styles.sendButtonDisabled]}
            onPress={onSend}
            disabled={isDisabled}
          >
            <SendIcon color={isDisabled ? "#A0A0A0" : "#fff"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: "#2563eb",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginBottom: Platform.OS === "ios" ? 1 : 0,
  },
  sendButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
});
