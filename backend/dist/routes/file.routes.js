import express from 'express';
import { getImageUrl } from '../controllers/file.controller.js';
const router = express.Router();
router.post('/upload', getImageUrl);
export default router;
