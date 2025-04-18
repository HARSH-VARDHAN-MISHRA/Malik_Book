import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { GET_CUSTOMERS, ADD_SERVICE, GET_SERVICE_TYPES } from "../../../api";
import AddCustomerModal from "../Customer/AddCustomerModal";
import AddServiceModal from "./AddServiceModal";

const AddCustomerServiceModal = ({ open, handleClose, shopPk, balance, fetchData }) => {
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [loading, setLoading] = useState(false);
    const [remark, setRemark] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Service Types
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [serviceTypes, setServiceTypes] = useState([]);
    // Add Service Type Modal
    const [openAddServiceTypeModal, setOpenAddServiceTypeModal] = useState(false);

    const [cashInputs, setCashInputs] = useState({});
    const [bankInputs, setBankInputs] = useState({});
    const [totalCash, setTotalCash] = useState(0);
    const [totalBank, setTotalBank] = useState(0);


    const fetchServiceTypes = async () => {
        const headers = {
            Authorization: `${userDetails?.token}`,
        };
        try {
            const response = await axios.get(GET_SERVICE_TYPES, { headers });

            if (response.data.status === 1) {
                // console.log(response.data.data);
                setServiceTypes(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch Service Types");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        }
    }


    useEffect(() => {
        if (open) {
            fetchServiceTypes();
        }
    }, [open])


    const loadCustomerOptions = async (inputValue) => {
        try {
            const res = await axios.post(
                GET_CUSTOMERS,
                {
                    search: inputValue,
                    page_number: 1,
                    page_size: 50,
                },
                {
                    headers: { Authorization: userDetails.token },
                }
            );

            // console.log("customers : ", res.data.data)

            return res.data.data.map((cust) => ({
                ...cust,
                value: cust.id,
                label: `${cust.name} (${cust.phone})`,
            }));
        } catch (err) {
            toast.error("Failed to load customers");
            return [];
        }
    };

    // Cash Handler
    const handleCashChange = (id, value, maxQty) => {
        const qty = value === "" ? "" : parseInt(value) || 0;
        const updated = { ...cashInputs, [id]: qty };
        setCashInputs(updated);

        const total = balance.cash.reduce((sum, cash) => {
            const inputQty = updated[cash.id] || 0;
            return sum + (Number(inputQty) * cash.currency);
        }, 0);
        setTotalCash(total);
    };

    // Bank Handler
    const handleBankInputChange = (id, value) => {
        const val = value === "" ? "" : parseFloat(value) || 0;
        const updated = { ...bankInputs, [id]: val };
        setBankInputs(updated);

        const total = balance.bank_balance.reduce((sum, bank) => {
            const inputVal = updated[bank.id] || 0;
            return sum + Number(inputVal);
        }, 0);
        setTotalBank(total);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomer) {
            toast.error("Please select a customer.");
            return;
        }
        if (!selectedServiceType) {
            toast.error("Please select a service type.");
            return;
        }



        const cashDenomination = Object.entries(cashInputs)
            .filter(([id, qty]) => qty > 0)
            .map(([id, qty]) => ({
                cash_pk: parseInt(id),
                quantity: parseInt(qty),
            }));

        const paymentDetails = Object.entries(bankInputs)
            .filter(([id, amt]) => amt > 0)
            .map(([id, amt]) => ({
                bank_account_pk: parseInt(id),
                amount: parseFloat(amt),
            }));

        const payload = {
            shop_pk: shopPk,
            service_type_pk: parseInt(selectedServiceType),
            customer_pk: parseInt(selectedCustomer.value),
            cash_denomination: cashDenomination,
            payment_details: paymentDetails,
            note: remark,
        };

        // ✅ Validation: At least one cash or bank amount is required
        if (cashDenomination.length === 0 && paymentDetails.length === 0) {
            toast.error("Please enter at least one cash or bank amount.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(ADD_SERVICE, payload, {
                headers: { Authorization: userDetails.token },
            });

            if (res.data.status === 1) {
                toast.success("Service applied successfully!");
                fetchData();
                handleClose();
            } else {
                toast.error(res.data.message || "Service applied failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Service applied submission error");
        } finally {
            setLoading(false);
        }
    };


    // Add Customer Modal
    const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
    const handleOpenAddCustomerModal = () => {
        setOpenAddCustomerModal(true);
    };

    const handleCloseAddCustomerModal = () => {
        setOpenAddCustomerModal(false);
    };






    return (
        <>


            {openAddCustomerModal && (
                <AddCustomerModal
                    open={openAddCustomerModal}
                    handleClose={handleCloseAddCustomerModal}
                    setSelectedCustomer={setSelectedCustomer}
                />
            )}

            {openAddServiceTypeModal && (
                <AddServiceModal
                    open={openAddServiceTypeModal}
                    handleClose={() => setOpenAddServiceTypeModal(false)}
                    fetchData={fetchServiceTypes}
                    onSuccess={(newService) => {
                        setServiceTypes((prev) => [...prev, newService]);
                        setSelectedServiceType(newService.id); // Auto-select
                    }}
                />
            )}



            <Modal show={open} onHide={!loading ? handleClose : null} centered size="lg">
                <Modal.Header closeButton={!loading}>
                    <Modal.Title>Add Service</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {/* Select Customer */}
                        <div className="row align-items-end">
                            <div className="mb-2 col-md-9">
                                <label className="form-label">Select Customer</label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadCustomerOptions}
                                    defaultOptions
                                    onChange={setSelectedCustomer}
                                    value={selectedCustomer}
                                    isDisabled={loading}
                                    placeholder="Search customer..."
                                    formatOptionLabel={(option) => (
                                        <div>
                                            <div className="fw-medium small">{option.name} ({option.phone})</div>
                                            <div className="small ">
                                                {option.address && (
                                                    <span>
                                                        {option.address && <div> <i className="fas fa-map-marker-alt me-1"></i> {option.address}</div>}
                                                    </span>
                                                )}
                                                <i className="fas fa-money-bill-wave me-1"></i>
                                                Paid: ₹{option?.total_paid_amount?.toLocaleString()} |
                                                Received: ₹{option?.total_received_amount?.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                />

                            </div>
                            <div className="mb-2 col-md-3">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the click event from bubbling up
                                        handleOpenAddCustomerModal();
                                    }}
                                    className="btn btn-primary w-100"
                                >
                                    <i className="fa-solid fa-plus"></i> Add Customer
                                </button>

                            </div>

                        </div>
                        <div className="mb-3">
                            <label className="form-label">Select Service Type</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    value={selectedServiceType || ""}
                                    onChange={(e) => setSelectedServiceType(e.target.value)}
                                >
                                    <option value="">-- Select Service Type --</option>
                                    {serviceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.service_type}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setOpenAddServiceTypeModal(true)}
                                >
                                    <i className="fa fa-plus me-1"></i> Add
                                </button>
                            </div>
                        </div>





                        <div className="row">

                            <div className="col-xl-12">
                                <h5 className="text-center text-secondary">Add Service Charge</h5>
                            </div>

                            {/* Cash Section */}
                            <div className="col-xl-6">
                                <h6 className="mt-2">Cash Balances:</h6>
                                {balance.cash.length > 0 ? (
                                    <ul className="list-group mb-3">
                                        <div style={{ height: "40dvh", overflow: "auto" }}>
                                            {balance.cash.map((cash) => {
                                                const inputQty = Number(cashInputs[cash.id]) || 0;
                                                const totalForThisCash = inputQty * cash.currency;

                                                return (
                                                    <li
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                        key={cash.id}
                                                    >
                                                        <div className="w-75">
                                                            ₹{cash.currency}
                                                            {inputQty > 0 && (
                                                                <div className="text-success small">
                                                                    ➤ ₹{cash.currency} x {inputQty} = ₹{totalForThisCash.toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Form.Control
                                                            type="number"
                                                            min="0"
                                                            placeholder="Qty"
                                                            value={cashInputs[cash.id] ?? ""}
                                                            onChange={(e) =>
                                                                handleCashChange(cash.id, e.target.value, cash.quantity)
                                                            }
                                                            style={{ width: 100 }}
                                                            disabled={loading}
                                                        />
                                                    </li>
                                                );
                                            })}
                                        </div>
                                        <li className="list-group-item d-flex justify-content-between text-secondary fw-medium bg-light">
                                            <span>Total Cash:</span>
                                            <span>₹{totalCash.toLocaleString()}</span>
                                        </li>
                                    </ul>
                                ) : (
                                    <p className="text-muted">No cash denominations defined.</p>
                                )}
                            </div>

                            {/* Bank Section */}
                            <div className="col-xl-6">
                                <h6 className="mt-2">Bank Accounts:</h6>
                                <div style={{ height: "40dvh", overflow: "auto" }}>
                                    {balance.bank_balance.length > 0 ? (
                                        <>
                                            {balance.bank_balance.map((bank) => (
                                                <div className="card mb-3" key={bank.id}>
                                                    <div className="card-body d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 className="mb-1">{bank.bank_name}</h6>
                                                            <p className="mb-0 small">Account No: {bank.account_number}</p>
                                                            <p className="mb-0 small">IFSC: {bank.ifsc_code}</p>
                                                            <p className="mb-0 small">Holder Name: {bank.account_name}</p>
                                                        </div>
                                                        <Form.Control
                                                            type="number"
                                                            className="ms-3"
                                                            placeholder="Amount"
                                                            min="0"
                                                            value={bankInputs[bank.id] ?? ""}
                                                            onChange={(e) => handleBankInputChange(bank.id, e.target.value, bank.balance)}
                                                            style={{ width: 120 }}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <p className="text-muted">No bank accounts available.</p>
                                    )}
                                </div>
                                <ul className="list-group">
                                    <li></li>
                                    <li className="list-group-item d-flex justify-content-between text-secondary fw-medium bg-light">
                                        <span>Total Amount:</span>
                                        <span>₹{totalBank.toLocaleString()}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Grand Total */}
                            <div className="col-12 mt-1">
                                <div className="d-flex justify-content-between border-top pt-1 fw-medium  fs-5">
                                    <span>Grand Total:</span>
                                    <span className="text-danger">₹{(totalCash + totalBank).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>


                        {/* Remark */}
                        <div className="mb-3">
                            <label className="form-label">Remark</label>
                            <textarea
                                rows={2}
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className="form-control"
                                placeholder="Enter remark"
                                disabled={loading}
                            />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Add Service"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default AddCustomerServiceModal;
