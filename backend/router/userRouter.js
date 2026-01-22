import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

/* ======================================================
   AUTH (Frontend + Dashboard)
====================================================== */

// Patient register
router.post("/patient/register", patientRegister);

// Login (Patient / Admin / Doctor)
router.post("/login", login);

/* ======================================================
   ADMIN ROUTES (Dashboard)
====================================================== */

// Add new admin
router.post("/admin", isAdminAuthenticated, addNewAdmin);

// Add new doctor
router.post("/doctor", isAdminAuthenticated, addNewDoctor);

// Get admin profile
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Admin logout
router.post("/admin/logout", isAdminAuthenticated, logoutAdmin);

/* ======================================================
   PATIENT ROUTES (Frontend)
====================================================== */

// Get patient profile
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

// Patient logout
router.post("/patient/logout", isPatientAuthenticated, logoutPatient);

/* ======================================================
   SHARED ROUTES
====================================================== */

// Get all doctors (public)
router.get("/doctors", getAllDoctors);

export default router;
