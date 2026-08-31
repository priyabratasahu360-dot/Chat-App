# 💬 ChatApp

A **real-time chat application** built with **React.js, Node.js, Express.js, MongoDB, and Socket.IO**.

ChatApp allows authenticated users to communicate through private one-to-one, groupChat conversations with real-time messaging, online/offline status, image sharing, and a responsive interface for both desktop and mobile devices.

🔗 **Live Demo:** https://chatapp-mqlx.onrender.com

> **Note:** The application is hosted on Render's free tier, so the server may take a little time to respond if it has been inactive.

---

## ✨ Features

* 🔐 **User Authentication**

  * Email-based signup and login
  * Protected routes for authenticated users

* 💬 **Real-Time Messaging**

  * Instant message delivery using Socket.IO
  * Private one-to-one conversations
  * Groupchat 

* 🟢 **Online/Offline Status**

  * See when users are currently online

* 🖼️ **Image Sharing**

  * Upload and send images in conversations
  * Images are stored using Cloudinary

* 📱 **Responsive UI**

  * Designed for both desktop and mobile devices

* 🔒 **Protected Routes**

  * Authenticated users can access protected application pages

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                      |
| ---------------- | ---------------------------- |
| **React.js**     | Building the user interface  |
| **Tailwind CSS** | Styling                      |
| **DaisyUI**      | UI components                |
| **Axios**        | API requests                 |
| **Zustand**      | Client-side state management |

### Backend

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| **Node.js**    | JavaScript runtime      |
| **Express.js** | Backend framework       |
| **MongoDB**    | Database                |
| **Socket.IO**  | Real-time communication |
| **Cloudinary** | Image storage           |

### Development & Deployment

* Docker
* Docker Compose
* Render

> For the complete list of dependencies and tools, check the `package.json` files in the project.

---

## 🏗️ Application Overview

The application follows a client-server architecture:

```text
                    ┌──────────────────┐
                    │     React.js     │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                    HTTP / REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │    Express.js    │
                    │     Backend      │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
          MongoDB       Socket.IO      Cloudinary
          Database      Real-time      Image Storage
                        Messaging
```

---

## 🚀 Getting Started

Follow the steps below to run ChatApp locally.

### Prerequisites

Before running the application, make sure you have:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

* Why Docker?
- Docker is used to containerize the frontend and backend services and simplify local development by allowing the entire application to be started with a single Docker Compose command.

* Git

You will also need accounts/configuration for:

* MongoDB
* Cloudinary

---

## 📥 Clone the Repository

```bash
git clone https://github.com/priyabratasahu360-dot/Chat-App.git

cd Chat-App
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

You can use `.env.example` as a reference(check /backend/.env.example)

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🐳 Run with Docker

From the project root, run:

```bash
docker compose up --build
```

Docker will build and start the required services.

Once the application is running:

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

---

## 📂 Project Structure

```text
Chat-App/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── ...
│   └── ...
│
├── docker-compose.yml
├── README.md
└── ...
```

> The exact structure may change as the project evolves.

---

## 🌐 Live Demo

Try the deployed application:

**https://chatapp-mqlx.onrender.com**

Because the application is deployed using Render's free tier, the backend may spin down after a period of inactivity. The first request after that can therefore take some time.

---

## 🔮 Future Improvements

Some features planned for future versions include:

* 👥 Group conversations
* ➕ Add/remove group members
* 👑 Group admin and member management
* 📞 Voice and video calling
* 🛡️ Privacy settings
* 🔔 Message notifications

---

## 📚 What I Learned

Building this project helped me get hands-on experience with:

* Building REST APIs with Express.js
* Connecting a React frontend with a Node.js backend
* MongoDB database design and operations
* Authentication, authorizaation and protected routes
* Role based access control
* State management with Zustand
* Real-time communication with Socket.IO
* Handling file/image uploads
* Cloudinary integration
* Docker and Docker Compose
* Deploying a full-stack application

---

## 👨‍💻 Author

**Priyabrata Sahu**

GitHub:
https://github.com/priyabratasahu360-dot

---
