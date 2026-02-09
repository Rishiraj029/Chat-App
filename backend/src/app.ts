import express from 'express';
import path from "path";

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { clerkMiddleware } from '@clerk/express'
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json())

app.get("/health", (req, res) => {
  res.json({status:"ok", message:"Server is running"})
})

app.use(clerkMiddleware())

app.use("/api/auth",authRoutes)
app.use("api/chats", chatRoutes)
app.use("api/messages", messageRoutes)
app.use("api/users", userRoutes)


app.use(errorHandler);

//server frontend in production
if(process.env.NODE_ENV === "production"){
   app.use(express.static(path.join(__dirname,"../../web/dist")))

   app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, "../../web/dist/index.html"))
   });

}

export default app;
