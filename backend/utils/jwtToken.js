export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  // Decide cookie name based on role
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  // Remove password before sending user object
  const userData = user.toObject();
  delete userData.password;

  res
    .status(statusCode)
    .cookie(cookieName, token, cookieOptions)
    .json({
      success: true,
      message,
      user: userData,
      token,
    });
};
