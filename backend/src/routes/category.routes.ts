import express from 'express'
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { addCategory, editCategory, getCategoriesByParent, getCategoryById, getParentCategories, removeCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.post('/add',authenticateUser,addCategory);
router.get('/parent-categories',getParentCategories);
router.get('/categories/:parentCategoryId',getCategoriesByParent);
router.delete('/delete/:categoryId',authenticateUser,removeCategory);
router.put('/edit',authenticateUser,editCategory);
router.get('/:categoryId',getCategoryById);

export default router;
