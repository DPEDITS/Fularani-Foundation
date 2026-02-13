import "dotenv/config";
import connectDB from "../db/index.js";
import { Admin } from "../models/admin.model.js";

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const superAdmin = await Admin.findOne({ role: "SUPER_ADMIN" });
    if (superAdmin) {
      console.log("Super Admin already exists.");
      process.exit(0);
    }

    const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_PHONE } =
      process.env;

    if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD || !SUPER_ADMIN_PHONE) {
      console.error(
        "Please set SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and SUPER_ADMIN_PHONE in .env file",
      );
      process.exit(1);
    }

    await Admin.create({
      username: "Super Admin",
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      phone: SUPER_ADMIN_PHONE,
      role: "SUPER_ADMIN",
      avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=random",
    });

    console.log("Super Admin created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
