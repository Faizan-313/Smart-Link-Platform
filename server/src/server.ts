import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDb from "./config/db.config";
import cookieParser from "cookie-parser";
import { connectRedis } from "./config/redis.config";

import shortUrlRoute from "./routes/shortUrl.routes"
import authRoute from "./routes/auth.routes"

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();
connectRedis();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Smart Link Platform API" });
});

app.use("/api", shortUrlRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});