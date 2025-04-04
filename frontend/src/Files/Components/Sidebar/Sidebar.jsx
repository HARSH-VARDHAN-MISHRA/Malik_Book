import React, { useState } from "react";
import logo from "../../Assets/images/logo.png";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../api";
import { UseScreenWidth } from "../Utils/UseScreenWidth";

function Sidebar({ sidetoggle, onToggle }) {
  const [dropdowns, setDropdowns] = useState([]);

  const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

  const handleDropdownToggle = (index) => {
    if (dropdowns.includes(index)) {
      setDropdowns(dropdowns.filter((i) => i !== index));
    } else {
      setDropdowns([...dropdowns, index]);
    }
  };

  const initialMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <i className="fa-solid fa-gauge"></i>,
    },
    {
      title: "Customers",
      path: "/all-customers/",
      icon: <i className="fa-solid fa-users"></i>,
    },
  ];

  //Navbar
  // State to track visibility
  const [accountToggle, setAccountToggle] = useState(false);

  // Toggle function
  const toggleAccountVisibility = () => {
    setAccountToggle(!accountToggle); // Flip the visibility state
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("malik_book_user");

    // Redirect to the login page
    window.location.href = "/login";
  };

  const isWideScreen = UseScreenWidth();

  return (
    <>
      <header className={sidetoggle ? "with-sidebar" : ""}>
        <div className="top-head">
          <div className="right">
            <div className="bar" onClick={onToggle}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">


            <div className="btn-group">
              <button className="btn btn-primary btn-sm" type="button">
                {userDetails?.name || "SignIn"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu" style={{ maxWidth: '140px' }}>
                {userDetails?.role == "Admin" && (
                  <>
                    <li
                      className="dropdown-item border-bottom mb-2 pb-2"
                      onClick={() => window.open(`${BASE_URL}/admin`, "_blank")}
                    >
                      <i className="fa-solid fa-lock"></i> Admin Panel
                    </li>
                  </>
                )}

                <li
                  className="dropdown-item text-danger "
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </li>
              </ul>
            </div>

          </div>
        </div>
      </header>
      <div className={`sidebar ${sidetoggle ? "active" : ""}`}>
        <div className="logo">
          <img src={logo} alt="LOGO" />
        </div>
        <nav>
          <ul>
            {initialMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path || "javascript:void(0)"}
                  onClick={(e) => {
                    if (item.subItems) {
                      handleDropdownToggle(index);
                    } else {
                      if (!item.path) e.preventDefault(); // Prevent navigation if no path
                      if (!isWideScreen) onToggle();
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.subItems && (
                    <i
                      className={`fa-solid fa-chevron-${dropdowns.includes(index) ? "up" : "down"
                        }`}
                    ></i>
                  )}
                </Link>
                {item.subItems && dropdowns.includes(index) && (
                  <ul className="submenu">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link to={subItem.path} onClick={isWideScreen ? "" : onToggle} >{subItem.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={` mobile-overlay-only sidebar-overlay ${sidetoggle ? "open" : ""
          }`}
        onClick={onToggle}
      ></div>
    </>
  );
}

export default Sidebar;
