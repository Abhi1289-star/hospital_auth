import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

/* ======================================================
   CREATE APPOINTMENT
====================================================== */
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  // Validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  // Find doctor
  const doctors = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (doctors.length === 0) {
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  if (doctors.length > 1) {
    return next(
      new ErrorHandler(
        "Doctor conflict detected. Please contact support.",
        400
      )
    );
  }

  const doctorId = doctors[0]._id;

  // Safety check (auth middleware must set req.user)
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("Unauthorized access!", 401));
  }

  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited: hasVisited || false,
    address,
    doctorId,
    patientId,
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully!",
    appointment,
  });
});

/* ======================================================
   GET ALL APPOINTMENTS (Admin / Dashboard)
====================================================== */
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("doctorId", "firstName lastName email")
    .populate("patientId", "firstName lastName email");

  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

/* ======================================================
   UPDATE APPOINTMENT STATUS
====================================================== */
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully!",
      appointment: updatedAppointment,
    });
  }
);

/* ======================================================
   DELETE APPOINTMENT
====================================================== */
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully!",
  });
});
