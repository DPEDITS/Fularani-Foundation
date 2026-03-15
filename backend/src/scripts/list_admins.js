import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const listAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.useDb('fularani-cluster').db;
        const coll = db.collection('admins');
        const admins = await coll.find({}).toArray();
        console.log('Admins count:', admins.length);
        admins.forEach(a => console.log(`- ${a.email} (${a.role})`));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

listAdmins();
