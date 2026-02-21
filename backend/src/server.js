import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import seedDatabase from "./seed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
  }
};

startServer();