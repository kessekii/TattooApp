// src/components/BottomNav.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaUser, FaBell, FaEllipsisH } from "react-icons/fa";
import { Button } from "@mui/material";
import { logout } from "../../stores/reducers/usersReducer";
import { useActions } from "../../hooks/useActions";
import useLocalStorage from "../../hooks/useLocalStorage";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { logOutAction } = useActions();
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  return (
    <nav className="bottom-nav">
      <Link
        to="/home"
        className={location.pathname === "/home" ? "active" : ""}
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <Link
        to="/settings"
        className={location.pathname === "/settings" ? "active" : ""}
      >
        <FaCog />
        <span>Settings</span>
      </Link>
      <Link
        to="/profile"
        className={location.pathname === "/profile" ? "active" : ""}
      >
        <FaUser />
        <span>Profile</span>
      </Link>
      <Link
        to="/notifications"
        className={location.pathname === "/notifications" ? "active" : ""}
      >
        <FaBell />
        <span>Notifications</span>
      </Link>
      <Button
        onClick={async () => {
          logOutAction({ setUser });
          navigate("/");
        }}
      >
        <span>More</span>
      </Button>
    </nav>
  );
};

export default BottomNav;
