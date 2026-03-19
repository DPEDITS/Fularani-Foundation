import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://fularanifoundation_db_user:Kiq5hRME0kGPaOzV@fularani-cluster.hr0oztg.mongodb.net/fularani-cluster';
const EMAIL = 'debashishparida75@gmail.com';

const cleanup = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;

        // 1. Delete Volunteer Record
        const volResult = await db.collection('volunteers').deleteOne({ email: EMAIL });
        console.log(`- Volunteer record for ${EMAIL} deleted: ${volResult.deletedCount}`);

        // 2. Ensure Admin Record is SUPER_ADMIN
        const adminResult = await db.collection('admins').updateOne(
            { email: EMAIL },
            { $set: { role: 'SUPER_ADMIN' } },
            { upsert: false }
        );
        console.log(`- Admin record updated to SUPER_ADMIN: ${adminResult.modifiedCount}`);

        // 3. Verify final state
        const admin = await db.collection('admins').findOne({ email: EMAIL });
        const donor = await db.collection('donors').findOne({ email: EMAIL });
        const vol = await db.collection('volunteers').findOne({ email: EMAIL });

        console.log('\nFinal Status:');
        console.log(`Admin exists: ${admin ? 'YES (' + admin.role + ')' : 'NO'}`);
        console.log(`Donor exists: ${donor ? 'YES' : 'NO'}`);
        console.log(`Volunteer exists: ${vol ? 'YES' : 'NO'}`);

        await mongoose.disconnect();
        console.log('\nDone.');
    } catch (err) {
        console.error('Error during cleanup:', err);
        process.exit(1);
    }
};

cleanup();
