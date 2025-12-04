import React from "react";
import { useUsage } from "../contexts/UsageContext";
import "./Billing.css";

function Billing() {
  const { chatsUsed, chatsLimit } = useUsage();

  const handleManageSubscription = () => {
    // TODO: Integrate with Stripe Customer Portal
    console.log("Manage subscription clicked - Stripe integration pending");
  };

  const handleDownloadInvoices = () => {
    // TODO: Integrate with Stripe Invoices API
    console.log("Download invoices clicked - Stripe integration pending");
  };

  return (
    <div className="billing-container">
      <h1 className="billing-title">Billing & Subscription</h1>

      {/* Plan Information Section */}
      <div className="billing-section">
        <h2 className="section-heading">Current Plan</h2>
        <div className="plan-details">
          <div className="detail-row">
            <span className="detail-label">Plan Name:</span>
            <span className="detail-value">Starter</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Billing Cycle:</span>
            <span className="detail-value">Monthly</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Next Billing Date:</span>
            <span className="detail-value stripe-pending">
              Awaiting Stripe integration
            </span>
          </div>
        </div>
      </div>

      {/* Usage Section */}
      <div className="billing-section">
        <h2 className="section-heading">Usage</h2>
        <div className="usage-details">
          <div className="detail-row">
            <span className="detail-label">Chat Credits Used:</span>
            <span className="detail-value">
              {chatsUsed} / {chatsLimit}
            </span>
          </div>
          <div className="billing-usage-bar-container">
            <div
              className="billing-usage-bar-fill"
              style={{ width: `${(chatsUsed / chatsLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Manage Subscription Section */}
      <div className="billing-section">
        <h2 className="section-heading">Manage Subscription</h2>
        <p className="section-description">
          Update your payment method, change your plan, or cancel your
          subscription.
        </p>
        <button className="billing-button" onClick={handleManageSubscription}>
          Manage Subscription
        </button>
      </div>

      {/* Download Invoices Section */}
      <div className="billing-section">
        <h2 className="section-heading">Download Invoices</h2>
        <p className="section-description">
          Access and download your billing history and invoices.
        </p>
        <button className="billing-button" onClick={handleDownloadInvoices}>
          Download Invoices
        </button>
      </div>
    </div>
  );
}

export default Billing;