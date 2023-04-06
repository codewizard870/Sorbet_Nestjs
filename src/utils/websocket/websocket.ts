import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (userId: string, socketId: string) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket: any) => {
  socket.on("newUser", (userId: string) => {
    addNewUser(userId, socket.id);
    console.log("New user added!");
    console.log(userId);
  });

  socket.on("sendNotification", ({ senderId, receiverId, type }) => {
    console.log("SENDING NOTIFICATION")
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getNotification", {
      senderId,
      type,
    });
    console.log("SENT NOTIFICATION")
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User removed!");
    console.log(socket.id);
  });
});

io.listen(8080);