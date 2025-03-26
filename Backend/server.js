import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import connectTomongoDB from "./db/connectTomongoDB.js";
import userRouter from "./routes/user.route.js";
import lawyerAuthRouter from "./routes/lawyerAuth.route.js";
import lawyerRouter from "./routes/lawyer.route.js";
import caseRouter from "./routes/case.route.js";
import taskRouter from "./routes/tasks.route.js";
import notificationRouter from "./routes/notification.route.js";
import noteRouter from "./routes/note.route.js";
import todoRouter from "./routes/todo.route.js";
import summarizationRouter from "./routes/summarization.route.js";
import meetingRouter from "./routes/meeting.route.js";
import availabiltiyRouter from "./routes/availability.route.js";
import chatbotRoutes from "./routes/chatbot.route.js"; // Fixed typo


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/uploads", express.static("uploads"));
app.use("/uploads-chat", express.static("uploads-chat"));
app.use("/uploads/pdf", express.static("uploads/pdf"));
app.use("/audio", express.static("audio"));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/user", userRouter);
app.use("/api/lawyer", lawyerAuthRouter);
app.use("/api/lawyer-data", lawyerRouter);
app.use("/api/case", caseRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/notes", noteRouter);
app.use("/api/todos", todoRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/availability", availabiltiyRouter);
app.use("/api/summarization", summarizationRouter);
app.use("/api/chatbot", chatbotRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  connectTomongoDB();
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

global.clients = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  if (userId) {
    global.clients.set(userId, socket);
    socket.userId = userId;
  } else {
    console.warn("No userId provided for socket connection");
  }

  socket.on("newMessage", (message) => {
    const recipientSocket = global.clients.get(message.receiverId);
    if (recipientSocket) {
      console.log(`Forwarding message from ${userId} to ${message.receiverId}`);
      recipientSocket.emit("newMessage", message);
    } else {
      console.log(`Recipient ${message.receiverId} not connected`);
    }
  });

  socket.on("join-meeting", (meetingId) => {
    console.log(`${userId} joined meeting: ${meetingId}`);
    socket.join(meetingId);
    socket.to(meetingId).emit("user-joined", userId);
  });

  socket.on("offer", ({ offer, meetingId }) => {
    console.log(`Received offer from ${userId} for meeting: ${meetingId}`);
    socket.to(meetingId).emit("offer", { offer, from: userId });
  });

  socket.on("answer", ({ answer, meetingId }) => {
    console.log(`Received answer from ${userId} for meeting: ${meetingId}`);
    socket.to(meetingId).emit("answer", { answer, from: userId });
  });

  socket.on("ice-candidate", ({ candidate, meetingId }) => {
    console.log(`Received ICE candidate from ${userId} for meeting: ${meetingId}`);
    socket.to(meetingId).emit("ice-candidate", { candidate, from: userId });
  });

  socket.on("leave-meeting", (meetingId) => {
    console.log(`${userId} left meeting: ${meetingId}`);
    socket.to(meetingId).emit("user-left", userId);
    socket.leave(meetingId);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${userId}. Reason: ${reason}`);
    if (userId) {
      global.clients.delete(userId);
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit("user-left", userId);
        }
      });
    }
  });
});