const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

let activeClients = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("message", (pathName, roomName) => {
    // const clientIndex = activeClients.findIndex(
    //   (client) => client.userId === socket.id
    // );

    // if (clientIndex > -1) {
    //   activeClients[clientIndex] = {
    //     pathName,
    //     roomName,
    //     userId: socket.id,
    //     timestamp: new Date(),
    //   };
    // } else {
    //   activeClients.push({
    //     pathName,
    //     roomName,
    //     userId: socket.id,
    //     timestamp: new Date(),
    //   });
    // }
    console.log(pathName);
    console.log(pathName + " by " + socket.id, roomName);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/active-clients", (req, res) => {
  res.json(activeClients);
});
server.listen(3002, () => {
  console.log("Server running on port 3002");
});
console.log("Hello");
