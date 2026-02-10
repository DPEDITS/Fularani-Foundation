import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const checkAdmins = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(fullUri);
        const db = mongoose.connection.db;
        const coll = db.collection('admins');
        const admins = await coll.find({}).toArray();
        console.log('Admins in DB:');
        admins.forEach(a => console.log(` - ${a.email} (${a.username})`));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkAdmins();
