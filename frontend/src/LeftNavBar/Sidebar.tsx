import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import UsageBar from "../UsageBar/UsageBar";
import { useEffect } from "react"; // Add useEffect to the imports on line 1
import axios from "axios";

interface SidebarProps {
  onNewChat: () => void; //component receives a prop onnewchat
}

//react function component expects props shaped like sidebarpropps
const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Initialize from localStorage, default to true (dark mode)
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null ? true : savedMode === "true";
  });
  //chat history
  const [chats, setChats] = useState<
    Array<{ _id: string; name: string; updatedAt: string; isPinned?: boolean }>
  >([]);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatName, setEditingChatName] = useState<string>("");

  //able to turn on/off dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());

    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  // Apply dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/chats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setChats(response.data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

useEffect(() => {
  fetchChats();

  // Also listen for manual refresh events
  const handleChatUpdate = () => {
    fetchChats();
  };

  window.addEventListener("chatUpdated", handleChatUpdate);

  // Cleanup listener on unmount
  return () => {
    window.removeEventListener("chatUpdated", handleChatUpdate);
  };
}, [location.pathname]);

  const handleEditChat = (chatId: string, currentName: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setEditingChatId(chatId);
    setEditingChatName(currentName);
  };

  const handleSaveChatName = async (chatId: string) => {
    if (!editingChatName.trim()) return;

    try {
      await axios.put(
        `http://localhost:5001/api/chats/${chatId}/name`,
        { name: editingChatName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingChatId(null);
      setEditingChatName("");
      fetchChats(); // Refresh the list
    } catch (error) {
      console.error("Error updating chat name:", error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation

    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5001/api/chats/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchChats(); // Refresh the list
      // If we're currently viewing this chat, redirect to new chat
      if (location.pathname.includes(chatId)) {
        navigate("/newchat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };

  const handleTogglePin = async (chatId: string, currentPinState: boolean, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation

    try {
      await axios.put(
        `http://localhost:5001/api/chats/${chatId}/pin`,
        { isPinned: !currentPinState },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchChats(); // Refresh the list
    } catch (error) {
      console.error("Error pinning chat:", error);
    }
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
      <Link to="/feedback" className="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 11.8 2.6 13.4 3.6 14.7L2.3 17.7C2.1 18.1 2.5 18.5 2.9 18.3L5.9 17C7.2 17.6 8.6 18 10 18Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 9H7.01M10 9H10.01M13 9H13.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Feedback
      </Link>

      {/* Chat history, see all your chats */}
      <div className="chat-history">
        <h3 className="chat-history-title">Recent Chats</h3>
        <div className="chat-list">
          {chats
            .sort((a, b) => {
              // Sort pinned chats to the top
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return 0;
            })
            .map((chat) => (
            <div key={chat._id} className="chat-list-item-wrapper">
              {editingChatId === chat._id ? (
                <input
                  type="text"
                  value={editingChatName}
                  onChange={(e) => setEditingChatName(e.target.value)}
                  onBlur={() => handleSaveChatName(chat._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveChatName(chat._id);
                    } else if (e.key === "Escape") {
                      setEditingChatId(null);
                      setEditingChatName("");
                    }
                  }}
                  autoFocus
                  className="chat-name-edit-input"
                />
              ) : (
                <Link
                  to={`/newchat/${chat._id}`}
                  className="chat-list-item"
                >
                  <span className="chat-name">{chat.name}</span>
                  <div className="chat-actions">
                    <button
                      className={`pin-chat-button ${chat.isPinned ? 'pinned' : ''}`}
                      onClick={(e) => handleTogglePin(chat._id, chat.isPinned || false, e)}
                      title={chat.isPinned ? "Unpin chat" : "Pin chat"}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={chat.isPinned ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                    <button
                      className="edit-chat-button"
                      onClick={(e) => handleEditChat(chat._id, chat.name, e)}
                      title="Rename chat"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="delete-chat-button"
                      onClick={(e) => handleDeleteChat(chat._id, e)}
                      title="Delete chat"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

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
