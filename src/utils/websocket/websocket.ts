import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id);
    console.log("New user added!");
    console.log(userId);
  });

  socket.on("sendNotification", ({ senderId, receiverId, type }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getNotification", {
      senderId,
      type,
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User removed!");
    console.log(socket.id);
  });
});

io.listen(5000);