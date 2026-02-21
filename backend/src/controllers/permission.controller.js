import Permission from "../models/permission.model.js";

/*
  @desc   Create new permission
  @route  POST /api/permissions
  @access Admin (CREATE_PERMISSION)
*/
export const createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Permission name is required" });
    }

    const formattedName = name.toUpperCase();

    const existingPermission = await Permission.findOne({ name: formattedName });
    if (existingPermission) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    const newPermission = await Permission.create({
      name: formattedName,
    });

    return res.status(201).json({
      message: "Permission created successfully",
      permission: newPermission,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  @desc   Get all permissions
  @route  GET /api/permissions
  @access Admin
*/
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();

    return res.status(200).json({
      count: permissions.length,
      permissions,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};