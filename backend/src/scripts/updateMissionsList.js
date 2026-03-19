import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://fularanifoundation_db_user:Kiq5hRME0kGPaOzV@fularani-cluster.hr0oztg.mongodb.net/fularani-cluster';

const targetMissions = [
    {
        title: "Mission Green",
        type: "MISSION",
        status: "active",
        description: "Promoting environmental sustainability and community cleaning drives.",
        category: "Environment"
    },
    {
        title: "Mission Education",
        type: "MISSION",
        status: "active",
        description: "Empowering underprivileged children through quality education and resources.",
        category: "Education"
    },
    {
        title: "Mission Health",
        type: "MISSION",
        status: "active",
        description: "Focusing on community healthcare, medical camps, and wellness awareness.",
        category: "Healthcare"
    }
];

const updateMissions = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('contents');

        // 1. Remove/Delete missions that are NOT in our target list (to keep it clean as requested)
        const targetTitles = targetMissions.map(m => m.title);
        const deleteResult = await collection.deleteMany({ 
            type: "MISSION", 
            title: { $nin: targetTitles } 
        });
        console.log(`- Removed ${deleteResult.deletedCount} old missions.`);

        // 2. Add or Update target missions
        for (const mission of targetMissions) {
            const exists = await collection.findOne({ title: mission.title, type: "MISSION" });
            if (!exists) {
                await collection.insertOne({
                    ...mission,
                    coverImage: "",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`- Created mission: ${mission.title}`);
            } else {
                await collection.updateOne(
                    { _id: exists._id }, 
                    { $set: { status: 'active', category: mission.category, description: mission.description } }
                );
                console.log(`- Updated existing mission: ${mission.title}`);
            }
        }

        console.log('\nMissions updated successfully.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error updating missions:', err);
        process.exit(1);
    }
};

updateMissions();
