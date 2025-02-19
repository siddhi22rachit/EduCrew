import express from "express";
import { 
    createTask, 
    getTaskDetails, 
    updateTask, 
    deleteTask, 
    completeSubtask, 
    getUserProgress 
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/:taskId", protect, getTaskDetails);
router.put("/:taskId", protect, updateTask);  // Update task
router.delete("/:taskId", protect, deleteTask); // Delete task
router.post("/subtask/complete", protect, completeSubtask);
router.get("/:groupId/progress", protect, getUserProgress);

export default router;
