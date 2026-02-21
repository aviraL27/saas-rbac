import bcrypt from "bcrypt";
import Permission from "./models/permission.model.js";
import Role from "./models/role.model.js";
import User from "./models/user.model.js";

const seedDatabase = async () => {
  try {
    const adminRoleExists = await Role.findOne({ name: "ADMIN" });

    if (adminRoleExists) {
      console.log("Admin role already exists. Skipping seed.");
      return;
    }

    console.log("Seeding database...");

    // Validate env variables
    if (!process.env.INITIAL_ADMIN_EMAIL || !process.env.INITIAL_ADMIN_PASSWORD) {
      throw new Error("Initial admin credentials not defined in .env");
    }

    // Create core permissions
    const permissionsList = [
      "CREATE_PERMISSION",
      "CREATE_ROLE",
      "ASSIGN_ROLE",
      "DELETE_USER",
    ];

    const createdPermissions = await Permission.insertMany(
      permissionsList.map((name) => ({ name }))
    );

    // Create ADMIN role
    const adminRole = await Role.create({
      name: "ADMIN",
      permissions: createdPermissions.map((p) => p._id),
    });

    // Create USER role
    await Role.create({
      name: "USER",
      permissions: [],
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.INITIAL_ADMIN_PASSWORD,
      10
    );

    // Create initial admin user
    await User.create({
      email: process.env.INITIAL_ADMIN_EMAIL,
      password: hashedPassword,
      role: adminRole._id,
    });

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};

export default seedDatabase;