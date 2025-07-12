import express from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  banUser,
  banProfile,
} from "../controller/admin.controller.js";


import {
    getFlaggedSkills,
    updateFlaggedSkill,
    toggleUserBan,
    generateActivityReport,
    generateFeedbackReport,
    generateSwapReport,
    sendBroadcastMessage,
    getBroadcastMessages,
    getDashboardStats
} from "../controller/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Apply auth and admin middleware to all admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

// GET /api/admin/flagged-skills - Get all flagged skills
router.get("/flagged-skills", getFlaggedSkills);

// PUT /api/admin/flagged-skills/:id - Approve or reject flagged skill
router.put("/flagged-skills/:id", updateFlaggedSkill);

// PUT /api/admin/users/:id/ban - Ban/unban a user
router.put("/users/:id/ban", toggleUserBan);

// GET /api/admin/reports/activity - Download CSV: user activity
router.get("/reports/activity", generateActivityReport);

// GET /api/admin/reports/feedback - Download CSV: feedback logs
router.get("/reports/feedback", generateFeedbackReport);

// GET /api/admin/reports/swaps - Download CSV: swap statistics
router.get("/reports/swaps", generateSwapReport);

// POST /api/admin/broadcast - Send platform-wide message
router.post("/broadcast", sendBroadcastMessage);

// GET /api/admin/broadcast - Get all broadcast messages
router.get("/broadcast", getBroadcastMessages);

// GET /api/admin/dashboard/stats - Get admin dashboard statistics
router.get("/dashboard/stats", getDashboardStats);
router.get("/admin/users", verifyJWT, verifyAdmin, getAllUsers);
router.put("/admin/users/:id/ban", verifyJWT, verifyAdmin, banUser);
router.put("/admin/profiles/:id/ban", verifyJWT, verifyAdmin, banProfile);

export default router; 