import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import Loader from '../../Components/Loader/Loader';
import Pagination from '../../Components/Pagination/Pagination';
import toast from "react-hot-toast";
import { GET_DEPOSIT_AND_WITHDRAW_HISTORY } from '../../../api';
import FilterSelectionModal from "../../Components/FilterModals/FilterSelectionModal";
import FilterByShopUsers from "../../Components/FilterModals/FilterByShopUsers";

const ShopDepositWithdrawHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [searchquery, setSearchQuery] = useState("");
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));


    const [historyType, setHistoryType] = useState([
        { value: "Withdraw", label: "withdraw" },
        { value: "Deposit", label: "deposit" },
    ]);

    const [selectedHistoryType, setSelectedHistoryType] = useState();
    // date Filter
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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

    // Handle page size change (items per page)
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when page size changes
        fetchData(1, searchquery); // Fetch data for the first page with updated page size
    };

    // Fetch customers data based on pagination and search
    const fetchData = (page = currentPage, query = searchquery) => {

        const data = {
            shop_pk: parseInt(id),
            search: query,
            page_number: page,
            page_size: pageSize,
            selected_user_pks: selectedShopUsers || [],
            selected_type: selectedHistoryType || "",
            starting_date: startDate || "",
            ending_date: endDate || "",
        };
        const headers = {
            Authorization: `${userDetails.token}`,
        };

        // console.log("data : ",data);
        axios
            .post(GET_DEPOSIT_AND_WITHDRAW_HISTORY, data, { headers })
            .then((response) => {
                // console.log(response.data);
                setHistory(response.data.data);
                setTotalPages(response.data.total_pages);
                setTotalRows(response.data.total_rows);
                setLoading(false);

            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Internal Server Error");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchquery, selectedHistoryType, selectedShopUsers , id]);


    return (
        <>
            {loading && <Loader />}

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
                    <li className="breadcrumb-item active" aria-current="page">
                        Shop Balance History
                    </li>
                </ol>
            </nav>

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
                                placeholder="Search History ..."
                                value={searchquery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-xl-8">

                    </div>
                </div>
            </div>


            <section className="main-table">
                <table className="table table-bordered allcustomer">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>
                                <FilterSelectionModal
                                    title="Type"
                                    options={historyType}
                                    selectedOptions={selectedHistoryType}
                                    onSelect={setSelectedHistoryType}
                                    searchable={false}
                                    selectableAll={false}
                                />
                            </th>
                            <th>Amount</th>
                            <th>Bank</th>
                            <th>Account No.</th>
                            <th>
                                <FilterByShopUsers
                                    selectedShopUsers={selectedShopUsers}
                                    onSelect={handleShopUsersSelection}
                                    id={id}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td className="text-center loading-table" colSpan="7">Loading..</td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td className="text-center" colSpan="7">No Records Found</td>
                            </tr>
                        ) : (
                            history.map((item, index) => {
                                const payment = item.payment_detail[0]; // If exists
                                return (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {new Date(item.date).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="text-start">
                                            <span className={`badge ${item.type === 'withdraw' ? 'bg-danger' : 'bg-success'}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td>
                                            {payment ? `₹${payment.amount}` : '-'}
                                        </td>
                                        <td>
                                            {payment ? payment.bank_account.bank_name : '-'}
                                        </td>
                                        <td>
                                            {payment ? payment.bank_account.account_number : '-'}
                                        </td>
                                        <td>{item.created_by.name}</td>
                                    </tr>
                                );
                            })
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

export default ShopDepositWithdrawHistory