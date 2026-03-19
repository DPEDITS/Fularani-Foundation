import 'dotenv/config';
import connectDB from '../db/index.js';
import { Donation } from '../models/donation.model.js';
import { Donor } from '../models/donor.model.js';
import crypto from 'crypto';

const generateReceiptNumber = () => {
    const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `FF-${Date.now()}-${rand}`;
};

async function recoverPayment() {
    await connectDB();
    
    const email = 'abhijeetdashx@gmail.com';
    const amount = 1000; // 100000 paise = 1000 INR
    const paymentId = 'pay_STAUhvN7R0KjOG';
    const currency = 'INR';

    const donor = await Donor.findOne({ email });
    if (!donor) {
        console.error("Donor not found with email:", email);
        process.exit(1);
    }

    const existingDonation = await Donation.findOne({ paymentId });
    if (existingDonation) {
        console.log("Donation already exists in DB", existingDonation);
        process.exit(0);
    }

    const receiptNumber = generateReceiptNumber();

    const donation = await Donation.create({
        donorId: donor._id,
        amount,
        currency,
        paymentGateway: "razorpay",
        paymentId,
        isRecurring: false,
        recurringInterval: "once",
        receiptNumber,
        receiptUrl: "",
        receiptGeneratedAt: new Date(),
        donatedAt: new Date(1773941646 * 1000), // from created_at in Razorpay payment JSON
    });

    // Update donor totals using findByIdAndUpdate is better to avoid validation issues
    await Donor.findByIdAndUpdate(donor._id, {
        $inc: {
            totalDonatedAmount: amount,
            donationCount: 1,
        }
    });

    console.log("Successfully recovered donation:", donation.paymentId, "amount:", donation.amount);
    process.exit(0);
}

recoverPayment().catch(console.error);
