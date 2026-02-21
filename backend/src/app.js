import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import authorize from "./middlewares/rbac.middleware.js";
import permissionRoutes from "./routes/permission.routes.js";
import roleRoutes from "./routes/role.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("SaaS RBAC API Running");
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

//test
app.get(
  "/api/admin-test",
  authMiddleware,
  authorize("CREATE_ROLE"),
  (req, res) => {
    res.json({ message: "You have CREATE_ROLE permission" });
  }
);

export default app;