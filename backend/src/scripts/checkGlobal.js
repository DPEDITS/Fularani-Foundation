import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const checkGlobal = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        console.log('Connecting to:', fullUri.split('@')[1]);
        await mongoose.connect(fullUri);
        const db = mongoose.connection.db;

        const collections = ['admins', 'volunteers', 'donors'];

        for (const collName of collections) {
            const coll = db.collection(collName);
            const user = await coll.findOne({ email: 'debashishparida75@gmail.com' });
            if (user) {
                console.log(`FOUND in collection "${collName}":`, user.email);
            } else {
                const count = await coll.countDocuments();
                console.log(`Not found in "${collName}" (Total docs in "${collName}": ${count})`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkGlobal();
