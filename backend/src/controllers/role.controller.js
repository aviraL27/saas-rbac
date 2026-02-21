import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";

/*
  @desc   Create new role
  @route  POST /api/roles
  @access Admin (CREATE_ROLE)
*/
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const formattedName = name.toUpperCase();

    const existingRole = await Role.findOne({ name: formattedName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    let permissionIds = [];

    if (permissions && permissions.length > 0) {
      const foundPermissions = await Permission.find({
        name: { $in: permissions.map((p) => p.toUpperCase()) },
      });

      if (foundPermissions.length !== permissions.length) {
        return res.status(400).json({
          message: "One or more permissions are invalid",
        });
      }

      permissionIds = foundPermissions.map((p) => p._id);
    }

    const newRole = await Role.create({
      name: formattedName,
      permissions: permissionIds,
    });

    return res.status(201).json({
      message: "Role created successfully",
      role: newRole,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  @desc   Get all roles
  @route  GET /api/roles
  @access Admin
*/
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions", "name");

    return res.status(200).json({
      count: roles.length,
      roles,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};