import express from 'express';
import { createAttribute, editAttribute, getAttributesById, removeAttribute } from '../controllers/attribute.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
const router = express.Router();
router.get('/attributes/:categoryId', getAttributesById);
router.post('/create', authenticateUser, createAttribute);
router.delete('/delete/:id', authenticateUser, removeAttribute);
router.put('/edit', authenticateUser, editAttribute);
export default router;
