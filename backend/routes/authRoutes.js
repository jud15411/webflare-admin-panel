import express from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); // Route to create a new user
router.post('/login', loginUser);       // Route for users to log in
router.post('/google', googleLogin); 

export default router;