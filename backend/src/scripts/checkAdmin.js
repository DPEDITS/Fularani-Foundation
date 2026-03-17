import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const checkAdmin = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI.split('@')[1] || 'DB');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const db = mongoose.connection.db;
        const adminCollection = db.collection('admins');
        const count = await adminCollection.countDocuments();
        console.log('Total documents in admins collection:', count);

        const allAdmins = await adminCollection.find({}).toArray();
        allAdmins.forEach(a => {
            console.log(`FOUND ADMIN: email="${a.email}" username="${a.username}" role="${a.role}"`);
        });

        const exactMatch = await adminCollection.findOne({ email: 'debashishparida75@gmail.com' });
        console.log('Exact match for "debashishparida75@gmail.com":', exactMatch ? 'YES' : 'NO');

        if (!exactMatch) {
            const fuzzyMatch = await adminCollection.findOne({ email: /admin/i });
            if (fuzzyMatch) {
                console.log('Fuzzy match found:', fuzzyMatch.email);
            } else {
                console.log('No admin found even with fuzzy search.');
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR IN SCRIPT:', err);
    }
};

checkAdmin();
