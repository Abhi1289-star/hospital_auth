import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: [true, "Message is required!"],
      minlength: [10, "Message must contain at least 10 characters!"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);
