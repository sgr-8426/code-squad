import { Router } from "express";
import { verifyJWT} from '../middlewares/auth.middleware.js';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  getCurrentUser 
} from '../controller/auth.controller.js';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.post('/logout', verifyJWT, logoutUser);
router.get('/me', verifyJWT, getCurrentUser);

export default router;
