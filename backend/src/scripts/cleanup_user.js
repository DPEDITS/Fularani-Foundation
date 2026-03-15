import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cleanupUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.useDb('fularani-cluster').db;
        const email = 'debashishparida75@gmail.com';
        
        console.log('Cleaning up duplicate records for:', email);
        
        const vResult = await db.collection('volunteers').deleteMany({ email });
        console.log('Deleted from volunteers:', vResult.deletedCount);
        

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

cleanupUser();
