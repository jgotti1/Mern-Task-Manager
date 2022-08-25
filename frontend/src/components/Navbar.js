import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
  const [activeNav, setActiveNav] = useState("#");
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };
  return (
    <header>
      <div className="container">
        {!user && <h3 className="app_name">Task Tracker</h3>}
        {user && <span className="app_name"><span className="welcome">Welcome: </span>{user.userName}</span>}
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login" onClick={() => setActiveNav("#Login")} className={activeNav === "#Login" ? "active" : ""}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setActiveNav("#Signup")} className={activeNav === "#Signup" ? "active" : ""}>
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
