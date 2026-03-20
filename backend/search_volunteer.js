import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const searchVolunteer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        console.log("Searching for volunteers matching 'abhijeet' or 'dash'...");
        const volunteers = await db.collection("volunteers").find({
            $or: [
                { email: /abhijeet/i },
                { username: /abhijeet/i },
                { username: /dash/i },
                { email: /dash/i }
            ]
        }).toArray();

        console.log(`Found ${volunteers.length} potential matches in volunteers.`);
        for (const v of volunteers) {
            console.log(`- Username: ${v.username}, Email: ${v.email}, Phone: ${v.phone}`);
        }
        
    } catch (error) {
        console.error("Error executing script:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

searchVolunteer();
