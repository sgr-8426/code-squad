import express from "express";
import {
    createSwapRequest,
    getSwapRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    submitFeedback
} from "../controller/swap.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all swap routes
router.use(verifyJWT);

// POST /api/swaps - Send a new swap request
router.post("/", createSwapRequest);

// GET /api/swaps - Get current user's swap requests
router.get("/", getSwapRequests);

// PUT /api/swaps/:id/accept - Accept a swap
router.put("/:id/accept", acceptSwapRequest);

// PUT /api/swaps/:id/reject - Reject a swap
router.put("/:id/reject", rejectSwapRequest);

// DELETE /api/swaps/:id - Cancel/delete a pending swap
router.delete("/:id", cancelSwapRequest);

// POST /api/swaps/:id/feedback - Submit feedback after swap accepted
router.post("/:id/feedback", submitFeedback);

export default router; 