import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../LeftNavBar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate("/newchat");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onNewChat={handleNewChat} />
      <div style={{ marginLeft: "260px", flex: 1, padding: "2rem", overflowY: "auto" }}>{children}</div>
    </div>
  );
};

export default Layout;
