# 💬 ChatApp

A full-stack, real-time messaging platform built with **React, Node.js, Express.js, MongoDB, and Socket.IO**, wrapped in a nostalgic Windows 95/Retro-desktop UI theme.

ChatApp provides seamless 1-on-1 direct messaging, collaborative group conversations with role-based administration, live presence detection, Cloudinary-backed image sharing, and responsive layouts for desktop and mobile devices.

🔗 **Live Demo:** [https://chatapp-mqlx.onrender.com](https://chatapp-mqlx.onrender.com)

> ⚠️ **Note:** Hosted on Render's free tier. The server may require 30–50 seconds to spin up on initial load after inactivity.

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [📡 API Endpoints Documentation](#-api-endpoints-documentation)
  - [Authentication Routes (`/api/auth`)](#1-authentication-routes-apiauth)
  - [1-on-1 Messaging Routes (`/api/message`)](#2-1-on-1-messaging-routes-apimessage)
  - [Group Chat Routes (`/api/groups`)](#3-group-chat-routes-apigroups)
- [⚡ Real-Time Socket.IO Events](#-real-time-socketio-events)
- [💾 Data Models](#-data-models)
- [🔐 Environment Variables](#-environment-variables)
- [🚀 Local Development & Setup](#-local-development--setup)
  - [Option A: Running with Docker (Recommended)](#option-a-running-with-docker-recommended)
  - [Option B: Running Manually](#option-b-running-manually)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🔮 Future Roadmap](#-future-roadmap)
- [👨‍💻 Author](#-author)

---

## ✨ Key Features

### 🔐 Authentication & Session Management
- **JWT Authentication via HTTP-Only Cookies**: Secure, XSS-protected token cookie sessions.
- **Password Security**: Strong hashing with `bcryptjs`.
- **Persistent Auth Verification**: Automatic session validation on page refresh (`/check`).

### 💬 Real-Time 1-on-1 Messaging
- **Instant Delivery**: Powered by Socket.IO bi-directional WebSocket events.
- **Image Sharing**: Send inline screenshots/photos seamlessly via Cloudinary CDN base64 upload.
- **Unread & Active Conversation State**: Handled smoothly using Zustand state stores.

### 👥 Group Conversations & Admin Controls
- **Create Custom Groups**: Set group name, description, and initial participants.
- **Role-Based Permissions (RBAC)**: Group creators automatically receive the `admin` role with exclusive powers.
- **Member Management**: Admins can add new participants or remove existing members from the group.
- **Real-Time Group Broadcasts**: Socket room-based event dispatching (`join_group`, `leave_group`, `receive_group_message`).
- **Group Metadata & Drawer View**: Inspect group members, roles, dates, and member list in a dedicated info panel.

### 🟢 Live Presence & Status Detection
- **Active User Tracking**: Centralized socket map tracks real-time connected users across the app.
- **Online Filter**: Sidebar toggle to quickly filter and display only online contacts.
- **Instant Status Badges**: Visual green indicators showing active online status.

### 🎨 Retro Desktop Design System
- **Classic 90s OS Aesthetic**: Distinctive nostalgic window chrome, title bars, beveled borders, and custom buttons built using Tailwind CSS and DaisyUI.
- **Audio Sound Effects**: Audio cues for actions and retro interactions.
- **Responsive Interface**: Optimized layout across mobile and desktop breakpoints.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|---|---|
| **React 19** | Modern component-based view library |
| **Vite 7** | Fast frontend build tool and dev server |
| **Tailwind CSS v4 & DaisyUI** | Utility-first styling with retro design system |
| **Zustand** | Lightweight, reactive state management stores |
| **Socket.IO Client** | Real-time WebSocket connection to backend |
| **Axios** | HTTP client configured with cookie credentials |
| **React Router v7** | Client-side routing and protected routes |
| **React Hot Toast** | Toast notifications for user actions and error handling |
| **Lucide React** | Clean, retro-styled icon set |

### Backend
| Technology | Description |
|---|---|
| **Node.js** | JavaScript server runtime environment |
| **Express.js 5** | Web framework and REST API server |
| **MongoDB & Mongoose 9** | NoSQL document database and schema modeling |
| **Socket.IO** | Bi-directional, low-latency WebSocket communication |
| **JWT (`jsonwebtoken`)** | Signed token generation for authentication |
| **Bcryptjs** | Password salt hashing and comparison |
| **Cloudinary SDK** | Media cloud storage and asset management |
| **Cookie-Parser & CORS** | Secure cross-origin cookie credentials support |

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│   (Zustand Stores: useAuthStore, useChatStore, useGroupChat)│
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
         HTTP REST APIs                   WebSockets
      (Axios + Credentials)              (Socket.IO)
                │                             │
                ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express.js Backend                      │
│             (Auth, Messages, Groups Controllers)            │
└───────┬─────────────────────┬───────────────────────┬───────┘
        │                     │                       │
        ▼                     ▼                       ▼
┌───────────────┐     ┌───────────────┐       ┌───────────────┐
│    MongoDB    │     │   Socket.IO   │       │  Cloudinary   │
│   Database    │     │  Room Engine  │       │ CDN & Storage │
└───────────────┘     └───────────────┘       └───────────────┘
```

---

## 📡 API Endpoints Documentation

All requests requiring authentication expect the `jwt` HTTP-only cookie to be present.

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body / Payload |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user | `{ "fullname": "John Doe", "email": "john@example.com", "password": "password123" }` |
| `POST` | `/api/auth/login` | Public | Authenticate existing user | `{ "email": "john@example.com", "password": "password123" }` |
| `POST` | `/api/auth/logout` | Public | Invalidate session & clear cookie | _None_ |
| `GET` | `/api/auth/check` | Protected | Validate cookie & return user details | _None_ |
| `POST` | `/api/auth/update-profile`| Protected | Update user profile avatar | `{ "profilePicture": "data:image/png;base64,..." }` |

---

### 2. 1-on-1 Messaging Routes (`/api/message`)

| Method | Endpoint | Access | Description | Request Body / Payload |
|---|---|---|---|---|
| `GET` | `/api/message/users` | Protected | Retrieve all users for sidebar (excluding current user) | _None_ |
| `GET` | `/api/message/:id` | Protected | Fetch conversation message history between current user and `:id` | _None_ |
| `POST` | `/api/message/send/:id` | Protected | Send direct message (text and/or image) to user `:id` | `{ "text": "Hello!", "image": "data:image/png;base64,..." }` *(optional)* |

---

### 3. Group Chat Routes (`/api/groups`)

| Method | Endpoint | Access | Description | Request Body / Payload |
|---|---|---|---|---|
| `POST` | `/api/groups` | Protected | Create new group (creator becomes `admin`) | `{ "name": "Team Chat", "description": "Project discussions", "userIds": ["userId1", "userId2"] }` |
| `GET` | `/api/groups` | Protected | Get all groups current user is a member of | _None_ |
| `GET` | `/api/groups/:groupId` | Protected | Get metadata and details for a specific group | _None_ |
| `PUT` | `/api/groups/:groupId` | Admin Only | Update group name and description | `{ "name": "New Name", "description": "New description" }` |
| `GET` | `/api/groups/:groupId/members` | Member Only | Fetch all members belonging to group `:groupId` | _None_ |
| `POST` | `/api/groups/:groupId/members` | Admin Only | Add new members to group | `{ "addUserIds": ["userId1", "userId2"] }` |
| `DELETE`| `/api/groups/:groupId/members/:userId` | Admin Only | Remove a member from group | _None_ |
| `GET` | `/api/groups/:groupId/messages` | Member Only | Fetch all past message history of group | _None_ |
| `POST` | `/api/groups/:groupId/messages` | Member Only | Send a new message to group | `{ "text": "Hey everyone!" }` |

---

## ⚡ Real-Time Socket.IO Events

The Socket.IO server manages real-time communication, user presence, and group rooms:

### Client $\rightarrow$ Server Events
- **`connection`**: Initiated with query parameter `?userId=<mongoUserId>`. Registers user socket ID.
- **`join_group` (`groupId`)**: Subscribes user socket to a group room channel.
- **`leave_group` (`groupId`)**: Unsubscribes socket from the group room.
- **`disconnect`**: Cleans up socket registration and broadcasts updated online list.

### Server $\rightarrow$ Client Events
- **`getOnlineUsers` (`userIds[]`)**: Broadcast to all clients whenever users connect or disconnect.
- **`newMessage` (`messageObject`)**: Targeted emit to recipient socket ID upon new 1-on-1 message.
- **`receive_group_message` (`groupChatObject`)**: Broadcast to the corresponding `groupId` room with sender info populated.

---

## 💾 Data Models

- **`User`**:
  - `fullname` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, min 6 chars)
  - `profilePicture` (String, default avatar url)
- **`Message`** (1-on-1):
  - `senderId` (ObjectId $\rightarrow$ User, required)
  - `receiverId` (ObjectId $\rightarrow$ User, required)
  - `text` (String)
  - `image` (String, Cloudinary url)
- **`Group`**:
  - `name` (String, required)
  - `description` (String)
- **`GroupMember`**:
  - `groupId` (ObjectId $\rightarrow$ Group, required)
  - `userId` (ObjectId $\rightarrow$ User, required)
  - `role` (String, enum: `["admin", "member"]`, default: `"member"`)
- **`GroupChat`**:
  - `groupId` (ObjectId $\rightarrow$ Group, required)
  - `senderId` (ObjectId $\rightarrow$ User, required)
  - `content` (String, required)

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

*(Reference provided in [`backend/.env.example`](file:///c:/Users/priya/Desktop/MERN/chat-app/backend/.env.example))*

---

## 🚀 Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [Cloudinary Account](https://cloudinary.com/) (Free tier)
- [Docker & Docker Compose](https://www.docker.com/) *(Optional, for containerized run)*

### Option A: Running with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/priyabratasahu360-dot/Chat-App.git
   cd Chat-App
   ```

2. **Configure environment:**
   Create and populate `backend/.env` with your credentials.

3. **Build and start containers:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

### Option B: Running Manually

1. **Install backend dependencies & start server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **In a separate terminal, install frontend dependencies & start Vite:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Directory Structure

```text
Chat-App/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handling logic
│   │   │   ├── auth.controller.js
│   │   │   ├── group.controller.js
│   │   │   └── message.controller.js
│   │   ├── middleware/          # Route protection & RBAC
│   │   │   ├── auth.middleware.js
│   │   │   └── isAdmin.js
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── Group.model.js
│   │   │   ├── GroupChat.model.js
│   │   │   ├── GroupMember.model.js
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── lib/                 # Socket.IO, DB, Cloudinary & JWT helpers
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── socket.js
│   │   │   └── utils.js
│   │   ├── routes/              # Express API route declarations
│   │   │   ├── auth.route.js
│   │   │   ├── group.route.js
│   │   │   └── message.route.js
│   │   └── index.js             # Express app & HTTP server entrypoint
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI, Chat windows, modals & headers
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── GroupChatsContainer.jsx
│   │   │   ├── GroupInfo.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── pages/               # Top-level view routes
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── store/               # Zustand global state stores
│   │   │   ├── useAuthStore.js
│   │   │   ├── useChatStore.js
│   │   │   └── useGroupChat.js
│   │   ├── lib/                 # Axios instance & utility functions
│   │   ├── App.jsx              # Main App layout & route definitions
│   │   └── main.jsx             # React DOM entrypoint
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml           # Multi-container local orchestration
└── README.md                    # Project documentation
```

---

## 🔮 Future Roadmap

- 📞 **Voice & Video Calling**: WebRTC-based 1-on-1 and group calling.
- 🔔 **Push Notifications**: Web push notifications for background message alerts.
- 📎 **File & Document Sharing**: PDF, zip, and general document sharing support.
- ✏️ **Message Editing & Deletion**: Soft deletes and message update history.
- 🔍 **Global Message Search**: Search messages across both direct and group conversations.

---

## 👨‍💻 Author

**Priyabrata Sahu**
- GitHub: [@priyabratasahu360-dot](https://github.com/priyabratasahu360-dot)
