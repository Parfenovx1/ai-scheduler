import React, { createContext, useState, useContext, ReactNode } from "react";
import { MessageType } from "../components/Chat";

interface UserContextType {
  username: string;
  updateUsername: (username: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>("");

  const updateUsername = (username: string) => setUsername(username);

  return (
    <UserContext.Provider
      value={{
        username,
        updateUsername,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
