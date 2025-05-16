// src/pages/RegisterPage.js
import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("https://fuzzy-points-cry.loca.lt/register", {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message);
  } catch (error) {
    console.error("Kayıt sırasında hata:", error);
    setMessage("Kayıt başarısız oldu.");
  }
};


  return (
    <div style={{ padding: '20px' }}>
      <h2>Kayıt Ol</h2>
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
        <button type="submit">Kayıt Ol</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;
