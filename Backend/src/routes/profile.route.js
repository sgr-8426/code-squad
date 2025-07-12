import express from "express";
import { verifyJWT} from '../middlewares/auth.middleware.js';
import { 
  createProfile, 
  getPublicProfiles, 
  getProfileById, 
  getCurrentUserProfile,
  updateProfile, 
  deleteProfile 
} from '../controller/profile.controller.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicProfiles);
router.get('/:id', getProfileById);

// Protected routes
router.post('/create', verifyJWT, createProfile);
router.get('/current', verifyJWT, getCurrentUserProfile);
router.put('/:id', verifyJWT, updateProfile);
router.delete('/:id', verifyJWT, deleteProfile);

export default router;