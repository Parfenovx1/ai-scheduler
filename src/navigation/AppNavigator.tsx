import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "../screens/ChatScreen";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { ChatProvider } from "../context/ChatContext";
import ClearChatButton from "../components/ClearChatButton";
import { UserProvider } from "../context/UserContext";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <ChatProvider>
      <UserProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerRight: () => <ClearChatButton />,
              headerShown: true,
              headerTitle: "",
              headerLeftContainerStyle: { paddingLeft: 16 },
              drawerStyle: {
                width: "84%",
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 12,
              },
              overlayColor: "rgba(0,0,0,0.35)",
            }}
          >
            <Drawer.Screen name="Chat" component={ChatScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </UserProvider>
    </ChatProvider>
  );
}
