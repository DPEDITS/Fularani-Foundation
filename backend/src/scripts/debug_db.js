import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const debugDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('Databases:', dbs.databases.map(d => d.name));
        
        // Switch to fularani-cluster
        const db = mongoose.connection.useDb('fularani-cluster').db;
        const colls = await db.listCollections().toArray();
        console.log('Collections in fularani-cluster:', colls.map(c => c.name));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

debugDb();
