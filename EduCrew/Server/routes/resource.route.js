import express from 'express';
import resourceController from '../controllers/resources.controller.js';
// import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create uploads directory if it doesn't exist
import fs from 'fs';
import { verifyToken } from '../middleware/auth.js';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const upload = multer({ storage: storage });
router.use(verifyToken)
// Resource routes
router.post('/:groupId/add', upload.single('file'), resourceController.addResource);
router.get('/:groupId', resourceController.getGroupResources);
router.delete('/:resourceId', resourceController.deleteResource);
router.get('/:resourceId/download', resourceController.downloadResource);

export default router;