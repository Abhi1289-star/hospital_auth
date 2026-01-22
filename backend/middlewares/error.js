class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;

  /* ===============================
     MongoDB Duplicate Key Error
  =============================== */
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue).join(
      ", "
    )} entered`;
    error = new ErrorHandler(message, 400);
  }

  /* ===============================
     JWT Errors
  =============================== */
  if (err.name === "JsonWebTokenError") {
    error = new ErrorHandler("Invalid token, please login again!", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new ErrorHandler("Token expired, please login again!", 401);
  }

  /* ===============================
     Mongoose Cast Error
  =============================== */
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  /* ===============================
     Mongoose Validation Errors
  =============================== */
  const errorMessage = error.errors
    ? Object.values(error.errors)
        .map((err) => err.message)
        .join(" ")
    : error.message;

  return res.status(error.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
