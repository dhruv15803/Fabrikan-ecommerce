import express from 'express'
import { addAttributeValue, createAttribute, editAttribute, editAttributeValue, getAttributesById, getAttributeValues, removeAttribute, removeAttributeValue } from '../controllers/attribute.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';

const router = express.Router();

router.get('/attributes/:categoryId',getAttributesById);
router.post('/create',authenticateUser,createAttribute);
router.delete('/delete/:id',authenticateUser,removeAttribute);
router.put('/edit',authenticateUser,editAttribute);


// attribute values
router.post('/attributeValue/add',authenticateUser,addAttributeValue);
router.get('/attributeValues/:attributeId',getAttributeValues);
router.delete('/attributeValue/:valueId',authenticateUser,removeAttributeValue);
router.put('/attributeValue/edit',authenticateUser,editAttributeValue);

export default router;
