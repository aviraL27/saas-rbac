import Role from "../models/role.model.js";

const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Make sure user exists (auth middleware should run before this)
      if (!req.user || !req.user.roleId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Fetch role and populate permissions
      const role = await Role.findById(req.user.roleId).populate("permissions");

      if (!role) {
        return res.status(403).json({ message: "Role not found" });
      }

      //Check if required permission exists
      const hasPermission = role.permissions.some(
        (permission) => permission.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: insufficient permissions" });
      }

      // All good
      next();

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};

export default authorize;