"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// socket setup
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server({
    cors: {
        origin: process.env.FRONTEND,
    },
});
// log the socket id when client socket connects for the first time
io.on("connection", (socket) => {
    console.log(`connect: ${socket.id}`);
});
exports.default = io;
//# sourceMappingURL=socket.js.map