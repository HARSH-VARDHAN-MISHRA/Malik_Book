import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import {
    GET_BANK_ACCOUNTS,
    GET_CURRENCIES,
    GET_CUSTOMERS,
    MAKE_PAYMENT,
} from "../../../api";

const PayPaymentModal = ({ open, handleClose, shopPk }) => {
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [cashDenominations, setCashDenominations] = useState([]);
    const [remark, setRemark] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [bankPayments, setBankPayments] = useState([
        { bankId: "", amount: "" }
    ]);

    useEffect(() => {
        if (open) {
            fetchCurrencies();
            fetchBankAccounts();
        }
    }, [open]);

    const fetchCurrencies = async () => {
        try {
            const res = await axios.get(GET_CURRENCIES, {
                headers: { Authorization: userDetails.token },
            });
            if (res.data.status === 1) {
                setCurrencies(res.data.data);
                setCashDenominations(res.data.data.map((item) => ({
                    id: item.id,
                    currency: item.currency,
                    quantity: 0,
                })));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch currencies");
        }
    };

    const fetchBankAccounts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(GET_BANK_ACCOUNTS, {
                params: { shop_pk: shopPk },
                headers: { Authorization: userDetails.token },
            });
            if (res.data.status === 1) {
                // console.log(res.data.data);
                setBankAccounts(res.data.data);
            } else {
                toast.error(res.data.message || "Failed to fetch bank accounts");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch bank accounts");
        } finally {
            setLoading(false);
        }
    };

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

            return res.data.data.map((cust) => ({
                value: cust.id,
                label: `${cust.name} (${cust.phone})`,
            }));
        } catch (err) {
            toast.error("Failed to load customers");
            return [];
        }
    };

    const handleCashQtyChange = (id, value) => {
        setCashDenominations((prev) =>
            prev.map((den) =>
                den.id === id ? { ...den, quantity: parseInt(value || 0) } : den
            )
        );
    };

    const handleBankChange = (uid, field, value) => {
        const updated = bankPayments.map(payment => {
            if (payment.uid === uid) {
                return { ...payment, [field]: value };
            }
            return payment;
        });
        setBankPayments(updated);
    };
    
    const removeBankPayment = (uid) => {
        const updated = bankPayments.filter(payment => payment.uid !== uid);
        setBankPayments(updated);
    };
    

    const addBankPayment = () => {
        const selectedBankIds = bankPayments.map(p => p.bankId).filter(Boolean);
        const remainingBanks = bankAccounts.filter(bank => !selectedBankIds.includes(String(bank.id)));

        // Only add if there’s at least one remaining bank
        if (remainingBanks.length > 0) {
            setBankPayments((prev) => [
                ...prev,
                { id: "", bankId: "", amount: "" }
            ]);
        }
    };


    console.log("bankPayments : ",bankPayments);
    const calculateTotal = () => {
        const cashTotal = cashDenominations.reduce((sum, d) => sum + (d.quantity || 0) * parseFloat(d.currency), 0);
        const bankTotal = bankPayments.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
        return { cashTotal, bankTotal, grandTotal: cashTotal + bankTotal };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomer || (cashDenominations.every(d => !d.quantity) && bankPayments.every(b => !b.amount))) {
            toast.error("Please provide at least one payment (cash or bank).");
            return;
        }

        const payload = {
            shop_pk: shopPk,
            customer_pk: parseInt(selectedCustomer.value),
            cash_denomination: cashDenominations
                .filter((den) => den.quantity > 0)
                .map((den) => ({
                    cash_pk: den.id,
                    quantity: den.quantity
                })),
            payment_details: bankPayments
                .filter((b) => b.bankId && b.amount)
                .map((b) => ({
                    bank_account_pk: parseInt(b.bankId),
                    amount: parseFloat(b.amount)
                })),
            remark,
        };

        setLoading(true);
        try {
            const res = await axios.post(MAKE_PAYMENT, payload, {
                headers: { Authorization: userDetails.token },
            });

            if (res.data.status === 1) {
                toast.success("Payment successful");
                handleClose();
            } else {
                toast.error(res.data.message || "Payment failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment submission error");
        } finally {
            setLoading(false);
        }
    };

    const { cashTotal, bankTotal, grandTotal } = calculateTotal();

    return (
        <Modal show={open} onHide={!loading ? handleClose : null} centered size="lg">
            <Modal.Header closeButton={!loading}>
                <Modal.Title>Make Payment</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {/* Customer Selection */}
                    <div className="mb-3">
                        <label className="form-label">Select Customer</label>
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadCustomerOptions}
                            defaultOptions
                            onChange={setSelectedCustomer}
                            value={selectedCustomer}
                            isDisabled={loading}
                            placeholder="Search customer..."
                        />
                    </div>

                    {/* Cash */}
                    <hr />
                    <h5>Cash Denominations <span className="fs-6 text-success">(₹{cashTotal.toFixed(2)})</span> </h5>
                    <div className="row">
                        {cashDenominations.map((den) => (
                            <div key={den.id} className="col-md-2 col-6 mb-3">
                                <label className="form-label">{den.currency} x</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={den.quantity}
                                    onChange={(e) =>
                                        handleCashQtyChange(den.id, e.target.value)
                                    }
                                    placeholder="Qty"
                                    className="form-control"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Bank Payments */}
                    <hr />
                    <h5>Bank Payments <span className="fs-6 text-success">(₹{bankTotal.toFixed(2)})</span></h5>

                    {bankPayments.map((payment) => {
    const selectedBankIds = bankPayments
        .filter((p) => p.uid !== payment.uid && p.bankId)
        .map((p) => String(p.bankId));

    const availableBankOptions = bankAccounts.map((bank) => ({
        ...bank,
        disabled: selectedBankIds.includes(String(bank.id))
    }));

    return (
        <div key={payment.uid} className="row align-items-end">
            <div className="col-md-6 mb-3">
                <label className="form-label">Select Bank</label>
                <select
                    value={payment.bankId}
                    onChange={(e) =>
                        handleBankChange(payment.uid, "bankId", e.target.value)
                    }
                    className="form-select"
                >
                    <option value="">Select</option>
                    {availableBankOptions.map((bank) => (
                        <option
                            key={bank.id}
                            value={bank.id}
                            disabled={
                                bank.disabled &&
                                String(bank.id) !== String(payment.bankId)
                            }
                        >
                            {bank.bank_name} - {bank.account_number}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Amount</label>
                <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) =>
                        handleBankChange(payment.uid, "amount", e.target.value)
                    }
                    placeholder="Amount"
                    className="form-control"
                />
            </div>
            <div className="col-md-2 mb-3">
                <Button
                    variant="danger"
                    onClick={() => removeBankPayment(payment.uid)}
                    disabled={bankPayments.length === 1}
                >
                    Remove
                </Button>
            </div>
        </div>
    );
})}




                    {bankAccounts.length > bankPayments.length && (
                        <div className="text-end">
                            <Button variant="primary" onClick={addBankPayment}>
                                Add Bank Payment
                            </Button>
                        </div>
                    )}


                    {/* Remark */}
                    <div className="mt-4">
                        <label className="form-label">Remark</label>
                        <textarea
                            rows={2}
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className="form-control"
                            placeholder="Enter remark"
                        />
                    </div>

                    {/* Grand Total */}
                    <div className="mt-4 bg-light p-3 rounded">
                        <h6>Cash Total: ₹{cashTotal.toFixed(2)}</h6>
                        <h6>Bank Total: ₹{bankTotal.toFixed(2)}</h6>
                        <h5 className="fw-bold">Grand Total: ₹{grandTotal.toFixed(2)}</h5>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="success" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : "Make Payment"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PayPaymentModal;
