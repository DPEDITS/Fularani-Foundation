import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkUserEverywhere = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.useDb('fularani-cluster').db;
        const email = 'debashishparida75@gmail.com';
        
        const admins = await db.collection('admins').findOne({ email });
        const volunteers = await db.collection('volunteers').findOne({ email });
        const donors = await db.collection('donors').findOne({ email });
        
        console.log('Admin:', !!admins);
        console.log('Volunteer:', !!volunteers);
        console.log('Donor:', !!donors);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUserEverywhere();
