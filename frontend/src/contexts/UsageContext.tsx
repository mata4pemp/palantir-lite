import React, { createContext, useContext, useState, ReactNode } from "react";

interface UsageContextType {
  chatsUsed: number;
  chatsLimit: number;
  addChat: () => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider = ({ children }: { children: ReactNode }) => {
  const [chatsUsed, setChatsUsed] = useState(0);
  const chatsLimit = 50; // Free plan limit - adjust as needed

  const addChat = () => {
    setChatsUsed((prev) => Math.min(prev + 1, chatsLimit));
  };

  return (
    <UsageContext.Provider value={{ chatsUsed, chatsLimit, addChat }}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error("useUsage must be used within UsageProvider");
  }
  return context;
};
