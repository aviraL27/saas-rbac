import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/rbac.middleware.js";
import { assignRole, deleteUser, getAllUsers, getMe } from "../controllers/user.controller.js";
const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  getMe
);

router.get(
  "/",
  authMiddleware,
  authorize("DELETE_USER"),
  getAllUsers
);

router.patch(
  "/assign-role",
  authMiddleware,
  authorize("ASSIGN_ROLE"),
  assignRole
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("DELETE_USER"),
  deleteUser
);



export default router;