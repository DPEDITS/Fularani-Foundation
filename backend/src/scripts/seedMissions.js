import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://fularanifoundation_db_user:Kiq5hRME0kGPaOzV@fularani-cluster.hr0oztg.mongodb.net/fularani-cluster';

const missions = [
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
        title: "Mission Period Pride",
        type: "MISSION",
        status: "active",
        description: "Promoting menstrual hygiene and breaking taboos through awareness programs.",
        category: "Health & Hygiene"
    },
    {
        title: "Mission Thalassemia",
        type: "MISSION",
        status: "active",
        description: "Raising awareness and supporting screening for Thalassemia.",
        category: "Healthcare"
    }
];

const seedMissions = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('contents');

        for (const mission of missions) {
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
                console.log(`- Mission already exists: ${mission.title}`);
                // Optional: Force active status if it's inactive
                if (exists.status !== 'active') {
                    await collection.updateOne({ _id: exists._id }, { $set: { status: 'active' } });
                    console.log(`  (updated to active status)`);
                }
            }
        }

        console.log('\nMissions seeded successfully.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding missions:', err);
        process.exit(1);
    }
};

seedMissions();
