import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";
const TARGET_EMAIL = 'debashishparida75@gmail.com';

const makeSuperAdmin = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        console.log('Connecting to database...');
        await mongoose.connect(fullUri);
        console.log('Connected successfully.');

        const db = mongoose.connection.db;
        const adminColl = db.collection('admins');
        const volunteerColl = db.collection('volunteers');
        const donorColl = db.collection('donors');

        // Check if admin record already exists
        const existingAdmin = await adminColl.findOne({ email: TARGET_EMAIL });

        if (existingAdmin) {
            if (existingAdmin.role === 'SUPER_ADMIN') {
                console.log(`✅ "${TARGET_EMAIL}" is already a SUPER_ADMIN.`);
            } else {
                // Update existing admin to SUPER_ADMIN
                await adminColl.updateOne(
                    { email: TARGET_EMAIL },
                    { $set: { role: 'SUPER_ADMIN', updatedAt: new Date() } }
                );
                console.log(`✅ Updated "${TARGET_EMAIL}" from "${existingAdmin.role}" to "SUPER_ADMIN".`);
            }
        } else {
            // No admin record exists — find user data from volunteers or donors
            let userData = await volunteerColl.findOne({ email: TARGET_EMAIL });
            if (!userData) {
                userData = await donorColl.findOne({ email: TARGET_EMAIL });
            }

            if (!userData) {
                console.log(`❌ User "${TARGET_EMAIL}" not found in volunteers or donors collections.`);
                console.log('Creating a new admin record with default values...');
                
                // Create admin with defaults since no user data found
                await adminColl.insertOne({
                    username: 'Super Admin',
                    email: TARGET_EMAIL,
                    password: '$2b$10$placeholder', // Will need to reset password
                    role: 'SUPER_ADMIN',
                    phone: '0000000000',
                    avatar: `https://ui-avatars.com/api/?name=Super+Admin&background=random`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`⚠️ Created SUPER_ADMIN record. User will need to reset their password.`);
            } else {
                // Create admin from existing user data
                await adminColl.insertOne({
                    username: userData.username || 'Super Admin',
                    email: userData.email,
                    password: userData.password,
                    role: 'SUPER_ADMIN',
                    phone: userData.phone || '0000000000',
                    avatar: userData.avatar || `https://ui-avatars.com/api/?name=Super+Admin&background=random`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Created SUPER_ADMIN record for "${TARGET_EMAIL}" using existing user data.`);
            }
        }

        // Verify the result
        const verifyAdmin = await adminColl.findOne({ email: TARGET_EMAIL });
        console.log('\n--- Verification ---');
        console.log(`Email: ${verifyAdmin.email}`);
        console.log(`Username: ${verifyAdmin.username}`);
        console.log(`Role: ${verifyAdmin.role}`);
        console.log('-------------------');

        await mongoose.disconnect();
        console.log('\nDone. Database disconnected.');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

makeSuperAdmin();
