import React, { useEffect, useState } from "react";
import socket from "../socket"; // socket.js dosyanın doğru yolu

function ChatPage() {
  const [username] = useState(localStorage.getItem("username"));
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    if (!username) {
      window.location.href = "/";
    }

    // Sunucudan gelen mesajları dinle
    socket.on("message", (msg) => {
      // Eğer mesaj alıcı ya da gönderen bizsek göster
      if (msg.to === username || msg.from === username) {
        setChatLog((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [username]);

  const handleSend = () => {
    if (!receiver || !message.trim()) return;

    const newMessage = {
      from: username,
      to: receiver,
      text: message,
    };

    // Mesajı socket ile backend'e gönder
    socket.emit("message", newMessage);

    // Hemen ekranda göster
    setChatLog((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Merhaba, {username}</h2>

      <input
        placeholder="Mesaj atmak istediğin kullanıcı"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      /><br /><br />

      <div
        style={{
          border: "1px solid #ccc",
          height: "200px",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {chatLog.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.from} ➜ {msg.to}
            </strong>
            : {msg.text}
          </div>
        ))}
      </div>
      <br />

      <input
        placeholder="Mesaj yaz..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Gönder</button>
    </div>
  );
}

export default ChatPage;
