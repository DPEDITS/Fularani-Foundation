import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        const admin = await db.collection("admins").findOne({ email: "abhijeetdashx@gmail.com" });
        const donor = await db.collection("donors").findOne({ email: "abhijeetdashx@gmail.com" });
        const volunteer = await db.collection("volunteers").findOne({ email: "abhijeetdashx@gmail.com" });

        console.log("Admin:", admin ? "YES" : "NO");
        console.log("Donor:", donor ? "YES" : "NO");
        console.log("Volunteer:", volunteer ? "YES" : "NO");

        if (donor) {
            console.log("Donor Verified:", donor.role);
            console.log("PanVerified:", donor.panVerified);
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

check();
