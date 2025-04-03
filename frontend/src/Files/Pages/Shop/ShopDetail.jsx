import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GET_SHOP_DETAIL } from "../../../api";
import Loader from "../../Components/Loader/Loader";
import toast from "react-hot-toast";

const ShopDetail = () => {
    const { id } = useParams(); // Extract the shop ID from URL
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMsg, setLoadingMsg] = useState("Fetching Shop Details...");

    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = () => {
        setLoading(true);
        setLoadingMsg("Fetching Shop Details...");

        const headers = {
            Authorization: `${userDetails.token}`,
        };

        const params = { shop_pk: id };

        axios
            .get(`${GET_SHOP_DETAIL}`, { params, headers })
            .then((response) => {
                if (response.data.status === 1) {
                    console.log(response.data.data);
                    setShop(response.data.data);
                } else {
                    toast.error(response.data.message || "Failed to fetch shop details");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Internal Server Error");
            })
            .finally(() => {
                setLoading(false);
                setLoadingMsg("");
            });
    };

    return (
        <>
            {loading && <Loader message={loadingMsg} />}


            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <i
                            className="fa-solid fa-arrow-left"
                            onClick={() => {
                                if (window.history.length > 1) {
                                    navigate(-1);
                                } else {
                                    navigate(`/dashboard/`);
                                }
                            }}
                        ></i>{" "}
                        <Link to={`/`}>Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/all-shops`}>Shops</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        <strong>(#{id})</strong>
                    </li>
                </ol>
            </nav>

            {/* Shop Details Section */}
            {shop && (
                <section className="">
                    <div className="row">
                        {/* Left Section: Shop Details */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{shop.name}</h5>
                                    <p className="card-text">
                                        <strong>Address:</strong> {shop.address}
                                    </p>
                                    <p className="card-text">
                                        <strong>Contact:</strong> {shop.contact_number || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Cash & Bank Balance */}
                        <div className="col-md-9">
                            <div className="row">
                                {/* Bank Balance Details */}
                                <div className="col-md-12">
                                    <h5>Bank Balance</h5>
                                    <section className="main-table">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Bank Name</th>
                                                    <th>Account Name</th>
                                                    <th>Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shop.current_balance.bank_balance.length > 0 ? (
                                                    shop.current_balance.bank_balance.map((bank) => (
                                                        <tr key={bank.id}>
                                                            <td>{bank.bank_name}</td>
                                                            <td>{bank.account_name}</td>
                                                            <td>₹{bank.balance.toLocaleString()}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center">
                                                            No Bank Balance Available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                    </section>
                                </div>

                                {/* Cash Details */}
                                <div className="col-md-12 mt-2">
                                    <h5>Cash Balance</h5>
                                    <section className="main-table">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Currency</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shop.current_balance.cash.length > 0 ? (
                                                    shop.current_balance.cash.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>₹{item.currency}</td>
                                                            <td>{item.quantity}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2" className="text-center">
                                                            No Cash Available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                    </section>
                                </div>


                            </div>
                        </div>
                    </div>
                </section>
            )}


        </>
    )
}

export default ShopDetail