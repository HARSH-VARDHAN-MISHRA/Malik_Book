import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GET_DAILY_BALANCE } from '../../../api';
import Loader from '../../Components/Loader/Loader';
import Pagination from '../../Components/Pagination/Pagination';
import toast from "react-hot-toast";
import FilterDateRangeModal from "../../Components/FilterModals/FilterDateRangeModal";
import Modal from 'react-bootstrap/Modal';

const ShopDailyBalance = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [shopObj, setShopObj] = useState(null)
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
                // console.log(response.data);
                setShopObj(response.data.shop_obj);
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
    }, [currentPage, pageSize, startDate, endDate]);

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



    // -------- 

    const [showModal, setShowModal] = useState(false);
    const [selectedBalance, setSelectedBalance] = useState(null);

    const handleView = (balance) => {
        setSelectedBalance(balance);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedBalance(null);
    };


    const calculateTotalAmount = (arr) => {
        return arr.reduce((total, item) => total + (item.amount || 0), 0);
    };

    const calculateCashTotal = (arr) => {
        return arr.reduce((total, item) => total + (item.currency * item.quantity), 0);
    };




    // 

    const [selectedViewType, setSelectedViewType] = useState(null); // 'opening_bank', etc.
    const [selectedViewTypeBalance, setSelectedViewTypeBalance] = useState(null);
    const [showViewTypeModal, setShowViewTypeModal] = useState(false);


    const handleViewTypeModal = (balance, type) => {
        setSelectedViewTypeBalance(balance);
        setSelectedViewType(type);
        setShowViewTypeModal(true);
    };




    return (
        <>
            {/* {loading && <Loader />} */}

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detailed Transactions - {selectedBalance?.date}</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ paddingBottom: '100px', minHeight: "80vh", position: 'relative' }}>
                    <div className="row" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {/* Opening Details */}
                        <div className="col-md-6">
                            <h6 className="mb-3">Opening Details</h6>
                            {/* Opening Bank */}
                            <div className="mb-3">
                                <h6 className="text-primary">Bank Accounts</h6>
                                <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
                                    {selectedBalance?.opening_bank_balance?.length > 0 ? (
                                        selectedBalance.opening_bank_balance.map((bank, i) => (
                                            <div className="card mb-2" key={i}>
                                                <div className="card-body p-2">
                                                    <strong>{bank.bank_account.bank_name}</strong>
                                                    <p className="mb-1 small">A/C No: {bank.bank_account.account_number}</p>
                                                    <p className="mb-1 small">IFSC: {bank.bank_account.ifsc_code}</p>
                                                    <p className="mb-1 small">Holder: {bank.bank_account.account_name}</p>
                                                    <span className="badge bg-success">₹{bank.amount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted small">No opening bank balance.</p>
                                    )}
                                </div>
                            </div>

                            {/* Opening Cash */}
                            <div>
                                <h6 className="text-warning">Cash Details</h6>
                                <ul className="list-group mb-2" style={{ maxHeight: "30vh", overflowY: "auto" }}>
                                    {selectedBalance?.opening_cash_detail?.length > 0 ? (
                                        selectedBalance.opening_cash_detail.map((cash, i) => (
                                            <li className="list-group-item d-flex justify-content-between" key={i}>
                                                ₹{cash.currency} × {cash.quantity}
                                                <strong>₹{(cash.currency * cash.quantity)?.toLocaleString()}</strong>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted small">No opening cash details.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Closing Details */}
                        <div className="col-md-6">
                            <h6 className="mb-3">Closing Details</h6>

                            {/* Closing Bank */}
                            <div className="mb-3">
                                <h6 className="text-primary">Bank Accounts</h6>
                                <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
                                    {selectedBalance?.closing_bank_balance?.length > 0 ? (
                                        selectedBalance.closing_bank_balance.map((bank, i) => (
                                            <div className="card mb-2" key={i}>
                                                <div className="card-body p-2">
                                                    <strong>{bank.bank_account.bank_name}</strong>
                                                    <p className="mb-1 small">A/C No: {bank.bank_account.account_number}</p>
                                                    <p className="mb-1 small">IFSC: {bank.bank_account.ifsc_code}</p>
                                                    <p className="mb-1 small">Holder: {bank.bank_account.account_name}</p>
                                                    <span className="badge bg-success">₹{bank.amount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted small">No closing bank balance.</p>
                                    )}
                                </div>
                            </div>

                            {/* Closing Cash */}
                            <div>
                                <h6 className="text-warning">Cash Details</h6>
                                <ul className="list-group mb-2" style={{ maxHeight: "30vh", overflowY: "auto" }}>
                                    {selectedBalance?.closing_cash_detail?.length > 0 ? (
                                        selectedBalance.closing_cash_detail.map((cash, i) => (
                                            <li className="list-group-item d-flex justify-content-between" key={i}>
                                                ₹{cash.currency} × {cash.quantity}
                                                <strong>₹{(cash.currency * cash.quantity)?.toLocaleString()}</strong>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted small">No closing cash details.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div
                        className="bg-light p-3 border-top"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div className="d-flex justify-content-between fw-bold fs-6">
                            <span>Total Opening:</span>
                            <span className="text-secondary">
                                ₹
                                {(
                                    calculateTotalAmount(selectedBalance?.opening_bank_balance || []) +
                                    calculateCashTotal(selectedBalance?.opening_cash_detail || [])
                                ).toLocaleString()}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold fs-6">
                            <span>Total Closing:</span>
                            <span className="text-secondary">
                                ₹
                                {(
                                    calculateTotalAmount(selectedBalance?.closing_bank_balance || []) +
                                    calculateCashTotal(selectedBalance?.closing_cash_detail || [])
                                ).toLocaleString()}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between pt-2 mt-2 border-top fw-bold fs-5">
                            <span>Earning:</span>
                            <span
                                className={`${(calculateTotalAmount(selectedBalance?.closing_bank_balance || []) +
                                    calculateCashTotal(selectedBalance?.closing_cash_detail || [])) -
                                    (calculateTotalAmount(selectedBalance?.opening_bank_balance || []) +
                                        calculateCashTotal(selectedBalance?.opening_cash_detail || [])) >= 0
                                    ? 'text-success'
                                    : 'text-danger'
                                    }`}
                            >
                                ₹
                                {(
                                    (calculateTotalAmount(selectedBalance?.closing_bank_balance || []) +
                                        calculateCashTotal(selectedBalance?.closing_cash_detail || [])) -
                                    (calculateTotalAmount(selectedBalance?.opening_bank_balance || []) +
                                        calculateCashTotal(selectedBalance?.opening_cash_detail || []))
                                )?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>


            <Modal show={showViewTypeModal} onHide={() => setShowViewTypeModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-capitalize">
                        {selectedViewType?.replace(/_/g, " ")} Details
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        {/* Opening Bank */}
                        {selectedViewType === 'opening_bank' && (
                            <div className="col-md-12">
                                <h6 className="text-primary">Opening Bank Accounts</h6>
                                <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
                                    {selectedViewTypeBalance?.opening_bank_balance?.length > 0 ? (
                                        selectedViewTypeBalance.opening_bank_balance.map((bank, i) => (
                                            <div className="card mb-2" key={i}>
                                                <div className="card-body p-2">
                                                    <strong>{bank.bank_account.bank_name}</strong>
                                                    <p className="mb-1 small">A/C No: {bank.bank_account.account_number}</p>
                                                    <p className="mb-1 small">IFSC: {bank.bank_account.ifsc_code}</p>
                                                    <p className="mb-1 small">Holder: {bank.bank_account.account_name}</p>
                                                    <span className="badge bg-success">₹{bank.amount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No opening bank balance.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Opening Cash */}
                        {selectedViewType === 'opening_cash' && (
                            <div className="col-md-12">
                                <h6 className="text-warning">Opening Cash Details</h6>
                                <ul className="list-group" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                                    {selectedViewTypeBalance?.opening_cash_detail?.length > 0 ? (
                                        selectedViewTypeBalance.opening_cash_detail.map((cash, i) => (
                                            <li className="list-group-item d-flex justify-content-between" key={i}>
                                                ₹{cash.currency} × {cash.quantity}
                                                <strong>₹{(cash.currency * cash.quantity)?.toLocaleString()}</strong>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted">No opening cash details.</p>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Closing Bank */}
                        {selectedViewType === 'closing_bank' && (
                            <div className="col-md-12">
                                <h6 className="text-primary">Closing Bank Accounts</h6>
                                <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
                                    {selectedViewTypeBalance?.closing_bank_balance?.length > 0 ? (
                                        selectedViewTypeBalance.closing_bank_balance.map((bank, i) => (
                                            <div className="card mb-2" key={i}>
                                                <div className="card-body p-2">
                                                    <strong>{bank.bank_account.bank_name}</strong>
                                                    <p className="mb-1 small">A/C No: {bank.bank_account.account_number}</p>
                                                    <p className="mb-1 small">IFSC: {bank.bank_account.ifsc_code}</p>
                                                    <p className="mb-1 small">Holder: {bank.bank_account.account_name}</p>
                                                    <span className="badge bg-success">₹{bank.amount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No closing bank balance.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Closing Cash */}
                        {selectedViewType === 'closing_cash' && (
                            <div className="col-md-12">
                                <h6 className="text-warning">Closing Cash Details</h6>
                                <ul className="list-group" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                                    {selectedViewTypeBalance?.closing_cash_detail?.length > 0 ? (
                                        selectedViewTypeBalance.closing_cash_detail.map((cash, i) => (
                                            <li className="list-group-item d-flex justify-content-between" key={i}>
                                                ₹{cash.currency} × {cash.quantity}
                                                <strong>₹{(cash.currency * cash.quantity)?.toLocaleString()}</strong>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted">No closing cash details.</p>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>






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
                    {shopObj?.name && (
                        <li className="breadcrumb-item active" aria-current="page">
                            {shopObj?.name}
                        </li>
                    )}
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
                            <th>Earning</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && balances.length > 0 ? (
                            balances.map((balance, index) => {
                                const openingBankTotal = calculateTotalAmount(balance.opening_bank_balance || []);
                                const closingBankTotal = calculateTotalAmount(balance.closing_bank_balance || []);
                                const openingCashTotal = calculateCashTotal(balance.opening_cash_detail || []);
                                const closingCashTotal = calculateCashTotal(balance.closing_cash_detail || []);
                                const openingTotal = openingBankTotal + openingCashTotal;
                                const closingTotal = closingBankTotal + closingCashTotal;
                                const profit = closingTotal - openingTotal;

                                return (
                                    <tr key={index}>
                                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td>{balance.date}</td>
                                        {/* <td>₹{openingBankTotal.toLocaleString()}</td>
                                        <td>₹{openingCashTotal.toLocaleString()}</td>
                                        <td>₹{closingBankTotal.toLocaleString()}</td>
                                        <td>₹{closingCashTotal.toLocaleString()}</td> */}
                                        <td>
                                            ₹{openingBankTotal.toLocaleString()}
                                            <button
                                                className="btn btn-primary ms-2"
                                                onClick={() => handleViewTypeModal(balance, 'opening_bank')}
                                            >
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                        </td>
                                        <td>
                                            ₹{openingCashTotal.toLocaleString()}
                                            <button
                                                className="btn btn-secondary ms-2"
                                                onClick={() => handleViewTypeModal(balance, 'opening_cash')}
                                            >
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                        </td>
                                        <td>
                                            ₹{closingBankTotal.toLocaleString()}
                                            <button
                                                className="btn btn-primary ms-2"
                                                onClick={() => handleViewTypeModal(balance, 'closing_bank')}
                                            >
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                        </td>
                                        <td>
                                            ₹{closingCashTotal.toLocaleString()}
                                            <button
                                                className="btn btn-secondary ms-2"
                                                onClick={() => handleViewTypeModal(balance, 'closing_cash')}
                                            >
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                        </td>


                                        <td>
                                            <span className={`badge ${profit >= 0 ? 'bg-success' : 'bg-danger'}`}>
                                                ₹{profit.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-secondary" onClick={() => handleView(balance)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">No records found</td>
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
