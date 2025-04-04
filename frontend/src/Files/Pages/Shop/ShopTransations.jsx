import React, { useState, useEffect } from "react";
import Loader from '../../Components/Loader/Loader';
import axios from "axios";
import { GET_TRANSACTIONS } from '../../../api';
import Pagination from '../../Components/Pagination/Pagination';
import toast from "react-hot-toast";
import FilterDateRangeModal from "../../Components/FilterModals/FilterDateRangeModal";
import FilterByCustomers from "../../Components/FilterModals/FilterByCustomers";
import FilterSelectionModal from "../../Components/FilterModals/FilterSelectionModal";
import PayPaymentModal from "../Transactions/PayPaymentModal";

const ShopTransations = ({ id }) => {

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [searchquery, setSearchQuery] = useState("");

    const [transactionType, setTransactionType] = useState([
        { value: "pay", label: "Pay" },
        { value: "recieve", label: "Recieve" },
    ]);

    const [selectedTransactionType, setSelectedTransactionType] = useState();
    // date Filter
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

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
        setCurrentPage(1);
        fetchData(1, searchquery);
    };

    const handleDateChange = (start, end) => {
        setStartDate(start || "");
        setEndDate(end || "");
    };


    // Custumer Filter
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const handleCustomerSelection = (selectedIds) => {
        setSelectedCustomers(selectedIds);
    };


    // Fetch customers data based on pagination and search
    const fetchData = (page = currentPage, query = searchquery) => {

        const data = {
            shop_pk: id,
            search: query,
            page_number: page,
            page_size: pageSize,
            selected_customer_pks: selectedCustomers || [],
            selected_transaction_type: selectedTransactionType || "",  // pay or recieve or leave it blank
            starting_date: startDate || "",
            ending_date: endDate || "",
        };
        const headers = {
            Authorization: `${userDetails.token}`,
        };


        axios
            .post(GET_TRANSACTIONS, data, { headers })
            .then((response) => {
                // console.log(response.data.transactions);
                setTransactions(response.data.transactions || []);
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
    }, [currentPage, pageSize, searchquery, startDate, endDate, selectedTransactionType, id]);





    // Make Payment Modal
    const [openMakePaymentModal, setOpenMakePaymentModal] = useState(false);
    const handleOpenMakePaymentModal = () => {
        setOpenMakePaymentModal(true);
    };

    const handleCloseMakePaymentModal = () => {
        setOpenMakePaymentModal(false);
        fetchData()
    };
    return (
        <>
            {loading && <Loader />}


            {openMakePaymentModal && (
                <PayPaymentModal
                    open={openMakePaymentModal}
                    handleClose={handleCloseMakePaymentModal}
                    shopPk={id}
                />
            )}


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
                                placeholder="Search Transactions ..."
                                value={searchquery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-xl-8 ">
                        <div className="top-content-btns">
                            <button className="btn btn-secondary"
                                onClick={() => handleOpenMakePaymentModal()}
                            >
                                Make Payment
                            </button>
                            <button className="btn btn-success">
                                Receive Payment
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
                                Date
                                {/* <FilterDateRangeModal
                                    title="Date"
                                    startDate={startDate}
                                    endDate={endDate}
                                    onDateChange={handleDateChange}
                                /> */}
                            </th>
                            <th>
                                <FilterByCustomers
                                    selectedCustomers={selectedCustomers}
                                    onSelect={handleCustomerSelection}
                                />
                            </th>
                            <th>
                                <FilterSelectionModal
                                    title="Transaction Type"
                                    options={transactionType}
                                    selectedOptions={selectedTransactionType}
                                    onSelect={setSelectedTransactionType}
                                    searchable={false}
                                    selectableAll={false}
                                />
                            </th>
                            <th>Cash</th>
                            <th>Bank</th>
                            <th>Remark</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn, index) => {
                                const totalCash = txn.cash_denomination.reduce(
                                    (sum, item) => sum + item.currency__currency * item.quantity,
                                    0
                                );
                                const totalBank = txn.payment_detail.reduce(
                                    (sum, pd) => sum + pd.amount,
                                    0
                                );

                                return (
                                    <tr key={txn.id}>
                                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td>{txn.date}</td>
                                        <td>
                                            <strong>{txn.customer?.name || "-"}</strong>
                                            <br />
                                            {txn.customer?.phone}
                                        </td>
                                        <td>{txn.transaction_type}</td>
                                        <td>{totalCash ? `₹ ${totalCash}` : '-'}</td>
                                        <td>{totalBank ? `₹ ${totalBank}` : '-'}</td>
                                        <td>{txn.remark || "-"}</td>
                                        <td>
                                            {new Date(txn.created_at).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </td>

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

export default ShopTransations
