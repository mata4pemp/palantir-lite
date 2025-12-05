import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../LeftNavBar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    // Navigate to /newchat without chatId
    navigate("/newchat");

    // Dispatch a custom event to reset the chat state
    // This ensures the NewChat component resets even if already on /newchat
    window.dispatchEvent(new CustomEvent("resetChat"));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onNewChat={handleNewChat} />
      <div style={{ marginLeft: "260px", flex: 1, padding: "2rem", overflowY: "auto" }}>{children}</div>
    </div>
  );
};

export default Layout;
