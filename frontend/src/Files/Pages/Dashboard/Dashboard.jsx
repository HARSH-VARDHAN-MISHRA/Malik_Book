import React, { useEffect, useState } from "react";
import userImage from '../../Assets/images/user.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import './Dashboard.css'
import { GET_ALL_SHOPS } from "../../../api";
import axios from "axios";
import toast from "react-hot-toast";
import ShopTransations from "../Shop/ShopTransations";
import AddShopModal from "../Shop/AddShopModal";
import Loader from "../../Components/Loader/Loader";

const Dashboard = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const user = JSON.parse(localStorage.getItem("malik_book_user"));

  useEffect(() => {
    if (user) {
      setUsername(user.username);

      if (user.role?.toLowerCase() === "admin") {
        setIsAdmin(true);
        getAllShops();
      } else {
        navigate(`/shop-details/${user.shop_pk}`);
      }
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


  const [shopLoading, setShopLoading] = useState(false);
  const [shops, setShops] = useState([]);

  const getAllShops = () => {
    setShopLoading(true);

    const headers = {
      Authorization: `${user.token}`,
    };


    axios.get(GET_ALL_SHOPS, { headers })
      .then((response) => {

        if (response.data.status === 1) {
          // console.log(response.data);
          setShops(response.data.data);
        } else {
          toast.error(response.data?.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error while fetching shops:", error);
        toast.error(error?.response?.data?.message || "Something went wrong!");
      })
      .finally(() => {
        setShopLoading(false);
      });
  };


  // Add Shop Modal
  const [openAddShopModal, setOpenAddShopModal] = useState(false);


  const [openSections, setOpenSections] = useState({});

  const toggleSection = (shopId, section) => {
    setOpenSections((prev) => ({
      ...prev,
      [shopId]: {
        ...prev[shopId],
        [section]: !prev[shopId]?.[section],
      },
    }));
  };


  return (
    <>
      {shopLoading && <Loader />}
      <AddShopModal
        open={openAddShopModal}
        handleClose={() => setOpenAddShopModal(false)}
        getAllShops={getAllShops}
      />

      <div className="">

        {/* <div className="row bg-white p-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <img height={80} src={userImage} alt="USER IMAGE" />
            <div>
              <h5 className="mb-0">{greeting}! {username}</h5>
              <p>Welcome to Admin Dashboard</p>
            </div>
          </div>
        </div> */}

        {/* <div className="col-xl-12 dashboard">

          <div className="row">
            {dummyData.map((item, index) => (
              <div className="col-xxl-3 col-xl-6 col-md-6" key={index}>
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
        </div> */}


        {/* For ADMIN */}
        <div className="text-end mb-2">
          {isAdmin && (
            <button
              className="btn btn-success"
              onClick={() => setOpenAddShopModal(true)}
            >
              Create Shop
            </button>
          )}
        </div>
        <div className="row">
          {/* All Shops */}

          <div className="col-md-12">

            {shopLoading ? (
              <div className="text-center">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row">
                {shops.map((shop) => {
                  const totalBank = shop.current_balance.bank_balance.reduce((sum, bank) => sum + bank.balance, 0);
                  const totalCash = shop.current_balance.cash.reduce((sum, cash) => sum + (cash.currency * cash.quantity), 0);
                  const grandTotal = totalBank + totalCash;

                  const isBankOpen = openSections[shop.id]?.bank;
                  const isCashOpen = openSections[shop.id]?.cash;

                  return (
                    <div className="col-md-4 mb-4" key={shop.id}>
                      <div className="card shadow-sm h-100">
                        <div className="card-body">
                          <h5 className="card-title">{shop.name}</h5>
                          <p className="card-text">
                            <strong>Address:</strong> {shop.address} <br />
                            <strong>Contact:</strong> {shop.contact_number || "N/A"} <br />
                          </p>

                          {/* Bank Balances */}
                          <div>
                            <h6
                              className="mt-3 d-flex justify-content-between align-items-center"
                              role="button"
                              onClick={() => toggleSection(shop.id, 'bank')}
                            >
                              <span>Bank Balances:</span>
                              <span className="text-secondary small">
                                ₹{totalBank.toLocaleString()}
                              </span>
                            </h6>

                            {isBankOpen && (
                              shop.current_balance.bank_balance.length > 0 ? (
                                <ul className="list-group mb-2">
                                  {shop.current_balance.bank_balance.map((bank) => (
                                    <li className="list-group-item d-flex justify-content-between" key={bank.id}>
                                      <span>{bank.bank_name}</span>
                                      <strong>₹{bank.balance.toLocaleString()}</strong>
                                    </li>
                                  ))}
                                  <li className="list-group-item d-flex justify-content-between bg-light text-secondary fw-medium border-top">
                                    <span>Total Bank Balance:</span>
                                    <span>₹{totalBank.toLocaleString()}</span>
                                  </li>
                                </ul>
                              ) : (
                                <p className="text-muted">No bank balance available.</p>
                              )
                            )}
                          </div>

                          {/* Cash Balances */}
                          <div>
                            <h6
                              className="d-flex justify-content-between align-items-center"
                              role="button"
                              onClick={() => toggleSection(shop.id, 'cash')}
                            >
                              <span>Cash Balances:</span>
                              <span className="text-secondary small">₹{totalCash.toLocaleString()}</span>
                            </h6>

                            {isCashOpen && (
                              shop.current_balance.cash.length > 0 ? (
                                <ul className="list-group mb-2">
                                  {shop.current_balance.cash.map((cash) => (
                                    <li className="list-group-item d-flex justify-content-between" key={cash.id}>
                                      <span>₹{cash.currency} x {cash.quantity}</span>
                                      <strong>₹{(cash.currency * cash.quantity).toLocaleString()}</strong>
                                    </li>
                                  ))}
                                  <li className="list-group-item d-flex justify-content-between bg-light text-secondary fw-medium border-top">
                                    <span>Total Cash Balance:</span>
                                    <span>₹{totalCash.toLocaleString()}</span>
                                  </li>
                                </ul>
                              ) : (
                                <p className="text-muted">No cash available.</p>
                              )
                            )}
                          </div>

                          {/* Grand Total */}
                          <li className="d-flex justify-content-between fs-5 fw-medium my-1">
                            <span>Grand Total:</span>
                            <span className="text-danger">₹{grandTotal.toLocaleString()}</span>
                          </li>

                          {/* View Details Button */}
                          <button
                            className="btn btn-primary w-100 mt-2"
                            onClick={() => navigate(`/shop-details/${shop.id}`)}
                          >
                            <i className="fa-solid fa-arrow-right"></i> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              // );
            )}


          </div>
        </div>



        {/* Shop Transations for users */}

        {/* {isAdmin ? null : (
          <div className="row">
            <div className="col-md-12">
              <ShopTransations id={user.shop_pk} />
            </div>
          </div>

        )} */}



      </div>
    </>
  )
}

export default Dashboard
