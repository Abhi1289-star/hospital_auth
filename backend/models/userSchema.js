import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required!"],
      minlength: [3, "First name must contain at least 3 characters!"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required!"],
      minlength: [3, "Last name must contain at least 3 characters!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      validate: [validator.isEmail, "Provide a valid email!"],
      lowercase: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required!"],
      minlength: [10, "Phone number must be valid!"],
      maxlength: [15, "Phone number must be valid!"],
    },
    nic: {
      type: String,
      required: [true, "NIC is required!"],
      minlength: [13, "NIC must contain 13 characters!"],
      maxlength: [13, "NIC must contain 13 characters!"],
      unique: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required!"],
      enum: ["Male", "Female", "Other"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must contain at least 8 characters!"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "User role is required!"],
      enum: ["Patient", "Doctor", "Admin"],
    },
    doctorDepartment: {
      type: String,
      required: function () {
        return this.role === "Doctor";
      },
    },
    docAvatar: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
   HASH PASSWORD
====================================================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ======================================================
   COMPARE PASSWORD
====================================================== */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/* ======================================================
   GENERATE JWT
====================================================== */
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

export const User = mongoose.model("User", userSchema);
