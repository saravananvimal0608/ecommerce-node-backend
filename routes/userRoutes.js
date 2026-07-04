import express from 'express'
import { registerUser, verifyEmailId, loginUser, uploadAvatar, updateUser, forgotPassword, verifyOtp, resetPassword, userDetails, allUserCount, allUser } from '../controllers/userController.js'
import upload from '../middleware/upload.js'
import authMiddleware from '../middleware/auth.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/verify-email', verifyEmailId)
router.post('/login', loginUser)
router.put('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar)
router.put('/update-user', authMiddleware, updateUser)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.get('/user-details', authMiddleware, userDetails)
router.get("/allUserCount", allUserCount)
router.get('/allUsers', allUser)

export default router