import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const seedMissions = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(fullUri);
        const db = mongoose.connection.db;
        const coll = db.collection('contents');

        const missions = [
            {
                type: 'MISSION',
                title: 'Mission Education',
                shortDescription: 'Providing quality education and resources to underprivileged children.',
                status: 'active',
                category: 'Education',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                type: 'MISSION',
                title: 'Mission Period',
                shortDescription: 'Promoting menstrual hygiene and health awareness among women.',
                status: 'active',
                category: 'Healthcare',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                type: 'MISSION',
                title: 'Mission Green',
                shortDescription: 'Environmental conservation and tree plantation initiatives.',
                status: 'active',
                category: 'Environment',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                type: 'MISSION',
                title: 'Mission Mobility',
                shortDescription: 'Assisting people with disabilities through mobility aids and support.',
                status: 'active',
                category: 'Social Support',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                type: 'MISSION',
                title: 'Mission Thalassemia',
                shortDescription: 'Supporting patients and awareness for Thalassemia.',
                status: 'active',
                category: 'Healthcare',
                isPublished: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Clear existing missions if any to avoid duplicates pendant development
        await coll.deleteMany({ type: 'MISSION' });

        await coll.insertMany(missions);
        console.log('Successfully seeded 5 core missions.');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

seedMissions();
