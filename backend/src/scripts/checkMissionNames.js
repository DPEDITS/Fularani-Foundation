import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const checkMissions = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(fullUri);
        const db = mongoose.connection.db;
        const coll = db.collection('contents');
        const missions = await coll.find({ type: 'MISSION' }).toArray();
        console.log('Missions in DB:');
        missions.forEach(m => console.log(` - Title: "${m.title}", Type: ${m.type}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkMissions();
