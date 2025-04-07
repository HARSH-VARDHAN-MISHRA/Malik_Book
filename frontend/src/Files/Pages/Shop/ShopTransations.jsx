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
import ReceivePaymentModal from "../Transactions/ReceivePaymentModal";
import AddBankAccount from "./AddBankAccount";
import ShopUsers from "./ShopUsers";
import DepositMoney from "../Transactions/DepositMoney";
import WithdrawMoney from "../Transactions/WithdrawMoney";
import FilterByShopUsers from "../../Components/FilterModals/FilterByShopUsers";
import { useNavigate } from "react-router-dom";

const ShopTransations = ({ id, balance, fetchShopDetail, setWalletContent }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [searchquery, setSearchQuery] = useState("");

    const [transactionType, setTransactionType] = useState([
        { value: "Pay", label: "Pay" },
        { value: "Receive", label: "Receive" },
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
        setStartDate(start);
        setEndDate(end);
    };


    // Custumer Filter
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const handleCustomerSelection = (selectedIds) => {
        setSelectedCustomers(selectedIds);
    };
    // Shop User Filter
    const [selectedShopUsers, setSelectedShopUsers] = useState([]);

    const handleShopUsersSelection = (selectedIds) => {
        setSelectedShopUsers(selectedIds);
    };



    // Fetch customers data based on pagination and search
    const fetchData = (page = currentPage, query = searchquery) => {

        const data = {
            shop_pk: id,
            search: query,
            page_number: page,
            page_size: pageSize,
            selected_user_pks: selectedShopUsers || [],
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
    }, [currentPage, pageSize, searchquery, startDate, endDate, selectedTransactionType, selectedCustomers, selectedShopUsers, id]);





    // Make Payment Modal
    const [openMakePaymentModal, setOpenMakePaymentModal] = useState(false);
    const handleOpenMakePaymentModal = () => {
        setOpenMakePaymentModal(true);
    };

    const handleCloseMakePaymentModal = () => {
        setOpenMakePaymentModal(false);
    };

    // Receive Payment Modal
    const [openReceivePaymentModal, setOpenReceivePaymentModal] = useState(false);
    const handleOpenReceivePaymentModal = () => {
        setOpenReceivePaymentModal(true);
    };

    const handleCloseReceivePaymentModal = () => {
        setOpenReceivePaymentModal(false);
    };


    // Deposit Money Modal
    const [openDepositMoneyModal, setOpenDepositMoneyModal] = useState(false);
    const handleOpenDepositMoneyModal = () => {
        setOpenDepositMoneyModal(true);
    };

    const handleCloseDepositMoneyModal = () => {
        setOpenDepositMoneyModal(false);
    };


    // Withdraw Money Modal
    const [openWithdrawMoneyModal, setOpenWithdrawMoneyModal] = useState(false);
    const handleOpenWithdrawMoneyModal = () => {
        setOpenWithdrawMoneyModal(true);
    };

    const handleCloseWithdrawMoneyModal = () => {
        setOpenWithdrawMoneyModal(false);
    };


    // Add Bank Account Modal
    const [openAddBankAccountModal, setOpenAddBankAccountModal] = useState(false);

    const handleOpenAddBankAccountModal = () => {
        setOpenAddBankAccountModal(true);
    };

    const handleCloseAddBankAccountModal = () => {
        setOpenAddBankAccountModal(false);
    };

    // Shop Users 
    const [openShopUsersModal, setOpenShopUsersModal] = useState(false);

    const handleOpenShopUsersModal = () => {
        setOpenShopUsersModal(true);
    };

    const handleCloseShopUsersModal = () => {
        setOpenShopUsersModal(false);
    };



    // Wallet 
    const [showWallet, setShowWallet] = useState(false);
    // Calculate totals
    const totalCash = balance?.cash?.reduce((sum, item) => sum + item.currency * item.quantity, 0) || 0;
    const totalBank = balance?.bank_balance?.reduce((sum, item) => sum + item.balance, 0) || 0;
    const totalBalance = totalCash + totalBank;




    // useEffect(() => {
    //     const walletUI = (
    //         <div className="wallet-container px-2" style={{ position: "relative", zIndex: 10 }}>
    //             <button
    //                 className="btn btn-success w-100 d-flex align-items-center justify-content-between"
    //                 onClick={() => setShowWallet(prev => !prev)}
    //             >
    //                 <i className="fa-solid fa-wallet me-1"></i>
    //                 ₹ {totalBalance.toLocaleString()}
    //                 <i className={` ms-2 fa fa-chevron-${showWallet ? "up" : "down"}`}></i>
    //             </button>

    //             {showWallet && (
    //                 <div
    //                     className="wallet-dropdown bg-white shadow rounded p-3 mt-2"
    //                     style={{
    //                         position: "absolute",
    //                         top: "100%",
    //                         right: 0,
    //                         width: "200%",
    //                         maxWidth: "300px",
    //                         zIndex: 9999, // zIndex within its own context
    //                     }}
    //                 >
    //                     {/* <h6 className="text-primary fw-bold mb-2">Wallet Summary</h6> */}
    //                     <div className="mb-2">
    //                         <div><strong>Cash Balance:</strong> ₹ {totalCash.toLocaleString()}</div>
    //                         <div><strong>Bank Balance:</strong> ₹ {totalBank.toLocaleString()}</div>
    //                         <hr />
    //                     </div>

    //                     {userDetails.role?.toLowerCase() === "admin" && (
    //                         <div className="d-grid gap-2 mb-2">
    //                             <button className="btn btn-primary" onClick={() => setOpenShopUsersModal(true)}>
    //                                 <i className="fa-solid fa-users me-1"></i> Users
    //                             </button>
    //                             <button className="btn btn-primary" onClick={handleOpenAddBankAccountModal}>
    //                                 <i className="fa-solid fa-building-columns me-1"></i> Add Bank Account
    //                             </button>
    //                         </div>
    //                     )}

    //                     <div className="d-grid gap-2">
    //                         <button className="btn btn-success" onClick={handleOpenDepositMoneyModal}>
    //                             <i className="fa-solid fa-arrow-down me-1"></i> Deposit
    //                         </button>
    //                         <button className="btn btn-danger" onClick={handleOpenWithdrawMoneyModal}>
    //                             <i className="fa-solid fa-arrow-up me-1"></i> Withdraw
    //                         </button>
    //                         <button className="btn btn-primary"
    //                             onClick={() => navigate(`/shop-balance-history/${id}`)}
    //                         >
    //                             <i class="fa-solid fa-clock-rotate-left"></i> Balance History
    //                         </button>
    //                     </div>
    //                 </div>
    //             )}
    //         </div>
    //     );

    //     if (setWalletContent) {
    //         setWalletContent(walletUI);
    //     }
    // }, [showWallet, totalBalance, totalCash, totalBank]);




    return (
        <>
            {loading && <Loader />}

            {openMakePaymentModal && (
                <PayPaymentModal
                    open={openMakePaymentModal}
                    handleClose={handleCloseMakePaymentModal}
                    shopPk={id}
                    balance={balance}
                    fetchShopDetail={fetchShopDetail}
                    fetchData={fetchData}
                />
            )}
            {openReceivePaymentModal && (
                <ReceivePaymentModal
                    open={openReceivePaymentModal}
                    handleClose={handleCloseReceivePaymentModal}
                    shopPk={id}
                    balance={balance}
                    fetchShopDetail={fetchShopDetail}
                    fetchData={fetchData}
                />
            )}
            {openAddBankAccountModal && (
                <AddBankAccount
                    open={openAddBankAccountModal}
                    handleClose={handleCloseAddBankAccountModal}
                    shopPk={id}
                    balance={balance}
                    fetchShopDetail={fetchShopDetail}
                    fetchData={fetchData}
                />
            )}

            {openDepositMoneyModal && (
                <DepositMoney
                    open={openDepositMoneyModal}
                    handleClose={handleCloseDepositMoneyModal}
                    shopPk={id}
                    balance={balance}
                    fetchShopDetail={fetchShopDetail}
                    fetchData={fetchData}
                />
            )}



            {openWithdrawMoneyModal && (
                <WithdrawMoney
                    open={openWithdrawMoneyModal}
                    handleClose={handleCloseWithdrawMoneyModal}
                    shopPk={id}
                    balance={balance}
                    fetchShopDetail={fetchShopDetail}
                    fetchData={fetchData}
                />
            )}

            {openShopUsersModal && (
                <ShopUsers
                    open={openShopUsersModal}
                    handleClose={handleCloseShopUsersModal}
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
                        <div className="top-content-btns mt-1 mt-md-0">

                            {/* {userDetails.role?.toLowerCase() === "admin" ? (
                                <>
                                    <button className="btn btn-primary" onClick={() => setOpenShopUsersModal(true)}>
                                        <i className="fa-solid fa-users"></i> Users
                                    </button>

                                    <button className="btn btn-primary"
                                        onClick={() => handleOpenAddBankAccountModal()}
                                    >
                                        <i class="fa-solid fa-building-columns"></i> Add Bank Account
                                    </button>
                                </>
                            ) : null} */}


                            {/* <button className="btn btn-success"
                                onClick={() => handleOpenDepositMoneyModal()}
                            >
                                Deposit
                            </button>
                            <button className="btn btn-danger"
                                onClick={() => handleOpenWithdrawMoneyModal()}
                            >
                                Withdraw
                            </button> */}

                            <button className="btn btn-secondary"
                                onClick={() => handleOpenMakePaymentModal()}
                            >
                                Make Payment
                            </button>
                            <button className="btn btn-success"
                                onClick={() => handleOpenReceivePaymentModal()}
                            >
                                Receive Payment
                            </button>


                            {/* Wallet Dropdown */}
                            <div className="wallet-container position-relative" >
                                <button
                                    className="btn btn-primary d-flex align-items-center justify-content-between w-100"
                                    onClick={() => setShowWallet(prev => !prev)}
                                >
                                    <i className="fa-solid fa-wallet me-2"></i>
                                    ₹ {totalBalance.toLocaleString()}
                                    <i className={`ms-2 fa fa-chevron-${showWallet ? "up" : "down"}`}></i>
                                </button>

                                {showWallet && (
                                    <div
                                        className="wallet-dropdown bg-white shadow rounded p-3 mt-2"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            zIndex: 999,
                                            width: "300px",
                                        }}
                                    >
                                        <div className="mb-2">
                                            <div><strong>Cash Balance:</strong> ₹ {totalCash.toLocaleString()}</div>
                                            <div><strong>Bank Balance:</strong> ₹ {totalBank.toLocaleString()}</div>
                                            <hr />
                                        </div>



                                        <div className="d-grid gap-2">
                                            <button className="btn btn-success" onClick={handleOpenDepositMoneyModal}>
                                                <i className="fa-solid fa-arrow-down me-1"></i> Deposit
                                            </button>
                                            <button className="btn btn-danger" onClick={handleOpenWithdrawMoneyModal}>
                                                <i className="fa-solid fa-arrow-up me-1"></i> Withdraw
                                            </button>
                                            <button className="btn btn-primary" onClick={() => navigate(`/shop-balance-history/${id}`)}>
                                                <i className="fa-solid fa-clock-rotate-left me-1"></i> Balance History
                                            </button>
                                        </div>
                                        {userDetails.role?.toLowerCase() === "admin" && (
                                            <div className="d-grid gap-2 mt-2">
                                                <button className="btn btn-primary" onClick={() => setOpenShopUsersModal(true)}>
                                                    <i className="fa-solid fa-users me-1"></i> Users
                                                </button>
                                                <button className="btn btn-primary" onClick={handleOpenAddBankAccountModal}>
                                                    <i className="fa-solid fa-building-columns me-1"></i> Add Bank Account
                                                </button>
                                                <button className="btn btn-primary" onClick={() => { navigate(`/shop-daily-balance/${id}`) }}>
                                                    <i className="fa-solid fa-clock-rotate-left me-1"></i> Daily Balance History
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

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
                            <th>
                                <FilterByShopUsers
                                    selectedShopUsers={selectedShopUsers}
                                    onSelect={handleShopUsersSelection}
                                    id={id}
                                />
                            </th>
                            <th>Remark</th>
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
                                        <td className="text-nowrap">
                                            {new Date(txn.date).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                // hour: 'numeric',
                                                // minute: '2-digit',
                                                // hour12: true,
                                            })}

                                        </td>
                                        <td>
                                            <strong>{txn.customer?.name || "-"}</strong>
                                            <br />
                                            {txn.customer?.phone}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${txn.transaction_type === 'Pay' ? 'bg-danger' : 'bg-success'}`}>
                                                {txn.transaction_type}
                                            </span>
                                        </td>

                                        <td className="text-nowrap">{totalCash ? `₹ ${totalCash}` : '-'}</td>
                                        <td className="text-nowrap">{totalBank ? `₹ ${totalBank}` : '-'}</td>
                                        <td className="text-nowrap">
                                            {txn?.created_by?.name}
                                        </td>
                                        <td>{txn.remark || "-"}</td>

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
