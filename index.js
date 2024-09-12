const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

const io = require("socket.io")(3000, {
  cors: {
    origin: "https://master--vet-inspect-backend.netlify.app/active-clients",
    methods: ["GET", "POST"],
  },
});
app.use(
  cors(
    {
      origin: "http://localhost:3001", // Allow this origin
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    },
    {
      origin: "https://vet-inspect.netlify.app/", // Allow this origin
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    }
  )
);
let activeClients = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", ({ pathName, roomName, clientData }) => {
    console.log(clientData);
    if (clientData != undefined) {
      const { clientIP } = clientData;

      // Check if the client IP is already in the activeClients list
      const clientIndex = activeClients.findIndex(
        (client) => client.clientIP === clientIP
      );

      if (clientIndex > -1) {
        // Update the existing entry
        activeClients[clientIndex] = {
          pathName,
          roomName,
          UID: socket.id,
          ...clientData,
          timestamp: new Date(),
        };
      } else {
        // Add a new entry
        activeClients.push({
          pathName,
          roomName,
          UID: socket.id,
          ...clientData,
          timestamp: new Date(),
        });
      }
      console.log(pathName + " from " + clientIP, roomName);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    activeClients = activeClients.filter((client) => client.UID !== socket.id);
  });
});

app.get("/active-clients", (req, res) => {
  res.json(activeClients);
});
server.listen(3002, () => {
  console.log("Server running on port 3002");
});
console.log("Hello");
