import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreateChat, deleteChat } from "../controllers/chatController";

const router = Router();

router.use(protectRoute);

router.get("/", getChats);
router.post("/with/:participantId", getOrCreateChat);
router.delete("/:chatId", deleteChat);

export default router;