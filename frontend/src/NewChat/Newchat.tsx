import React, { useState } from "react";
import "./Newchat.css";

function NewChat() {
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
      setChatMessages([...chatMessages, { role: "user", content: chatInput }]);
      setChatInput("");
    }
  };

  const handleAdd = () => {
    if (!link.trim()) {
        setLinkError("Please enter a URL");
        return;
    }

    if(!isValidURL(link)){
        setLinkError("This is not a valid URL, please insert a valid URL link")
        return;
    }

    //if valid URL, clear error and add the link
    setLinkError("");
    setAddedLinks([...addedLinks, { type: selectedType, url: link }]);
    setLink(""); //clear input after adding
  };

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
            <div style={{ color: 'red', fontSize: '14px', marginTop: '8px', marginBottom: '8px' }}>
              {linkError}
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="add-button"
          >
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
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      {item.url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
              resize: 'none',
              overflow: 'hidden',
              minHeight: '40px',
              maxHeight: '200px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
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
