import express from "express"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";

const app = express()

app.post("/test", (req, res) => {
    res.json({
        message: "Test route working"
    });

});

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev") )

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://neuralsearch.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)
export default app

  