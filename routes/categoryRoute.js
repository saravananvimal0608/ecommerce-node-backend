import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { addCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/categoryController.js'
import upload from '../middleware/upload.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/add-category', authMiddleware,upload.single('category-image'),addCategory)
router.get('/getAllCategory',getAllCategory)
router.delete('/delete-category/:id', authMiddleware,adminMiddleware, deleteCategory)
router.put('/update-category/:id', authMiddleware, upload.single('category-image'),adminMiddleware, updateCategory)
export default router