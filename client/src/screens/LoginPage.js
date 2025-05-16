import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://fuzzy-points-cry.loca.lt/login', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Giriş başarılı");
      localStorage.setItem("username", data.username);
      // Chat ekranına yönlendir
      navigate("/chat");
    } else {
      setMessage(data.error || "Giriş başarısız");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Giriş Yap</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginPage;
