# Real-Time Chat Application (MERN Stack)

## Overview
This is a real-time chat application built using the **MERN stack** (MongoDB, Express.js, React, and Node.js). It supports real-time messaging with **Socket.io** and authentication using **JWT & Cookies**.

## Features
✅ User authentication (Register/Login) with JWT and HTTP-only cookies  
✅ Real-time messaging using **Socket.io**  
✅ Responsive chat UI with modern design  
✅ Auto-scroll for new messages  
✅ Persistent login session  
✅ Input validation and error handling  
✅ Typing indicator 
✅ Message timestamps 
✅ Group chatrooms
✅ Message timestamps 

## Tech Stack
- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Real-time:** Socket.io
- **Authentication:** JWT & HTTP-only cookies

## Installation & Setup
### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/repo-name.git
cd real-time-chat-app
```

### **2. Install Dependencies**
#### Backend
```bash
cd server
npm install
```
#### Frontend
```bash
cd client
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file inside the **server** folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

### **4. Start the Application**
#### Start Backend Server
```bash
cd server
npm start
```
#### Start Frontend React App
```bash
cd client
npm start
```

### **5. Open the App**
Go to `http://localhost:3000` in your browser.

## API Endpoints (Backend)
### **Authentication Routes**
| Route | Method | Description |
|--------|--------|------------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Log in an existing user |
| `/api/auth/logout` | POST | Log out the user |
| `/api/user/profile` | GET | Get logged-in user info |

### **Messaging Routes**
| Route | Method | Description |
|--------|--------|------------------|
| `/api/messages` | GET | Fetch chat messages |
| `/api/messages` | POST | Send a new message |

## WebSocket Events (Real-Time Messaging)
| Event | Description |
|--------|------------------|
| `joinRoom` | User joins a chat room |
| `sendMessage` | Send a message to a room |
| `receiveMessage` | Receive messages in real time |


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



