import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Only this email is allowed to be SUPER_ADMIN
const SUPER_ADMIN_EMAIL = "debashishparida75@gmail.com";

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN"],
      default: "ADMIN",
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

adminSchema.pre("validate", function (next) {
  if (this.role === "SUPER_ADMIN" && this.email !== SUPER_ADMIN_EMAIL) {
    next(new Error(`Only ${SUPER_ADMIN_EMAIL} can be assigned the SUPER_ADMIN role`));
  } else {
    next();
  }
});

adminSchema.pre("save", async function () {

  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

adminSchema.methods.generateRefreshToken = function () {
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

export const Admin = mongoose.model("Admin", adminSchema);
