const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const server = http.createServer(app);

// 🔥 CORS ve JSON body middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔥 TEST: Ayakta mı
app.get("/", (req, res) => {
  res.send("Server ayakta!");
});

// 🔥 REGISTER ROTASI
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(query, [username, password], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(400).json({ error: "Kullanıcı adı zaten var." });
    }
    res.status(201).json({ message: "Kayıt başarılı!", userId: this.lastID });
  });
});

// 🔥 LOGIN ROTASI
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(query, [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Sunucu hatası" });
    }

    if (!row) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    res.json({ message: "Giriş başarılı", userId: row.id, username: row.username });
  });
});

// 🔥 SOCKET.IO
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı: " + socket.id);

  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", {
      from: socket.id,
      signal: data.signal
    });
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı: " + socket.id);
  });
});

// 🔥 SUNUCUYU BAŞLAT
server.listen(5000, () => {
  console.log("Sunucu çalışıyor: http://localhost:5000");
});
