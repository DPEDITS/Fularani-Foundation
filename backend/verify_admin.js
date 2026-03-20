import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    // Find the specific admin
    const admin = await db.collection("admins").findOne({ email: "abhijeetdashx@gmail.com" });
    
    if (admin) {
      console.log("FOUND=YES");
      console.log("EMAIL=" + admin.email);
      console.log("ROLE=" + admin.role);
      console.log("USERNAME=" + admin.username);
      console.log("HAS_PASSWORD=" + (!!admin.password));
      console.log("PHONE=" + admin.phone);
      console.log("ID=" + admin._id);
    } else {
      console.log("FOUND=NO");
      // Check all admins
      const all = await db.collection("admins").find({}).toArray();
      console.log("ALL_COUNT=" + all.length);
      for (const a of all) {
        console.log("EXISTING=" + a.email);
      }
    }
  } catch (error) {
    console.error("ERROR=" + error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

verify();
