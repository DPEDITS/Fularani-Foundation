import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";
const TARGET_EMAIL = 'fularanifoundation@gmail.com';

const injectSuperAdmin = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        console.log('Connecting to database...');
        await mongoose.connect(fullUri);
        console.log('Connected successfully.');

        const db = mongoose.connection.db;
        const adminColl = db.collection('admins');
        const volunteerColl = db.collection('volunteers');
        const donorColl = db.collection('donors');

        // Target exact details from user's request
        const targetUserId = new mongoose.Types.ObjectId("69d549ef8be25a6b980f50e9");
        const existingAdmin = await adminColl.findOne({ email: TARGET_EMAIL });

        const newUserDetails = {
            username: "fularani foundation",
            email: TARGET_EMAIL,
            password: "$2b$10$F4YHhZxzaRmr6cVTedWrjO5xgkNQxZW/nIv7Cp1GfP2A5fAdSpqK6", // keep original hashed pass
            role: "SUPER_ADMIN",
            phone: "9853604626",
            avatar: "https://lh3.googleusercontent.com/a/ACg8ocJQ56O2V4VikquvY-n0Kb0KYSZun2...",
            createdAt: new Date("2026-04-07T18:16:15.427Z"),
            updatedAt: new Date("2026-04-07T18:16:15.964Z")
        };

        if (existingAdmin) {
            console.log(`Admin with email ${TARGET_EMAIL} already exists in 'admins' collection. Updating to SUPER_ADMIN...`);
            await adminColl.updateOne(
                { email: TARGET_EMAIL },
                { $set: newUserDetails }
            );
            console.log(`✅ Updated existing admin with email "${TARGET_EMAIL}" to SUPER_ADMIN.`);
        } else {
            console.log(`Admin with email ${TARGET_EMAIL} not found. Injecting a new record into 'admins' collection...`);
            
            // Note: If you want exactly the same _id you can pass it, but normally you let mongo create it or set it from target
            newUserDetails._id = targetUserId; 

            await adminColl.insertOne(newUserDetails);
            console.log(`✅ Created new SUPER_ADMIN record for "${TARGET_EMAIL}".`);
        }

        // Verify the result
        const verifyAdmin = await adminColl.findOne({ email: TARGET_EMAIL });
        console.log('\n--- Verification ---');
        console.log(verifyAdmin);
        console.log('-------------------');

        await mongoose.disconnect();
        console.log('\nDone. Database disconnected.');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

injectSuperAdmin();
