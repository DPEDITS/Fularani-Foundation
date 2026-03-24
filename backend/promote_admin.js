import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const migrateToSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        const emailToTarget = "abhijeetdashx@gmail.com";

        console.log(`Looking for volunteer: ${emailToTarget}`);
        const volunteer = await db.collection("volunteers").findOne({ email: emailToTarget });

        if (!volunteer) {
            console.log("Error: Volunteer not found!");
            
            // Check if Admin exists anyway
            const existingAdmin = await db.collection("admins").findOne({ email: emailToTarget });
            if (existingAdmin) {
                console.log("Admin record ALREADY exists with this email.");
            }
        } else {
            console.log(`Found volunteer: ${volunteer.username}`);

            // Prepare admin data pulling from volunteer
            const adminData = {
                username: volunteer.username,
                email: volunteer.email,
                password: volunteer.password, // Preserve password hash!
                role: "SUPER_ADMIN",
                phone: volunteer.phone || "0000000000",
                avatar: volunteer.avatar || volunteer.googleAvatarUrl || "",
                createdAt: volunteer.createdAt || new Date(),
                updatedAt: new Date()
            };

            // Copy SSO fields if any
            if (volunteer.ssoId) adminData.ssoId = volunteer.ssoId;
            if (volunteer.ssoProvider) adminData.ssoProvider = volunteer.ssoProvider;

            console.log("Upserting to admins collection...");
            await db.collection("admins").updateOne(
                { email: emailToTarget },
                { $set: adminData },
                { upsert: true }
            );

            console.log("Successfully migrated volunteer details to admins collection as SUPER_ADMIN.");
            
            // Check if we also need to delete the volunteer to avoid duplicates? 
            console.log("Removing volunteer record to prevent auth collision...");
            await db.collection("volunteers").deleteOne({ email: emailToTarget });
            console.log("Volunteer record removed.");
        }
    } catch (error) {
        console.error("Error executing script:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

migrateToSuperAdmin();
