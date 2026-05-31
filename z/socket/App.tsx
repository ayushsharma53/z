import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(
  "http://localhost:5000"
);

function App() {
  const [page, setPage] =
    useState("home");

  const [users, setUsers] =
    useState(0);

  const [socketId, setSocketId] =
    useState("");

  const [notifications, setNotifications] =
    useState<string[]>([]);

  const [receiverId, setReceiverId] =
    useState("");

  const [privateMessage, setPrivateMessage] =
    useState("");

  const [privateChats, setPrivateChats] =
    useState<string[]>([]);

  const [room, setRoom] =
    useState("");

  const [roomMessage, setRoomMessage] =
    useState("");

  const [roomChats, setRoomChats] =
    useState<string[]>([]);

  useEffect(() => {
    socket.on("users-count", (count) => {
      setUsers(count);
    });

    socket.on("my-id", (id) => {
      setSocketId(id);
    });

    socket.on("welcome", (msg) => {
      setNotifications((prev) => [
        ...prev,
        msg,
      ]);
    });

    socket.on(
      "private-message",
      (data) => {
        setPrivateChats((prev) => [
          ...prev,
          `${data.sender}: ${data.message}`,
        ]);
      }
    );

    socket.on("room-message", (msg) => {
      setRoomChats((prev) => [
        ...prev,
        msg,
      ]);
    });

    return () => {
      socket.off();
    };
  }, []);

  const sendPrivate = () => {
    socket.emit("private-message", {
      receiverId,
      message: privateMessage,
    });

    setPrivateChats((prev) => [
      ...prev,
      `Me: ${privateMessage}`,
    ]);

    setPrivateMessage("");
  };

  const joinRoom = () => {
    socket.emit("join-room", room);
  };

  const sendRoomMessage = () => {
    socket.emit("room-message", {
      room,
      message: roomMessage,
    });

    setRoomMessage("");
  };

  return (
    <div
      style={{
        width: "800px",
        margin: "20px auto",
      }}
    >
      <h1>Socket.IO Chat App</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() =>
            setPage("home")
          }
        >
          Home
        </button>

        <button
          onClick={() =>
            setPage("private")
          }
        >
          Private Chat
        </button>

        <button
          onClick={() =>
            setPage("room")
          }
        >
          Room Chat
        </button>
      </div>

      {page === "home" && (
        <>
          <h2>Home</h2>

          <h3>
            Connected Users : {users}
          </h3>

          <h3>
            Socket ID : {socketId}
          </h3>

          <h3>Status : Online</h3>

          <div>
            {notifications.map(
              (msg, index) => (
                <p key={index}>{msg}</p>
              )
            )}
          </div>
        </>
      )}

      {page === "private" && (
        <>
          <h2>Private Chat</h2>

          <input
            placeholder="Receiver Socket ID"
            value={receiverId}
            onChange={(e) =>
              setReceiverId(
                e.target.value
              )
            }
          />

          <br />
          <br />

          <input
            placeholder="Message"
            value={privateMessage}
            onChange={(e) =>
              setPrivateMessage(
                e.target.value
              )
            }
          />

          <button
            onClick={sendPrivate}
          >
            Send
          </button>

          <div>
            {privateChats.map(
              (chat, index) => (
                <p key={index}>
                  {chat}
                </p>
              )
            )}
          </div>
        </>
      )}

      {page === "room" && (
        <>
          <h2>Room Chat</h2>

          <input
            placeholder="Room Name"
            value={room}
            onChange={(e) =>
              setRoom(
                e.target.value
              )
            }
          />

          <button
            onClick={joinRoom}
          >
            Join Room
          </button>

          <br />
          <br />

          <input
            placeholder="Message"
            value={roomMessage}
            onChange={(e) =>
              setRoomMessage(
                e.target.value
              )
            }
          />

          <button
            onClick={sendRoomMessage}
          >
            Send
          </button>

          <div>
            {roomChats.map(
              (chat, index) => (
                <p key={index}>
                  {chat}
                </p>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;