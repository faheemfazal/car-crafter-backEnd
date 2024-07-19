import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import routeruser from "./routes/router_user.js";
import routerAdmin from "./routes/router_admin.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";

/* CONFIGERATION */

const __filename = fileURLToPath(import.meta.url);

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: ["https://main.dgdcwln1z2552.amplifyapp.com"],
    // origin: ["http://localhost:3000"],

    methods: ["GET", "POST"],
    credentials: true,
  })
);

//   https://main.dgdcwln1z2552.amplifyapp.com  http://localhost:3000

app.use("/", routeruser);
app.use("/admin", routerAdmin);

const PORT = process.env.PORT || 6001;
// app.listen(PORT, ()=>console.log(`server port is ${PORT}`))

const server = app.listen(PORT, (err) => {
//   if (err) {
//     console.log(`database set`);
//   } else {
//     console.log(`running at port ${PORT}`);
//   }
});

// /socket io setting
const io = new Server(server, {
  cors: {
    origin: "https://main.dgdcwln1z2552.amplifyapp.com",
    // credentials:true
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log(`user Connect: ${socket.id}`);
  socket.on("disconnect", () => {
    // console.log('disconnect socketid', socket.id)
  });
  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});
