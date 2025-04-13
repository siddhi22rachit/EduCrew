import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessage, sendMessage } from "../controllers/chat.controller.js";


const router = express.Router();
router.use(verifyToken);

router.get("/:groupId", getMessage);
router.post("/:groupId", sendMessage);

export default router;