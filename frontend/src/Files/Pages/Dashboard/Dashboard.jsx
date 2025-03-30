import React, { useEffect, useState } from "react";
import userImage from '../../Assets/images/user.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import './Dashboard.css'

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("malik_book_user"));
    if (user && user.username) {
      setUsername(user.username);
    }
    if (user && user?.role.toLowerCase() === "admin") {
      setIsAdmin(true);
    }

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };

    setGreeting(getGreeting());
  }, []);




  const dummyData = [
    { title: 'Total Products', value: '854', change: '2.56%', icon: <i className="fa-solid fa-bag-shopping"></i>, bgClass: 'bg-primary', changeType: 'increase' },
    { title: 'Total Users', value: '31,876', change: '0.34%', icon: <i className="fa-solid fa-users-gear"></i>, bgClass: 'bg-light-pink', changeType: 'increase' },
    { title: 'Total Revenue', value: '₹34,241', change: '7.66%', icon: <i className="fa-solid fa-indian-rupee-sign"></i>, bgClass: 'bg-pink', changeType: 'increase' },
    { title: 'Total Sales', value: '1,76,586', change: '0.74%', icon: <i className="fa-solid fa-chart-line"></i>, bgClass: 'bg-orange', changeType: 'decrease' }
  ];




  return (
    <>

      <div className="container-fluid">

        <div className="row bg-white p-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <img height={80} src={userImage} alt="USER IMAGE" />
            <div>
              <h5 className="mb-0">{greeting}! {username}</h5>
              <p>Welcome to Admin Dashboard</p>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-xl-12 dashboard">

            <div className="row">
              {dummyData.map((item, index) => (
                <div className="col-xxl-3 col-xl-6" key={index}>
                  <div className="card custom-card position-relative rounded mb-2">
                    <div className="card-body p-3 dash-bg-image">
                      <div className="d-flex align-items-start justify-content-between mb-2 gap-1 flex-xxl-nowrap flex-wrap">
                        <div>
                          <span className="text-muted d-block mb-1 text-nowrap">{item.title}</span>
                          <h4 className="fw-bold mb-0 mt-0 fs-2">{item.value}</h4>
                        </div>
                        <div className="dash-absolute-icon">
                          <span className={`avatar ${item.bgClass}`}>{item.icon}</span>
                        </div>
                      </div>
                      <div className="text-muted fs-13">
                        {item.changeType === 'increase' ? (
                          <>Increased By <span className="text-success">{item.change}<i className="ti ti-arrow-narrow-up fs-16"></i></span></>
                        ) : (
                          <>Decreased By <span className="text-danger">{item.change}<i className="ti ti-arrow-narrow-down fs-16"></i></span></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>


         

          

        </div>







      </div>
    </>
  )
}

export default Dashboard
