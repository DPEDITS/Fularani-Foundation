import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DB_NAME = "fularani-cluster";

const fixAvatar = async () => {
    try {
        const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(fullUri);
        
        const volunteer = await mongoose.connection.db.collection('volunteers').findOne({ email: 'fularanifoundation@gmail.com' });
        
        if (volunteer && volunteer.avatar) {
            console.log("Found volunteer avatar:", volunteer.avatar);
            await mongoose.connection.db.collection('admins').updateOne(
                { email: 'fularanifoundation@gmail.com' },
                { $set: { avatar: volunteer.avatar } }
            );
            console.log("✅ Avatar updated in admin collection using the one from the volunteer collection.");
        } else {
            console.log("No avatar found for this email in volunteers collection.");
        }
        
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
};

fixAvatar();
