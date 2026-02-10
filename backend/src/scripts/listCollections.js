import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const listCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Collections in DB:');
        collections.forEach(c => console.log(' - ' + c.name));

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

listCollections();
