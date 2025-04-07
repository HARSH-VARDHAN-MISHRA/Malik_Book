import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GET_DAILY_BALANCE } from '../../../api';
import Loader from '../../Components/Loader/Loader';
import Pagination from '../../Components/Pagination/Pagination';
import toast from "react-hot-toast";
import FilterDateRangeModal from "../../Components/FilterModals/FilterDateRangeModal";

const ShopDailyBalance = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const [balances, setBalances] = useState([]);
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

   

    const handlePageChange = (activePage) => {
        setCurrentPage(activePage);
        fetchData(activePage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
        fetchData(1);
    };

    const handleDateChange = (start, end) => {
        setStartDate(start || "");
        setEndDate(end || "");
        fetchData(1);
    };

    const fetchData = (page = currentPage) => {
        setLoading(true);
        const data = {
            shop_pk: id,
            page_number: page,
            page_size: pageSize,
            starting_date: startDate || "",
            ending_date: endDate || "",
        };
        const headers = {
            Authorization: `${userDetails.token}`,
        };

        axios
            .post(GET_DAILY_BALANCE, data, { headers })
            .then((response) => {
                setBalances(response.data.data || []);
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
    }, [currentPage, pageSize]);

    const renderBankBalances = (balances) => (
        <ul className="list-unstyled mb-0">
            {balances.map((b, i) => (
                <li key={i}>
                    <strong>{b.bank_account.bank_name}</strong> - ₹{b.amount.toLocaleString()}
                </li>
            ))}
        </ul>
    );

    const renderCashDetails = (cashDetails) => (
        <ul className="list-unstyled mb-0">
            {cashDetails.map((c, i) => (
                <li key={i}>
                    ₹{c.currency} × {c.quantity} = ₹{c.currency * c.quantity}
                </li>
            ))}
        </ul>
    );

    return (
        <>
            {/* {loading && <Loader />} */}

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
                        Shop Balance Detail
                    </li>
                </ol>
            </nav>

           
            <section className="main-table">
                <table className="table table-bordered allcustomer">
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
                            <th>Opening Bank Balance</th>
                            <th>Opening Cash Detail</th>
                            <th>Closing Bank Balance</th>
                            <th>Closing Cash Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && balances.length > 0 ? (
                            balances.map((balance, index) => (
                                <tr key={index}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>{balance.date}</td>
                                    <td>{renderBankBalances(balance.opening_bank_balance)}</td>
                                    <td>{renderCashDetails(balance.opening_cash_detail)}</td>
                                    <td>{renderBankBalances(balance.closing_bank_balance)}</td>
                                    <td>{renderCashDetails(balance.closing_cash_detail)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">No records found</td>
                            </tr>
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
    );
};

export default ShopDailyBalance;
