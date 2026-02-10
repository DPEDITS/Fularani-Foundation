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
        const adminColl = db.collection('admins');

        const volunteer = await volunteerColl.findOne({ email: 'admin@gmail.com' });

        if (!volunteer) {
            console.log('Volunteer "admin@gmail.com" not found.');
            await mongoose.disconnect();
            return;
        }

        console.log('Found volunteer:', volunteer.email);

        const existingAdmin = await adminColl.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin record already exists for this email.');
        } else {
            const adminData = {
                username: volunteer.username || 'admin',
                email: volunteer.email,
                password: volunteer.password, // Use the same hashed password
                role: 'SUPER_ADMIN',
                phone: volunteer.phone || '0000000000',
                avatar: volunteer.avatar || '',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await adminColl.insertOne(adminData);
            console.log('Successfully promoted "admin@gmail.com" to Admin collection.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

promoteToAdmin();
