import React, { useEffect, useState } from "react";

function ChatPage() {
  const [username] = useState(localStorage.getItem("username"));
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleSend = () => {
    if (!receiver || !message.trim()) return;

    // Şimdilik sadece ekranda gösteriyoruz
    const newMessage = {
      from: username,
      to: receiver,
      text: message,
    };

    setChatLog((prev) => [...prev, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    if (!username) {
      window.location.href = "/";
    }
  }, [username]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Merhaba, {username}</h2>

      <input
        placeholder="Mesaj atmak istediğin kullanıcı"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      /><br /><br />

      <div style={{ border: "1px solid #ccc", height: "200px", padding: "10px", overflowY: "auto" }}>
        {chatLog.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from} ➜ {msg.to}</strong>: {msg.text}
          </div>
        ))}
      </div><br />

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
