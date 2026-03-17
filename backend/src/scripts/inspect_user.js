import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const inspectUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.useDb('fularani-cluster').db;
        const email = 'debashishparida75@gmail.com';
        
        const admin = await db.collection('admins').findOne({ email });
        const donor = await db.collection('donors').findOne({ email });
        
        console.log('--- ADMIN RECORD ---');
        console.log(JSON.stringify(admin, null, 2));
        
        console.log('\n--- DONOR RECORD ---');
        console.log(JSON.stringify(donor, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

inspectUser();
