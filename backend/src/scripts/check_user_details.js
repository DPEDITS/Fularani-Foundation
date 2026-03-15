import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkUserDetails = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.useDb('fularani-cluster').db;
        const email = 'debashishparida75@gmail.com';
        
        const collections = ['admins', 'volunteers', 'donors', 'users'];
        
        for (const collName of collections) {
            const users = await db.collection(collName).find({ email }).toArray();
            console.log(`Collection "${collName}":`, users.length, 'records found');
            users.forEach((u, i) => {
                console.log(`  [${i}] ID: ${u._id}, Role: ${u.role || 'N/A'}, Status: ${u.status || 'N/A'}`);
            });
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUserDetails();
