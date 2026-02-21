import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/rbac.middleware.js";
import { createRole, getAllRoles } from "../controllers/role.controller.js";

const router = express.Router();

// Create role (Admin only)
router.post(
  "/",
  authMiddleware,
  authorize("CREATE_ROLE"),
  createRole
);

router.get(
  "/",
  authMiddleware,
  authorize("CREATE_ROLE"), // admin-level permission
  getAllRoles
);

export default router;