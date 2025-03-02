import { useEffect, useState, useRef } from "react";
import { logout } from "./services/auth";
import Auth from "./components/Auth";
import { io } from "socket.io-client";
import { format } from "date-fns";
import "./styles/Chat.css";
import logo from "./assets/chitchatlogo1.svg"

const socket = io("http://localhost:5000");

export default function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("room1");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

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
      <div className="chat-header">
        <div>Chat Room: {room}</div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.from === user.username ? "user" : "other"}`}
          >
            <div>
              <strong>{msg.from}:</strong> {msg.content}
            </div>
            <small className="timestamp">
              {msg.timestamp ? format(new Date(msg.timestamp), "hh:mm a") : ""}
            </small>
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
