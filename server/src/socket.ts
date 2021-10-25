// socket setup
const io = require("socket.io")({
  cors: {
    origin: process.env.FRONTEND,
  },
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket) => {
  console.log(`connect: ${socket.id}`);
});

export { io };
