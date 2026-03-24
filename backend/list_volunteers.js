import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const listVolunteers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        const volunteers = await db.collection("volunteers").find({}, { projection: { email: 1, username: 1 } }).toArray();
        console.log(`Total Volunteers: ${volunteers.length}`);
        for (const v of volunteers) {
            console.log(`- Username: ${v.username}, Email: ${v.email}`);
        }
    } catch (error) {
        console.error("Error executing script:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

listVolunteers();
