import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../AdminContext";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(AdminContext);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/user/admin/logout",
        { withCredentials: true }
      );

      toast.success(res.data.message || "Logged out");

      setIsAuthenticated(false);
      setAdmin(null);
      setShow(false);

      navigateTo("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );
    }
  };

  const go = (path) => {
    navigateTo(path);
    setShow(false);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className={show ? "show sidebar" : "sidebar"}>
        <div className="links">
          <TiHome onClick={() => go("/")} />
          <FaUserDoctor onClick={() => go("/doctors")} />
          <MdAddModerator onClick={() => go("/admin/addnew")} />
          <IoPersonAddSharp onClick={() => go("/doctor/addnew")} />
          <AiFillMessage onClick={() => go("/messages")} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>

      <div className="wrapper">
        <GiHamburgerMenu
          className="hamburger"
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
};

export default Sidebar;
