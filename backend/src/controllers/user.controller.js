import User from "../models/user.model.js";
import Role from "../models/role.model.js";

/*
  @desc   Assign role to user
  @route  PATCH /api/users/assign-role
  @access Admin (ASSIGN_ROLE)
*/
export const assignRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
      return res.status(400).json({
        message: "User ID and role name are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({ name: roleName.toUpperCase() });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    user.role = role._id;
    await user.save();

    return res.status(200).json({
      message: "Role assigned successfully",
      userId: user._id,
      newRole: role.name,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  @desc   Delete user
  @route  DELETE /api/users/:id
  @access Admin (DELETE_USER)
*/
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (req.user.userId === id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
      deletedUserId: id,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  @desc   Get all users
  @route  GET /api/users
  @access Admin (ASSIGN_ROLE or DELETE_USER — but we’ll use DELETE_USER for simplicity)
*/
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "name") // only get role name
      .select("-password");

    return res.status(200).json({
      count: users.length,
      users,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  @desc   Get current logged-in user
  @route  GET /api/users/me
  @access Authenticated
*/
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "role",
        select: "name permissions",
        populate: {
          path: "permissions",
          select: "name"
        }
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};