import mongoose from "mongoose";
import bcrypt from "bcrypt";

const TARGET_URI = "mongodb+srv://fularanifoundation_db_user:Kiq5hRME0kGPaOzV@fularani-cluster.hr0oztg.mongodb.net";

const injectSuperAdmin = async () => {
    try {
        console.log("Connecting to the provided MongoDB URI...");
        await mongoose.connect(TARGET_URI);
        const db = mongoose.connection.db;

        const emailToTarget = "abhijeetdashx@gmail.com";

        // Check if admin already exists
        const existingAdmin = await db.collection("admins").findOne({ email: emailToTarget });
        if (existingAdmin) {
            console.log("Admin record already exists. Checking role...");
            if (existingAdmin.role !== "SUPER_ADMIN") {
                await db.collection("admins").updateOne({ email: emailToTarget }, { $set: { role: "SUPER_ADMIN" } });
                console.log("Updated existing admin to SUPER_ADMIN.");
            } else {
                console.log("Existing admin is already a SUPER_ADMIN.");
            }
        } else {
            console.log(`Admin ${emailToTarget} does not exist. Creating...`);
            
            // Generate a hashed password ($2b$10$ default salt)
            const plainPassword = "Admin@123";
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Fetch volunteer? User specifically mentioned looking in volunteer, let's search just in case
            const volunteerMatch = await db.collection("volunteers").findOne({ email: new RegExp(emailToTarget, 'i') });

            const newAdmin = {
                username: volunteerMatch ? volunteerMatch.username : "abhijeet dash",
                email: emailToTarget,
                password: volunteerMatch ? volunteerMatch.password : hashedPassword,
                role: "SUPER_ADMIN",
                phone: volunteerMatch ? volunteerMatch.phone : "0000000000",
                avatar: volunteerMatch ? (volunteerMatch.avatar || volunteerMatch.googleAvatarUrl) : "",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            if (volunteerMatch && volunteerMatch.ssoId) {
                newAdmin.ssoId = volunteerMatch.ssoId;
                newAdmin.ssoProvider = volunteerMatch.ssoProvider;
            }

            const result = await db.collection("admins").insertOne(newAdmin);
            console.log(`Successfully created new SUPER_ADMIN with _id: ${result.insertedId}`);

            if (volunteerMatch) {
                console.log("Copied from existing volunteer record. Deleting volunteer record to avoid auth duplicates.");
                await db.collection("volunteers").deleteOne({ email: new RegExp(emailToTarget, 'i') });
            }
        }

        console.log("Verifying current SUPER_ADMINs in DB:");
        const supers = await db.collection("admins").find({ role: "SUPER_ADMIN" }).toArray();
        supers.forEach(s => {
            console.log(`- ${s.username} (${s.email})`);
        });

    } catch (error) {
        console.error("Error executing script:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

injectSuperAdmin();
