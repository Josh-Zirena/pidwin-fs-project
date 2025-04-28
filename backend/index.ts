import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { initSocketServer } from "./src/services/socket.js";
import apiRouter from "./src/api/index.js";

dotenv.config();
const app: Express = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  })
);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(cors());
app.use("/api", apiRouter);

const PORT: string | number = process.env.PORT || 5000;

const server = http.createServer(app);
initSocketServer(server);

mongoose
  .connect(process.env.MONGODB_URL || "")
  .then(() =>
    server.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
