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

function AllRoutes() {
  const isWideScreen = UseScreenWidth();
  const [sidetoggle, setSideToggle] = useState(isWideScreen);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null means not checked yet

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
                  <title>Login - Account Mangement</title>{" "}
                </Helmet>
                <Login />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          <Sidebar sidetoggle={sidetoggle} onToggle={handleSidebarToggle} />

          <div className={`main-content ${sidetoggle ? "" : "active"}`}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <>
                    <Helmet>
                      <title>Dashboard - Account Mangement</title>{" "}
                    </Helmet>
                    <Dashboard />
                  </>
                }
              />

              <Route
                path="/all-products"
                element={
                  <>
                    <Helmet>
                      <title>All Products - Account Mangement</title>{" "}
                    </Helmet>
                    <AllProducts />
                  </>
                }
              />

              <Route
                path="/add-product"
                element={
                  <>
                    <Helmet>
                      <title>Add Product - Account Mangement</title>{" "}
                    </Helmet>
                    <AddProduct />
                  </>
                }
              />


              {/* ===== Customers ====  */}
              <Route
                path="/all-customers"
                element={
                  <>
                    <Helmet>
                      <title>All Customers - Account Mangement</title>{" "}
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
                      <title>Shop Detail - Account Mangement</title>{" "}
                    </Helmet>
                    <ShopDetail />
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
