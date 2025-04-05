import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GET_SHOP_DETAIL } from "../../../api";
import Loader from "../../Components/Loader/Loader";
import toast from "react-hot-toast";
import ShopTransations from "./ShopTransations";

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
                    // console.log(response.data.data);
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
                    <li className="breadcrumb-item active">
                        Shop Detail
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        <strong>{shop?.name}</strong>
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

                                    <div  style={{maxHeight:"67vh",overflow:"auto"}}>

                                        {/* Bank Balances */}
                                        <h6 className="mt-2">Bank Balances:</h6>
                                        {shop.current_balance.bank_balance.length > 0 ? (
                                            <ul className="list-group mb-2">
                                                {shop.current_balance.bank_balance.map((bank) => (
                                                    <li className="list-group-item" key={bank.id}>
                                                        <div className="fw-medium">{bank.bank_name}</div>
                                                        <div className="small text-muted">
                                                            A/C: {bank.account_number} <br />
                                                            Name: {bank.account_name} <br />
                                                            IFSC: {bank.ifsc_code}
                                                        </div>
                                                        <div className="d-flex justify-content-between mt-1">
                                                            <span className="text-secondary">Balance:</span>
                                                            <strong>₹{bank.balance.toLocaleString()}</strong>
                                                        </div>
                                                    </li>
                                                ))}
                                                <li className="list-group-item d-flex justify-content-between bg-light text-secondary fw-medium border-top">
                                                    <span>Total Bank Balance:</span>
                                                    <span>
                                                        ₹
                                                        {shop.current_balance.bank_balance
                                                            .reduce((sum, bank) => sum + bank.balance, 0)
                                                            .toLocaleString()}
                                                    </span>
                                                </li>
                                            </ul>
                                        ) : (
                                            <p className="text-muted">No bank balance available.</p>
                                        )}

                                        {/* Cash Balances */}
                                        <h6>Cash Balances:</h6>
                                        {shop.current_balance.cash.length > 0 ? (
                                            <ul className="list-group mb-2">
                                                {shop.current_balance.cash.map((cash) => (
                                                    <li className="list-group-item d-flex justify-content-between" key={cash.id}>
                                                        <span>
                                                            ₹{cash.currency} x {cash.quantity}
                                                        </span>
                                                        <strong>₹{(cash.currency * cash.quantity).toLocaleString()}</strong>
                                                    </li>
                                                ))}
                                                <li className="list-group-item d-flex justify-content-between bg-light text-secondary fw-medium border-top">
                                                    <span>Total Cash Balance:</span>
                                                    <span>
                                                        ₹
                                                        {shop.current_balance.cash
                                                            .reduce((sum, cash) => sum + cash.currency * cash.quantity, 0)
                                                            .toLocaleString()}
                                                    </span>
                                                </li>
                                            </ul>
                                        ) : (
                                            <p className="text-muted">No cash available.</p>
                                        )}

                                    </div>




                                    {/* Grand Total */}
                                    <li className=" d-flex justify-content-between fs-5 text-danger fw-medium  mt-2">
                                        <span>Grand Total:</span>
                                        <span>
                                            ₹
                                            {(
                                                shop.current_balance.bank_balance.reduce((sum, bank) => sum + bank.balance, 0) +
                                                shop.current_balance.cash.reduce((sum, cash) => sum + cash.currency * cash.quantity, 0)
                                            ).toLocaleString()}
                                        </span>
                                    </li>
                                </div>
                            </div>
                        </div>

                        {shop && (
                            <div className="col-md-9 mt-4 mt-md-0">
                                <ShopTransations id={id} balance={shop.current_balance} fetchShopDetail={fetchData} />
                            </div>
                        )}
                    </div>
                </section>
            )}


        </>
    )
}

export default ShopDetail