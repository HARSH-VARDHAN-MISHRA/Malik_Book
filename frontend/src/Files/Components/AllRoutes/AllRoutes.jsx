import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import AllProducts from "../../Pages/Products/AllProducts";
import Login from "../Auth/Login";
import TokenVerification from "../Auth/TokenVerification";
import AddProduct from "../../Pages/Products/AddProduct";
import AllCustomer from "../../Pages/Customer/AllCustomer";
import ShopDetail from "../../Pages/Shop/ShopDetail";
import { UseScreenWidth } from "../Utils/UseScreenWidth";
import ShopDepositWithdrawHistory from "../../Pages/Shop/ShopDepositWithdrawHistory";
import ShopDailyBalance from "../../Pages/Shop/ShopDailyBalance";
import Services from "../../Pages/Services/Services";

function AllRoutes() {
  const isWideScreen = UseScreenWidth();
  const [sidetoggle, setSideToggle] = useState(isWideScreen);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null means not checked yet

  const [walletContent, setWalletContent] = useState(null);

  const handleSidebarToggle = () => {
    setSideToggle(!sidetoggle);
  };

  useEffect(() => {
    setSideToggle(isWideScreen);
  }, [isWideScreen]);

  return (
    <>
      <TokenVerification setIsLoggedIn={setIsLoggedIn} />

      {isLoggedIn === null ? (
        <p>Loading...</p>
      ) : !isLoggedIn ? (
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Helmet>
                  {" "}
                  <title>Login - Malik Book</title>{" "}
                </Helmet>
                <Login />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          <Sidebar sidetoggle={sidetoggle} onToggle={handleSidebarToggle} walletContent={walletContent}  />

          <div className={`main-content ${sidetoggle ? "" : "active"}`}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <>
                    <Helmet>
                      <title>Dashboard - Malik Book</title>{" "}
                    </Helmet>
                    <Dashboard />
                  </>
                }
              />

              {/* <Route
                path="/all-products"
                element={
                  <>
                    <Helmet>
                      <title>All Products - Malik Book</title>{" "}
                    </Helmet>
                    <AllProducts />
                  </>
                }
              /> */}

              {/* <Route
                path="/add-product"
                element={
                  <>
                    <Helmet>
                      <title>Add Product - Malik Book</title>{" "}
                    </Helmet>
                    <AddProduct />
                  </>
                }
              /> */}


              {/* ===== Customers ====  */}
              <Route
                path="/all-customers"
                element={
                  <>
                    <Helmet>
                      <title>All Customers - Malik Book</title>{" "}
                    </Helmet>
                    <AllCustomer />
                  </>
                }
              />


              {/* ===== Customers ====  */}
              <Route
                path="/shop-details/:id"
                element={
                  <>
                    <Helmet>
                      <title>Shop Detail - Malik Book</title>{" "}
                    </Helmet>
                    <ShopDetail setWalletContent={setWalletContent} />
                  </>
                }
              />
              <Route
                path="/shop-balance-history/:id"
                element={
                  <>
                    <Helmet> 
                      <title> Deposit & Withdraw History - Malik Book</title>{" "}
                    </Helmet>
                    <ShopDepositWithdrawHistory />
                  </>
                }
              />
              <Route
                path="/shop-daily-balance/:id"
                element={
                  <>
                    <Helmet> 
                      <title> Balance History - Malik Book</title>{" "}
                    </Helmet>
                    <ShopDailyBalance />
                  </>
                }
              />



              <Route
                path="/services/"
                element={
                  <>
                    <Helmet> 
                      {/* <title>Shop Balance History - Malik Book</title>{" "} */}
                      <title>Service History - Malik Book</title>{" "}
                    </Helmet>
                    <Services />
                  </>
                }
              />



              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default AllRoutes;
