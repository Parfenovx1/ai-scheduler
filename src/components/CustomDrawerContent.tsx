import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useUser } from "../context/UserContext";
import { useKeyboardMargin } from "../hooks/useKeyboardMargin";

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const { username, updateUsername } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const animatedKeyboardStyle = useKeyboardMargin();

  const handleSave = () => {
    if (tempUsername.trim()) {
      updateUsername(tempUsername.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempUsername(username);
    setIsEditing(false);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scrollContent}
      style={styles.drawerBorder}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.spacer} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Animated.View style={[styles.userSection, animatedKeyboardStyle]}>
          {isEditing ? (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={styles.editContainer}
            >
              <TextInput
                style={styles.input}
                value={tempUsername}
                onChangeText={setTempUsername}
                placeholder="Enter username"
                autoFocus
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={styles.row}
            >
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.avatarText}>MP</Text>
              </TouchableOpacity>
              <Text style={styles.userName}>{username}</Text>
            </Animated.View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  drawerBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#d0d0d0",
  },
  spacer: {
    flex: 1,
  },
  userSection: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
  editContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#007aff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
});
