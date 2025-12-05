import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="homepage-nav">
        <div className="nav-container">
          <div className="nav-logo">Palantir Lite</div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate("/signin")}>
              Sign In
            </button>
            <button
              className="nav-button-primary"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your Documents into{" "}
            <span className="gradient-text">Intelligent Conversations</span>
          </h1>
          <p className="hero-description">
            Palantir Lite empowers you to chat with your documents using
            advanced AI. Upload PDFs, YouTube videos, and web links to get
            instant, intelligent answers.
          </p>
          <div className="hero-buttons">
            <button
              className="cta-primary"
              onClick={() => navigate("/newchat")}
            >
              Start Chatting Now
            </button>
            <button className="cta-secondary">Watch Demo</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Palantir Lite?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-description">
              Get instant responses from your documents with our optimized AI
              engine. No more waiting around.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 className="feature-title">Multiple Sources</h3>
            <p className="feature-description">
              Support for PDFs, YouTube videos, Google Docs, and web pages. All
              in one unified chat interface.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-description">
              Your data is encrypted and secure. We never share your documents
              or conversation history.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="feature-title">24/7 Availability</h3>
            <p className="feature-description">
              Access your intelligent assistant anytime, anywhere. Your
              documents are always ready to chat.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="feature-title">Smart Context</h3>
            <p className="feature-description">
              Our AI understands context across multiple documents for more
              accurate and relevant answers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="feature-title">Team Collaboration</h3>
            <p className="feature-description">
              Share chats and insights with your team. Perfect for research,
              education, and business.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <h2 className="section-title">Perfect For Every Use Case</h2>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <h3>Researchers</h3>
            <p>
              Quickly extract insights from academic papers, research documents,
              and literature reviews.
            </p>
          </div>
          <div className="use-case-card">
            <h3>Students</h3>
            <p>
              Study smarter by chatting with lecture notes, textbooks, and
              educational videos.
            </p>
          </div>
          <div className="use-case-card">
            <h3>Professionals</h3>
            <p>
              Analyze reports, contracts, and business documents with AI-powered
              assistance.
            </p>
          </div>
          <div className="use-case-card">
            <h3>Content Creators</h3>
            <p>
              Research and gather information from multiple sources for your
              next project.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Join thousands of users who are already transforming how they
            interact with documents.
          </p>
          <button
            className="cta-primary-large"
            onClick={() => navigate("/newchat")}
          >
            Start Your First Chat
          </button>
        </div>
      </section>
    </div>
  );
}

export default Homepage;