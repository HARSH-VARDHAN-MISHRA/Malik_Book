import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DELETE_CUSTOMER, GET_ALL_SHOPS, GET_CUSTOMERS, GET_SERVICES, GET_SHOP_DETAIL } from '../../../api';
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import Loader from '../../Components/Loader/Loader';
import Pagination from '../../Components/Pagination/Pagination';
import FilterByShopUsers from "../../Components/FilterModals/FilterByShopUsers";
import FilterDateRangeModal from "../../Components/FilterModals/FilterDateRangeModal";
import FilterByCustomers from "../../Components/FilterModals/FilterByCustomers";
import FilterSelectionModal from "../../Components/FilterModals/FilterSelectionModal";
import AddServiceModal from "./AddServiceModal";
import AddCustomerServiceModal from "./AddCustomerServiceModal";
import FilterByServiceType from "../../Components/FilterModals/FilterByServiceType";

const Services = () => {

    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [searchquery, setSearchQuery] = useState("");
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));


    const [shop, setShop] = useState();
    const [selectedShop, setSelectedShop] = useState(null);

    const [shops, setShops] = useState([]);
    const [shopLoading, setShopLoading] = useState(false);

    useEffect(() => {
        if (userDetails) {
            if (userDetails.role?.toLowerCase() === "admin") {
                getAllShops()
            } else {
                setSelectedShop(userDetails?.shop_pk);
            }
        }
    }, []);


    useEffect(() => {
        if (selectedShop) {
            fetchShopDetails();
        }
    }, [selectedShop]);

    const fetchShopDetails = () => {
        if (!selectedShop) {
            return;
        }

        setLoading(true);
        setLoadingMsg("Fetching Shop Details...");

        const headers = {
            Authorization: `${userDetails.token}`,
        };

        const params = { shop_pk: selectedShop };

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

    const getAllShops = () => {
        setShopLoading(true);

        const headers = {
            Authorization: `${userDetails.token}`,
        };


        axios.get(GET_ALL_SHOPS, { headers })
            .then((response) => {

                if (response.data.status === 1) {
                    const shopList = response.data.data;
                    setShops(shopList);

                    // Automatically set the first shop for admin
                    if (shopList.length > 0) {
                        setSelectedShop(shopList[0].id);
                    }
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


    // date Filter
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Custumer Filter
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const handleCustomerSelection = (selectedIds) => {
        setSelectedCustomers(selectedIds);
    };

    // Service Type Filter
    const [selectedServiceTypes, setSelectedServiceTypes] = useState([]);

    const handleServiceTypeSelection = (selectedIds) => {
        setSelectedServiceTypes(selectedIds);
    };


    // Shop User Filter
    const [selectedShopUsers, setSelectedShopUsers] = useState([]);

    const handleShopUsersSelection = (selectedIds) => {
        setSelectedShopUsers(selectedIds);
    };



    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setCurrentPage(1);
        fetchData(1, query);
    };

    // Handle page change for pagination
    const handlePageChange = (activePage) => {
        setCurrentPage(activePage);
        fetchData(activePage, searchquery);
    };

    const fetchData = (page = currentPage, query = searchquery) => {

        if(!selectedShop){
            return
        }
        setLoadingMsg("Fetching Services from Database!")
        const data = {
            shop_pk: selectedShop,
            search: query,
            page_number: page,
            page_size: pageSize,
            selected_customer_pks: selectedCustomers || [],
            selected_service_type_pks: selectedServiceTypes || [],
            selected_user_pks: selectedShopUsers || [],
            starting_date: startDate || "",
            ending_date: endDate || "",
        };
        const headers = {
            Authorization: `${userDetails.token}`,
        };


        axios
            .post(GET_SERVICES, data, { headers })
            .then((response) => {
                // console.log(response.data.data);
                setServices(response.data.data);
                setTotalPages(response.data.total_pages);
                setTotalRows(response.data.total_rows);
                setLoading(false);
                setLoadingMsg("")
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Internal Server Error");
                setLoading(false);
                setLoadingMsg("")
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchquery, startDate, endDate, selectedCustomers, selectedShopUsers, selectedServiceTypes , selectedShop]);

    // Add Service Modal
    const [openAddServiceModal, setOpenAddServiceModal] = useState(false);
    const handleOpenAddServiceModal = () => {
        setOpenAddServiceModal(true);
    };

    const handleCloseAddServiceModal = () => {
        setOpenAddServiceModal(false);
    };

    const [openCustomerServiceModal, setOpenCustomerServiceModal] = useState(false);

    // console.log("shop: ",shop);
    return (
        <>
            {loading && <Loader message={loadingMsg} />}



            {openAddServiceModal && (
                <AddServiceModal
                    open={openAddServiceModal}
                    handleClose={handleCloseAddServiceModal}
                    fetchData={fetchData}
                />
            )}


            {openCustomerServiceModal && (
                <AddCustomerServiceModal
                    open={openCustomerServiceModal}
                    handleClose={() => { setOpenCustomerServiceModal(false) }}
                    shopPk={selectedShop}
                    balance={shop.current_balance}
                    fetchData={fetchData}
                />
            )}


            <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap mb-2">
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
                            <Link to={`/dashboard/`}>Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Services
                        </li>
                    </ol>
                </nav>
                {userDetails?.role?.toLowerCase() === 'admin' && (
                    <div className="form-group">
                        <select
                            className="form-control"
                            value={selectedShop || ""}
                            onChange={(e) => setSelectedShop(e.target.value)}
                        >
                            {shops.map((shop) => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name} - {shop.address}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

            </div>


            <div className="top-content mb-2">
                <div className="row">
                    <div className="col-xl-4">
                        <div className="input-group">
                            <label className="input-group-text">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </label>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search Services ..."
                                value={searchquery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-xl-8 ">
                        <div className="top-content-btns mt-1 mt-md-0">
                            <button
                                onClick={() => setOpenCustomerServiceModal(true)}
                                className="btn btn-primary add-btn"
                            >
                                <i className="fa-solid fa-plus"></i> Add Service
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <FilterDateRangeModal
                                    title="Date"
                                    startDate={startDate}
                                    endDate={endDate}
                                    onDateChange={handleDateChange}
                                />
                            </th>
                            <th>
                                <FilterByCustomers
                                    selectedCustomers={selectedCustomers}
                                    onSelect={handleCustomerSelection}
                                />
                            </th>
                            <th>
                                <FilterByServiceType
                                    selectedServiceTypes={selectedServiceTypes}
                                    onSelect={handleServiceTypeSelection}
                                />
                            </th>
                            <th>
                                <FilterByShopUsers
                                    selectedShopUsers={selectedShopUsers}
                                    onSelect={handleShopUsersSelection}
                                    id={selectedShop}
                                />
                            </th>
                            <th>Cash Denomination</th>
                            <th>Bank Details</th>
                            <th>Total (Cash + Bank)</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            services.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td className="text-nowrap">
                                        {new Date(data.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td>
                                        <strong>{data.customer?.name || "-"}</strong>
                                        <br />
                                        {data.customer?.phone || "-"}
                                    </td>
                                    <td>{data?.service_type?.service_type || "-"}</td>
                                    <td>{data?.created_by?.name || "-"}</td>
                                    <td>
                                        {data.cash_denomination?.length > 0 ? (
                                            <>
                                                <ul className="mb-0 ps-0">
                                                    {data.cash_denomination.map((cd, idx) => (
                                                        <li key={idx}>
                                                            ₹{cd.currency__currency} x {cd.quantity} = ₹{cd.currency__currency * cd.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <h6 className="fw-medium text-success mt-1 ">
                                                    Total: ₹{data.cash_denomination.reduce(
                                                        (acc, cd) => acc + cd.currency__currency * cd.quantity,
                                                        0
                                                    )}
                                                </h6>
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        {data.payment_detail?.length > 0 ? (
                                            <>
                                                <ul className="mb-0 ps-0">
                                                    {data.payment_detail.map((pd, idx) => (
                                                        <li key={idx}>
                                                            ₹{pd.amount} - <strong>{pd.bank_account.bank_name}</strong> ({pd.bank_account.account_name})
                                                        </li>
                                                    ))}
                                                </ul>
                                                <h6 className="fw-medium text-success mt-1">
                                                    Total: ₹{data.payment_detail.reduce((acc, pd) => acc + pd.amount, 0)}
                                                </h6>
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td className="fw-bold text-center">
                                        <h6>₹
                                            {
                                                (data.cash_denomination?.reduce(
                                                    (acc, cd) => acc + cd.currency__currency * cd.quantity,
                                                    0
                                                ) || 0) +
                                                (data.payment_detail?.reduce((acc, pd) => acc + pd.amount, 0) || 0)
                                            }</h6>
                                    </td>


                                    <td>{data.note || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>


            </section>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
            />



        </>
    )
}

export default Services
