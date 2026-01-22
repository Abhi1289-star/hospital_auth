import express from "express";
import cors from "cors";

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ROUTES (example)
// import patientRoutes from "./routes/patient.routes.js";
// app.use("/api/v1/user/patient", patientRoutes);

// SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
