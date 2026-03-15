import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const promoteToAdmin = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(fullUri);
        const db = mongoose.connection.db;

        const volunteerColl = db.collection('volunteers');
        const donorColl = db.collection('donors');
        const adminColl = db.collection('admins');

        const targetEmail = 'debashishparida75@gmail.com';
        let userData = await volunteerColl.findOne({ email: targetEmail });
        
        if (!userData) {
            console.log(`User "${targetEmail}" not found in volunteers, checking donors...`);
            userData = await donorColl.findOne({ email: targetEmail });
        }

        if (!userData) {
            console.log(`User "${targetEmail}" not found in any collection.`);
            await mongoose.disconnect();
            return;
        }

        console.log('Found user records for:', userData.email);

        const existingAdmin = await adminColl.findOne({ email: 'debashishparida75@gmail.com' });
        if (existingAdmin) {
            console.log('Admin record already exists for this email.');
        } else {
            const adminData = {
                username: userData.username || 'admin',
                email: userData.email,
                password: userData.password, // Use the same hashed password
                role: 'SUPER_ADMIN',
                phone: userData.phone || '0000000000',
                avatar: userData.avatar || '',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await adminColl.insertOne(adminData);
            console.log('Successfully promoted "debashishparida75@gmail.com" to Admin collection.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

promoteToAdmin();
