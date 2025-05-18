const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const server = http.createServer(app);

// Cors ve json middleware kodları
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// server kontrolü
app.get("/", (req, res) => {
  res.send("Server aktif");
});

// register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(query, [username, password], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(400).json({ error: "Kullanıcı adı zaten mevcut" });
    }
    res.status(201).json({ message: "Kayıt başarıyla gerçekleşti!", userId: this.lastID });
  });
});

// login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(query, [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Sunucu problemi" });
    }

    if (!row) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    res.json({ message: "Giriş başarıyla gerçekleşti", userId: row.id, username: row.username });
  });
});

// socket.io kodları
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

  socket.on("message", (msg) => {
  io.emit("message", msg);
});
  
  socket.on("disconnect", () => {
    console.log("Kullanıcı sohbetten ayrıldı: " + socket.id);
  });
});

// sunucu başlatma
server.listen(5000, () => {
  console.log("Sunucu aktif: http://localhost:5000");
});
