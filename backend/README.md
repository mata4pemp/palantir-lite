# Palantir Lite - Backend

Backend API server for Palantir Lite application.

## Overview

This is the Express.js backend server that handles authentication, document processing, AI chat completions, and database operations for the Palantir Lite application.

## Frontend Repository

The frontend application can be found in the parent directory:
[Frontend Repository](../frontend)

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Static type checking
- **JWT** - Token-based authentication
- **OpenAI API** - AI chat completions and audio transcription

## Key Features

- JWT-based authentication with bcrypt password hashing
- RESTful API endpoints for chat, documents, and user management
- Integration with OpenAI GPT-3.5-turbo for AI chat responses
- YouTube video transcription using OpenAI Whisper
- Google Docs/Sheets content extraction
- Notion page content scraping
- PDF document processing
- MongoDB database for user and chat history storage



## Installation

```bash
npm install
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Routes

- **Auth**: `/api/auth` - User authentication (signup, signin, signout)
- **Chat**: `/api/chat` - AI chat completions
- **Chat History**: `/api/chats` - CRUD operations for chat history
- **YouTube**: `/api/youtube` - YouTube video processing and transcription
- **Google Docs**: `/api/google` - Google Docs/Sheets content extraction
- **Notion**: `/api/notion` - Notion page content extraction

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   └── server.ts        # Express server setup
├── uploads/             # Temporary file uploads
└── package.json
```