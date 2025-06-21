import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuth";
import { auth } from "../firebase";
import "./Navbar.css";

const ADMIN_EMAIL = "joshuabae0626@gmail.com";

const Navbar: React.FC = () => {
  const location = useLocation();
  const user = useAuthUser();

  const logout = () => auth.signOut();

  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>홈</Link>
      <Link to="/encyclopedia" className={location.pathname === "/encyclopedia" ? "active" : ""}>인물백과사전</Link>
      {/* 어드민에게만 보이는 권한관리 메뉴 */}
      {user && user.email === ADMIN_EMAIL && (
        <Link
          to="/admin"
          className={location.pathname === "/admin" ? "active" : ""}
          style={{ marginLeft: "1rem" }}
        >
          권한관리
        </Link>
      )}
      <div className="spacer" />
      {user ? (
        <>
          <span style={{ marginRight: 16 }}>
            {user.email === ADMIN_EMAIL ? "👑 어드민" : user.email}
          </span>
          <button onClick={logout} style={{
            background: "none",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}>로그아웃</button>
        </>
      ) : (
        <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>로그인</Link>
      )}
    </nav>
  );
};

export default Navbar;
