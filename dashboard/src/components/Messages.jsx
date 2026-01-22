import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../AdminContext";

const Messages = () => {
  const { isAuthenticated } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);

  // 🔒 Prevent React 18 double fetch
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load messages"
        );
      }
    };

    fetchMessages();
  }, []);

  // 🔐 Protect route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>

      <div className="banner">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div className="card" key={message._id}>
              <div className="details">
                <p>
                  First Name: <span>{message.firstName}</span>
                </p>
                <p>
                  Last Name: <span>{message.lastName}</span>
                </p>
                <p>
                  Email: <span>{message.email}</span>
                </p>
                <p>
                  Phone: <span>{message.phone}</span>
                </p>
                <p>
                  Message: <span>{message.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            No Messages Found
          </p>
        )}
      </div>
    </section>
  );
};

export default Messages;
