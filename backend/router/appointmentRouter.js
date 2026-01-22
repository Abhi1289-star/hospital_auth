import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

/* ======================================================
   PATIENT ROUTES (Frontend)
====================================================== */

// Book appointment
router.post("/create", isPatientAuthenticated, postAppointment);

/* ======================================================
   ADMIN ROUTES (Dashboard)
====================================================== */

// Get all appointments
router.get("/", isAdminAuthenticated, getAllAppointments);

// Update appointment status
router.put("/:id", isAdminAuthenticated, updateAppointmentStatus);

// Delete appointment
router.delete("/:id", isAdminAuthenticated, deleteAppointment);

export default router;
