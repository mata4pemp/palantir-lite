import React, { useState, useEffect } from "react";
import "./Newchat.css";
import { useUsage } from "../contexts/UsageContext";


function NewChat() {
    //track chat usage for usage meter
    const { addChat, chatsUsed, chatsLimit } = useUsage();

  const [selectedType, setSelectedType] = useState<string>("Youtube Video");
  const [link, setLink] = useState<string>("");
  const [addedLinks, setAddedLinks] = useState<
    Array<{ type: string; url: string }>
  >([]);

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [linkError, setLinkError] = useState<string>("");

  //text popup for the custom text
  const [showTextPopup, setShowTextPopup] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>("");

  // which text is being edited, null add new custom text, number edit an existing item at the index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  //check if the input of the link is valid URL
  const isValidURL = (urlString: string): boolean => {
    if (!urlString.trim()) return false;
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
        //check if usage limit reached
        if (chatsUsed >= chatsLimit){
            alert('You have reached your chat limit! Please upgrade your plan')
            return;
        }
      setChatMessages([...chatMessages, { role: "user", content: chatInput }]);
      setChatInput("");
      addChat(); // Track the chat usage
    }
  };

  const handleAdd = () => {
    if (!link.trim()) {
      setLinkError("Please enter a URL");
      return;
    }

    if (!isValidURL(link)) {
      setLinkError("This is not a valid URL, please insert a valid URL link");
      return;
    }

    //if valid URL, clear error and add the link
    setLinkError("");
    setAddedLinks([...addedLinks, { type: selectedType, url: link }]);
    setLink(""); //clear input after adding
  };

  const handleSaveCustomText = () => {
    if (customText.trim()) {
      if (editingIndex !== null) {
        // Editing existing item
        const updatedLinks = [...addedLinks];
        updatedLinks[editingIndex] = { type: "Custom Text", url: customText };
        setAddedLinks(updatedLinks);
        setEditingIndex(null);
      } else {
        // Adding new item
        setAddedLinks([
          ...addedLinks,
          { type: "Custom Text", url: customText },
        ]);
      }
      setCustomText(""); //clear the text
      setShowTextPopup(false); // close popup
    }
  };

  const handleEditCustomText = (index: number) => {
    setCustomText(addedLinks[index].url);
    setEditingIndex(index);
    setShowTextPopup(true);
  };

  //delete the added documents
  const handleDeleteDocument = (index: number) => {
    const updatedLinks = addedLinks.filter((_, i) => i !== index);
    setAddedLinks(updatedLinks);
  };

  //auto show popup when custom test is selcted
  useEffect(() => {
    if (selectedType === "Custom Text") {
      setShowTextPopup(true);
    }
  }, [selectedType]);

  return (
    <div className="newchat-container">
      {/* Left Panel - Document Upload */}
      <div className="left-panel">
        <h1>New Chat</h1>
        <p>Add your documents below so you can chat with them!</p>
        <div>
          {/* Select your type of document to upload */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="document-select"
          >
            <option value="Youtube Video">Youtube Video</option>
            <option value="Google Docs">Google Docs</option>
            <option value="Google Sheets">Google Sheets</option>
            <option value="Notion Page">Notion Page</option>
            <option value="Custom Text">Custom Text</option>
          </select>

          {/* Input your link */}
          <input
            type="url"
            placeholder="Place your link here"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setLinkError("");
            }}
            className="link-input"
          />

          {/* Error message */}
          {linkError && (
            <div
              style={{
                color: "red",
                fontSize: "14px",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              {linkError}
            </div>
          )}

          {/* Add Button */}
          <button onClick={handleAdd} className="add-button">
            Add
          </button>
        </div>

        {/* Display the added links as components, which documents did users add? */}
        {addedLinks.length > 0 && (
          <div className="added-documents">
            <h3>Added Documents:</h3>
            <ul className="documents-list">
              {addedLinks.map((item, index) => (
                <li key={index} className="document-item">
                  <div>
                    <strong>{item.type}:</strong>{" "}
                    {item.type === "Custom Text" ? (
                      <span className="document-link">{item.url}</span>
                    ) : (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                  <div className="document-actions">
                    {item.type === "Custom Text" && (
                      <button
                        onClick={() => handleEditCustomText(index)}
                        className="edit-button"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
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
                    )}
                    <button
                      onClick={() => handleDeleteDocument(index)}
                      className="delete-button"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Popup code for custom text */}
      {showTextPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add Custom Text</h2>
            <textarea
              placeholder="Paste your text here..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="custom-text-area"
              rows={10}
            />
            <div className="popup-buttons">
              <button onClick={handleSaveCustomText} className="save-button">
                Save
              </button>
              <button
                onClick={() => {
                  setShowTextPopup(false);
                  setCustomText("");
                  setEditingIndex(null);
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Chat Interface */}
      <div className="right-panel">
        {/* Chat Messages Area */}
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div className="chat-placeholder">
              Start a conversation with your documents...
            </div>
          ) : (
            chatMessages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                {message.content}
              </div>
            ))
          )}
        </div>

        {/* Chat Input Area */}
        <div className="chat-input-area">
          <textarea
            placeholder="Message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="chat-input"
            rows={1}
            style={{
              resize: "none",
              overflow: "hidden",
              minHeight: "40px",
              maxHeight: "200px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewChat;
