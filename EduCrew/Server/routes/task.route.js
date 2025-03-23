import express from "express";
import { 
    createTask, 
    getTaskDetails, 
    updateTask, 
    deleteTask, 
    completeSubtask, 
    getUserProgress 
} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/create", protectRoute, createTask);
router.get("/:taskId", protectRoute, getTaskDetails);
router.put("/:taskId", protectRoute, updateTask);  // Update task
router.delete("/:taskId", protectRoute, deleteTask); // Delete task
router.post("/subtask/complete", protectRoute, completeSubtask);
router.get("/:groupId/progress", protectRoute, getUserProgress);

export default router;
