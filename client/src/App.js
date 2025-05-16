import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import ChatPage from "./screens/ChatPage"; // bu önemli

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", borderBottom: "1px solid gray" }}>
        <Link to="/">Giriş</Link> | <Link to="/register">Kayıt Ol</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;

