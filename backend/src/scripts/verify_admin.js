import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const verify = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(fullUri);
        const admin = await mongoose.connection.db.collection('admins').findOne({ email: 'fularanifoundation@gmail.com' });
        console.log("Found admin:", admin);
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
};

verify();
