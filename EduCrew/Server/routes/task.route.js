import express from "express"
import {
  createTask,
  getTaskDetails,
  updateTask,
  deleteTask,
  completeSubtask,
  getUserProgress,
  getTasksByGroup,
  getAllMembersProgress,
  updateUserProgressManually,
  getUserAllTasks
} from "../controllers/task.controller.js"
import { protectRoute } from "../middleware/authMiddleware.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()
router.use(verifyToken)
router.post("/create", protectRoute, createTask)
router.get("/:taskId", protectRoute, getTaskDetails)
router.put("/:taskId", protectRoute, updateTask)
router.delete("/:taskId", protectRoute, deleteTask)
router.post("/subtask/complete", protectRoute, completeSubtask)
router.get("/:groupId/progress", protectRoute, getUserProgress)
router.get("/:groupId/members-progress", protectRoute, getAllMembersProgress)
router.get("/group/:groupId", getTasksByGroup)
// New route to manually trigger progress update
router.post("/:groupId/update-progress", protectRoute, updateUserProgressManually)
router.get("/user/calendar", protectRoute, getUserAllTasks)

export default router