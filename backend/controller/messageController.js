import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

/* ======================================================
   SEND MESSAGE (Frontend / Contact Form)
====================================================== */
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  const newMessage = await Message.create({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully!",
    data: newMessage,
  });
});

/* ======================================================
   GET ALL MESSAGES (Dashboard / Admin)
====================================================== */
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});
