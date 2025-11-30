import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import UsageBar from "../UsageBar/UsageBar";


interface SidebarProps {
  onNewChat: () => void; //component receives a prop onnewchat
}

//react function component expects props shaped like sidebarpropps
const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  //able to turn on/off dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    //redirect to sign in after signout
    navigate("/signin");
  };

  return (
    <div className="sidebar">
      <div className="logo">Palantir Lite</div>

      {/* New Chat Button */}
      <button className="new-chat-button" onClick={onNewChat}>
        + New Chat
      </button>
      <Link to="/mychats" className="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M17 9C17 12.866 13.866 16 10 16C9 16 8 15.8 7.2 15.4L3 17L4.6 12.8C4.2 12 4 11 4 10C4 6.134 7.134 3 11 3C14.866 3 17 6.134 17 9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        My Chats
      </Link>
      <Link to="/billing" className="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M2 8H18" stroke="currentColor" strokeWidth="2" />
        </svg>
        Billing
      </Link>

      {/* Bottom of nav bar toggles */}
      <div className="sidebar-footer">
        <UsageBar />
        <button
          className="footer-btn"
          onClick={toggleDarkMode}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? (
            // Sun icon (light mode)
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M10 2V4M10 16V18M18 10H16M4 10H2M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Moon icon (dark mode)
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17 10.5C16.5 14.5 13 17.5 9 17.5C5 17.5 2 14.5 2 10.5C2 6.5 5 3.5 9 3.5C9.5 3.5 10 3.5 10.5 3.5C9.5 5 9 6.5 9 8.5C9 12 11.5 15 15 15C15.5 15 16 15 16.5 14.5C17 13 17.5 11.5 17 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>{darkMode ? "Light" : "Dark"} Mode</span>
        </button>

        {/* Sign out button */}
        <button className="footer-btn sign-out" onClick={handleSignOut}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M13 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H13M7 13L3 9M3 9L7 5M3 9H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
