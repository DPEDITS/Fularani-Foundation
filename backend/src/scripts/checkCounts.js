import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        for (const c of collections) {
            const count = await db.collection(c.name).countDocuments();
            console.log(`Collection "${c.name}": ${count} docs`);
            if (count > 0) {
                const sample = await db.collection(c.name).findOne({});
                console.log(` - Sample Email: ${sample.email || 'N/A'}`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkCounts();
