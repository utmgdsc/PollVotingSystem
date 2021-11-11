// socket setup

import {Server, Socket} from "socket.io";
import {vote, join} from "./controllers/socketController";

const io = new Server({
    cors: {origin: "http://localhost:5000", credentials: true}
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket: Socket) => {
    console.log(`connect: ${socket.id}`);

    // let the socket join rooms once connected
    socket.on("join", async (pollCode: string) => {
        await join(socket, pollCode);

        // let the socket vote in the connected room
        socket.on("vote", async (answer: number, utorid: string) => {
            await vote(socket, answer, utorid);
        });
    });
});

export {io};
