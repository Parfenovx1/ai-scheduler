import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "../screens/ChatScreen";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { ChatProvider } from "../context/ChatContext";
import ClearChatButton from "../components/ClearChatButton";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <ChatProvider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerRight: () => <ClearChatButton />,
            headerShown: true,
            headerTitle: "",
            headerLeftContainerStyle: { paddingLeft: 16 },
          }}
        >
          <Drawer.Screen name="Chat" component={ChatScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ChatProvider>
  );
}
