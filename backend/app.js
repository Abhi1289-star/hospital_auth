import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/* -------------------- Load ENV FIRST -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "config", "config.env"),
});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";

import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();

/* -------------------- Middlewares -------------------- */

const allowedOrigins = [
  process.env.FRONTEND_URL_ONE,
  process.env.FRONTEND_URL_TWO,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/* -------------------- Database -------------------- */
dbConnection();

/* -------------------- Routes -------------------- */
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

/* -------------------- Error Handler -------------------- */
app.use(errorMiddleware);

export default app;
