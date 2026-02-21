import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/rbac.middleware.js";
import { createPermission, getAllPermissions } from "../controllers/permission.controller.js";

const router = express.Router();

// Create permission (Admin only)
router.post(
  "/",
  authMiddleware,
  authorize("CREATE_PERMISSION"),
  createPermission
);

router.get(
  "/",
  authMiddleware,
  authorize("CREATE_PERMISSION"),
  getAllPermissions
);

export default router;