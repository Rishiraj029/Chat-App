import { Router } from "express";
import { getMessages } from "../controllers/messageController";
import { protectRoute } from "../middleware/auth.ts";

const router = Router()

router.get("/chat/:chatId",protectRoute, getMessages)

export default router;