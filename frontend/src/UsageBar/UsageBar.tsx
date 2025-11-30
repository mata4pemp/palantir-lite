import React from "react";
import { useUsage } from "../contexts/UsageContext";
import "./UsageBar.css";

const UsageBar = () => {
  const { chatsUsed, chatsLimit } = useUsage();
  const percentage = (chatsUsed / chatsLimit) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className="usage-bar-container">
      <div className="usage-bar-header">
        <span className="usage-label">Chats Used</span>
        <span className="usage-count">
          {chatsUsed} / {chatsLimit}
        </span>
      </div>
      <div className="usage-progress-bar">
        <div
          className={`usage-progress-fill ${isNearLimit ? "near-limit" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isNearLimit && <p className="usage-warning">Approaching limit!</p>}
    </div>
  );
};

export default UsageBar;
