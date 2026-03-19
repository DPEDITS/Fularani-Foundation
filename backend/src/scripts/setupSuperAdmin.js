import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://fularanifoundation_db_user:Kiq5hRME0kGPaOzV@fularani-cluster.hr0oztg.mongodb.net';
const DB_NAME = 'fularani-cluster';
const TARGET_EMAIL = 'debashishparida75@gmail.com';

const setup = async () => {
    try {
        const fullUri = `${MONGODB_URI}/${DB_NAME}`;
        console.log('Connecting to database...');
        await mongoose.connect(fullUri);
        console.log('Connected successfully.\n');

        const db = mongoose.connection.db;
        const adminColl = db.collection('admins');
        const donorColl = db.collection('donors');
        const volunteerColl = db.collection('volunteers');

        // ---- Step 1: Check all collections for this email ----
        console.log('=== Current State ===');
        const existingAdmin = await adminColl.findOne({ email: TARGET_EMAIL });
        const existingDonor = await donorColl.findOne({ email: TARGET_EMAIL });
        const existingVolunteer = await volunteerColl.findOne({ email: TARGET_EMAIL });

        console.log(`Admin record:     ${existingAdmin ? `YES (role: ${existingAdmin.role})` : 'NO'}`);
        console.log(`Donor record:     ${existingDonor ? 'YES' : 'NO'}`);
        console.log(`Volunteer record: ${existingVolunteer ? 'YES' : 'NO'}`);
        console.log('');

        // Get user data from any existing record
        const userData = existingVolunteer || existingDonor || existingAdmin;

        // ---- Step 2: Ensure SUPER_ADMIN in admins collection ----
        if (existingAdmin) {
            if (existingAdmin.role === 'SUPER_ADMIN') {
                console.log('✅ Admin record already exists with SUPER_ADMIN role.');
            } else {
                await adminColl.updateOne(
                    { email: TARGET_EMAIL },
                    { $set: { role: 'SUPER_ADMIN', updatedAt: new Date() } }
                );
                console.log(`✅ Updated admin role from "${existingAdmin.role}" to "SUPER_ADMIN".`);
            }
        } else {
            // Create new admin record
            const adminData = {
                username: userData?.username || 'Super Admin',
                email: TARGET_EMAIL,
                password: userData?.password || '',
                role: 'SUPER_ADMIN',
                phone: userData?.phone || '0000000000',
                avatar: userData?.avatar || `https://ui-avatars.com/api/?name=Super+Admin&background=random`,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await adminColl.insertOne(adminData);
            console.log('✅ Created new SUPER_ADMIN record in admins collection.');
        }

        // ---- Step 3: Ensure donor record exists ----
        if (existingDonor) {
            console.log('✅ Donor record already exists.');
        } else {
            const donorData = {
                username: userData?.username || 'Debashish Parida',
                email: TARGET_EMAIL,
                password: userData?.password || '',
                phone: userData?.phone || '0000000000',
                fullName: userData?.fullName || userData?.username || 'Debashish Parida',
                avatar: userData?.avatar || `https://ui-avatars.com/api/?name=Debashish+Parida&background=random`,
                panNumber: userData?.panNumber || '',
                isPanVerified: userData?.isPanVerified || false,
                isGoogleUser: userData?.isGoogleUser || false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await donorColl.insertOne(donorData);
            console.log('✅ Created new donor record in donors collection.');
        }

        // ---- Step 4: Verify final state ----
        const finalAdmin = await adminColl.findOne({ email: TARGET_EMAIL });
        const finalDonor = await donorColl.findOne({ email: TARGET_EMAIL });

        console.log('\n=== Final Verification ===');
        console.log(`Admin:  email=${finalAdmin.email}, role=${finalAdmin.role}, username=${finalAdmin.username}`);
        console.log(`Donor:  email=${finalDonor.email}, username=${finalDonor.username}`);

        // Also list all admins
        const allAdmins = await adminColl.find({}).toArray();
        console.log(`\n=== All Admins (${allAdmins.length}) ===`);
        allAdmins.forEach(a => {
            console.log(` - ${a.email} | role: ${a.role} | username: ${a.username}`);
        });

        await mongoose.disconnect();
        console.log('\nDone. Database disconnected.');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

setup();
