import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" })

//Cors defines for cross-origin resource sharing which allows the server to accept requests from different origins.
const app = express();
const corsOptions = {
  origin: "http://localhost:5173"|| process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"]
};
app.use(cors(corsOptions));

app.use(express.json({limit: "50mb"})); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.route.js";
import swapRouter from "./routes/swap.route.js";

//Routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/swaps", swapRouter);

//default api endpoint "http://localhost:5000/api/v1/"
export default app;