import express from "express";
import { 
    createTask, 
    getTaskDetails, 
    updateTask, 
    deleteTask, 
    completeSubtask, 
    getUserProgress, 
    getTasksByGroup
} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/authMiddleware.js"; 
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.use(verifyToken)
router.post("/create", protectRoute, createTask);
router.get("/:taskId", protectRoute, getTaskDetails);
router.put("/:taskId", protectRoute, updateTask);  // Update task
router.delete("/:taskId", protectRoute, deleteTask); // Delete task
router.post("/subtask/complete", protectRoute, completeSubtask);
router.get("/:groupId/progress", protectRoute, getUserProgress);
router.get("/group/:groupId", protectRoute, getTasksByGroup);

export default router;
