const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = 0;

io.on("connection", (socket) => {
  users++;

  io.emit("users-count", users);

  io.emit(
    "welcome",
    `User ${socket.id} joined the chat`
  );

  socket.emit("my-id", socket.id);

  socket.on(
    "private-message",
    ({ receiverId, message }) => {
      io.to(receiverId).emit(
        "private-message",
        {
          sender: socket.id,
          message,
        }
      );
    }
  );

  socket.on("join-room", (room) => {
    socket.join(room);

    io.to(room).emit(
      "room-message",
      `${socket.id} joined room ${room}`
    );
  });

  socket.on(
    "room-message",
    ({ room, message }) => {
      io.to(room).emit(
        "room-message",
        `${socket.id}: ${message}`
      );
    }
  );

  socket.on("disconnect", () => {
    users--;

    io.emit("users-count", users);
  });
});

server.listen(5000, () => {
  console.log("Server Running");
});