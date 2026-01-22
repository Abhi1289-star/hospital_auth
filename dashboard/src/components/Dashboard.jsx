import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { AdminContext } from "../AdminContext";

const Dashboard = () => {
  const { isAuthenticated, admin } = useContext(AdminContext);
  const [appointments, setAppointments] = useState([]);

  // 🔒 Prevent React 18 double fetch
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load appointments"
        );
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast.success(data.message || "Status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // 🔐 Protect route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const totalAppointments = appointments.length;
  const visitedCount = appointments.filter(
    (a) => a.hasVisited === true
  ).length;

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="Doctor" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>
                {admin
                  ? `${admin.firstName} ${admin.lastName}`
                  : "Admin"}
              </h5>
            </div>
            <p>
              Welcome back! Here’s a quick overview of what’s
              happening in the system today.
            </p>
          </div>
        </div>

        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>

        <div className="thirdBox">
          <p>Visited Patients</p>
          <h3>{visitedCount}</h3>
        </div>
      </div>

      <div className="banner">
        <h5>Appointments</h5>

        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Visited</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    {appointment.firstName}{" "}
                    {appointment.lastName}
                  </td>
                  <td>
                    {appointment.appointment_date?.substring(
                      0,
                      16
                    )}
                  </td>
                  <td>
                    {appointment.doctor?.firstName}{" "}
                    {appointment.doctor?.lastName}
                  </td>
                  <td>{appointment.department}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          appointment._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Appointments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
