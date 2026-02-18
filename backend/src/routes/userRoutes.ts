import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers } from "../controllers/userController";

const router = Router();

router.use(protectRoute);

router.get("/", getUsers);

export default router;