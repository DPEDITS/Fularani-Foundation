import mongoose from "mongoose";
import bcrypt from "bcrypt";

const TARGET_URI = "mongodb+srv://fularanifoundation_db_user:Kiq5hRME0kGPaOzV@fularani-cluster.hr0oztg.mongodb.net/fularani-cluster";

const injectSuperAdmin = async () => {
    try {
        console.log("Connecting to the correct MongoDB URI including database name...");
        await mongoose.connect(TARGET_URI);
        const db = mongoose.connection.db;

        const emailToTarget = "abhijeetdashx@gmail.com";

        console.log(`Searching for volunteer with email: ${emailToTarget}`);
        const volunteerMatch = await db.collection("volunteers").findOne({ email: new RegExp(emailToTarget, 'i') });

        if (!volunteerMatch) {
            console.log("Volunteer not found in 'fularani-cluster'. Proceeding to create admin manually with default password.");
        } else {
            console.log(`Found volunteer: ${volunteerMatch.username}. Re-using details.`);
        }

        // Check if admin already exists
        const existingAdmin = await db.collection("admins").findOne({ email: new RegExp(emailToTarget, 'i') });
        if (existingAdmin) {
            console.log("Admin record already exists in the correct database. Updating role to SUPER_ADMIN...");
            await db.collection("admins").updateOne({ email: new RegExp(emailToTarget, 'i') }, { $set: { role: "SUPER_ADMIN" } });
            console.log("Role update successful.");
        } else {
            console.log(`Admin ${emailToTarget} does not exist. Creating...`);
            
            const plainPassword = "Admin@123";
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const newAdmin = {
                username: volunteerMatch ? volunteerMatch.username : "abhijeet dash",
                email: emailToTarget,
                password: volunteerMatch ? volunteerMatch.password : hashedPassword,
                role: "SUPER_ADMIN",
                phone: volunteerMatch ? volunteerMatch.phone : "0000000000",
                avatar: volunteerMatch ? (volunteerMatch.avatar || volunteerMatch.googleAvatarUrl || "") : "",
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
                console.log("Converting and removing old volunteer record to prevent auth duplicates.");
                await db.collection("volunteers").deleteOne({ email: new RegExp(emailToTarget, 'i') });
            }
        }

        console.log("\nVerifying current SUPER_ADMINs in DB:");
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
