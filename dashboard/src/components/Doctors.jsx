import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../AdminContext";

const Doctors = () => {
  const { isAuthenticated } = useContext(AdminContext);
  const [doctors, setDoctors] = useState([]);

  // 🔒 Prevent React 18 double fetch
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load doctors"
        );
      }
    };

    fetchDoctors();
  }, []);

  // 🔐 Protect route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>

      <div className="banner">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="card" key={doctor._id}>
              <img
                src={doctor.docAvatar?.url || "/docHolder.jpg"}
                alt={`${doctor.firstName} ${doctor.lastName}`}
              />

              <h4>
                {doctor.firstName} {doctor.lastName}
              </h4>

              <div className="details">
                <p>
                  Email: <span>{doctor.email}</span>
                </p>
                <p>
                  Phone: <span>{doctor.phone}</span>
                </p>
                <p>
                  DOB:{" "}
                  <span>
                    {doctor.dob
                      ? doctor.dob.substring(0, 10)
                      : "N/A"}
                  </span>
                </p>
                <p>
                  Department:{" "}
                  <span>{doctor.doctorDepartment}</span>
                </p>
                <p>
                  NIC: <span>{doctor.nic}</span>
                </p>
                <p>
                  Gender: <span>{doctor.gender}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2 style={{ textAlign: "center" }}>
            No Registered Doctors Found
          </h2>
        )}
      </div>
    </section>
  );
};

export default Doctors;
