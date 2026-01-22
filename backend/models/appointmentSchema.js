import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
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
    appointment_date: {
      type: Date,
      required: [true, "Appointment date is required!"],
    },
    department: {
      type: String,
      required: [true, "Department name is required!"],
      trim: true,
    },
    doctor: {
      firstName: {
        type: String,
        required: [true, "Doctor first name is required!"],
      },
      lastName: {
        type: String,
        required: [true, "Doctor last name is required!"],
      },
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Address is required!"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required!"],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required!"],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
