import { useEffect, useState, useRef } from "react";
import { logout } from "./services/auth";
import Auth from "./components/Auth";
import { io } from "socket.io-client";
import { format } from "date-fns";
import "./styles/Chat.css";
import Navbar from "./components/Navbar";


const socket = io("http://localhost:5000");

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API Base URL:", API_BASE_URL); // ✅ Debugging



export default function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("General");
  const [availableRooms, setAvailableRooms] = useState(["General", "Sports", "Tech", "Gaming"]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [typingUser, setTypingUser] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Load saved preference from localStorage
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode); // Save user preference to localStorage
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (user) {
      socket.emit("joinRoom", { username: user.username, room });

      socket.on("userJoined", ({ username, room }) => {
        console.log(`${username} joined ${room}`);
      });

      socket.on("userLeft", ({ username, room }) => {
        console.log(`${username} left ${room}`);
      });

      return () => {
        socket.emit("leaveRoom", { username: user.username, room });
        socket.off("userJoined");
        socket.off("userLeft");
      };
    }
  }, [room, user]);

  useEffect(() => {
    if (user) {
      socket.on("userTyping", (username) => {
        setTypingUser(username);
      });
      socket.on("userStopTyping", () => {
        setTypingUser("");
      });
      return () => {
        socket.off("userTyping");
        socket.off("userStoppedTyping");
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user from:", API_BASE_URL + "/api/user/profile");
      const response = await fetch("${API_BASE_URL}/api/user/profile", {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) setUser(data);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit("joinRoom", room);

      socket.on("receiveMessage", (msgData) => {
        setMessages((prevMessages) => [...prevMessages, msgData]);
      });

      return () => socket.off("receiveMessage");
    }
  }, [room, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      content: message,
      to: room,
      from: user.username,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  const handleTyping = () => {
    socket.emit("typing", { username: user.username, room });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { room });
    }, 1000); // Stops typing after 1 sec of inactivity
  };

  const changeRoom = (newRoom) => {
    socket.emit("leaveRoom", { username: user.username, room });

    // Clear messages when switching rooms
    setMessages([]);

    setRoom(newRoom);
    socket.emit("joinRoom", { username: user.username, room: newRoom });
  };


  const leaveRoom = () => {
    socket.emit("leaveRoom", { username: user.username, room });

    // ✅ Reset room to "General" and clear messages
    setRoom("General");
    setMessages([]); // ✅ Clears messages when switching rooms

    socket.emit("joinRoom", { username: user.username, room: "General" });
  };




  return (
    <div className="chat-container">
      <Navbar user={user} setUser={setUser} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />




      <div className="chat-header">Chat Room: {room}</div>
      <div className="room-selector">
        <label>Select a Room:</label>
        <select value={room} onChange={(e) => changeRoom(e.target.value)}>
          {availableRooms.map((roomName) => (
            <option key={roomName} value={roomName}>{roomName}</option>
          ))}
        </select>
        {room !== "General" && ( // ✅ Show "Leave Room" only if in a non-General room
          <button onClick={leaveRoom} className="leave-room-button">Leave Room</button>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.from === user.username ? "user" : "other"}`}
          >
            <div className="message-content">
              {/* ✅ Display Avatar */}
              <img className="avatar" src={msg.avatar} alt="User Avatar" onError={(e) => e.target.src = "https://i.pravatar.cc/150?u=default"} />
              <div>
                <strong>{msg.from}:</strong> {msg.content}
                {typingUser && (
                  <div className="typing-indicator">{typingUser} is typing...</div>
                )}

                <small className="timestamp">
                  {msg.timestamp ? format(new Date(msg.timestamp), "hh:mm a") : ""}
                </small>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            handleTyping()
          }} // Typing Indicator
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}