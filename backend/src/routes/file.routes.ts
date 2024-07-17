import express from 'express'
import { getImageUrl } from '../controllers/file.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/upload',upload.single('productFile'),getImageUrl);


export default router;
