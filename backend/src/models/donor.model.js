import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const donorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    avatar: {
      type: String, // cloudinary url
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password not required for Google auth users
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values without conflict
    },
    ssoProvider: {
      type: String, // 'google'
    },
    refreshToken: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    totalDonatedAmount: {
      type: Number,
      default: 0,
      required: [true, "Total donated amount is required"]
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    panNumber: {
      type: String,
      required: [true, "Pan number is required"]
    },
    panVerified: {
      type: Boolean,
      default: false,
    },
    panHolderName: {
      type: String,
      trim: true,
    },
    wants80GReceipt: {
      type: Boolean,
      default: true,
    },
    hasActiveRecurringDonation: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

donorSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

donorSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false; // Google auth users have no password
  return await bcrypt.compare(password, this.password);
};

donorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

donorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

donorSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const Donor = mongoose.model("Donor", donorSchema);