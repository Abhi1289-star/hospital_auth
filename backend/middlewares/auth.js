import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

/* ======================================================
   ADMIN AUTH (Dashboard)
====================================================== */
export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies?.adminToken;

    if (!token) {
      return next(
        new ErrorHandler("Dashboard user is not authenticated!", 401)
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return next(new ErrorHandler("Invalid or expired token!", 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    if (user.role !== "Admin") {
      return next(
        new ErrorHandler(`${user.role} not authorized for this resource!`, 403)
      );
    }

    req.user = user;
    next();
  }
);

/* ======================================================
   PATIENT AUTH (Frontend)
====================================================== */
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies?.patientToken;

    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return next(new ErrorHandler("Invalid or expired token!", 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    if (user.role !== "Patient") {
      return next(
        new ErrorHandler(`${user.role} not authorized for this resource!`, 403)
      );
    }

    req.user = user;
    next();
  }
);

/* ======================================================
   ROLE-BASED AUTH (Reusable)
====================================================== */
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user?.role || "User"} not allowed to access this resource!`,
          403
        )
      );
    }
    next();
  };
};
