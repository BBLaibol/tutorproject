import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated, onAuthClick }) => {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      setUserEmail(email || "");
      setUserRole(role || "");
    }
  }, [isAuthenticated]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    setIsAuthenticated(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/faq", label: "FAQ" },
    { path: "/search", label: "Discover" },
  ];

  if (isAuthenticated && userRole === "tutor") {
    navItems.push({ path: "/profile/tutor", label: "My Profile" });
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            {userEmail && <span className="user-email">{userEmail}</span>}
            {userRole === "tutor" && location.pathname !== "/profile/tutor" && (
              <Link to="/profile/tutor" className="profile-link">
                Edit Profile
              </Link>
            )}
            <button onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <button onClick={onAuthClick}>Sign up</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
