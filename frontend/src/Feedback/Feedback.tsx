import React, { useState } from "react";
import "./Feedback.css";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Integrate with backend API to send feedback
    setTimeout(() => {
      setSubmitMessage("Thank you for your feedback! We'll review it soon.");
      setFormData({ name: "", email: "", feedback: "" });
      setIsSubmitting(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(""), 5000);
    }, 1000);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1 className="feedback-title">We Value Your Feedback</h1>
        <p className="feedback-description">
          Help us improve Palantir Lite! Share your thoughts, suggestions, or
          report any issues you've encountered. Your feedback helps us build a
          better product for everyone.
        </p>
      </div>

      <div className="feedback-form-section">
        <h2 className="form-heading">Contact Us</h2>
        <p className="form-description">
          Fill out the form below and we'll get back to you as soon as
          possible.
        </p>

        {submitMessage && (
          <div className="success-message">{submitMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="feedback" className="form-label">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              className="form-textarea"
              required
              rows={8}
              placeholder="Tell us what you think, what features you'd like to see, or any issues you've encountered..."
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
