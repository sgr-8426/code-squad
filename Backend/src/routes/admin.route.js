import express from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  banUser,
  banProfile,
} from "../controller/admin.controller.js";

const router = express.Router();

router.get("/admin/users", verifyJWT, verifyAdmin, getAllUsers);
router.put("/admin/users/:id/ban", verifyJWT, verifyAdmin, banUser);
router.put("/admin/profiles/:id/ban", verifyJWT, verifyAdmin, banProfile);

export default router;
