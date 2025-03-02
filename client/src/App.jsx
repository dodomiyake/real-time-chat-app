import { useEffect, useState, useRef } from "react";
import { logout } from "./services/auth";
import Auth from "./components/Auth";
import { io } from "socket.io-client";
import { format } from "date-fns";
import "./styles/Chat.css";
import Navbar from "./components/Navbar";


const socket = io("http://localhost:5000");

export default function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("room1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const [ darkMode, setDarkMode ] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Load saved preference from localStorage
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode); // Save user preference to localStorage
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:5000/api/user/profile", {
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

  return (
    <div className="chat-container">
      <Navbar user={user} setUser={setUser} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />


      <div className="chat-header">Chat Room: {room}</div>

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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}