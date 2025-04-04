import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { GET_CUSTOMERS, MAKE_PAYMENT, } from "../../../api";

const PayPaymentModal = ({ open, handleClose, shopPk , balance }) => {
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [loading, setLoading] = useState(false);

    const [remark, setRemark] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    console.log("balance : ",balance);

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCustomer) {
            toast.error("Please select a customer.")
            return;
        }

        const payload = {
            shop_pk: shopPk,
            customer_pk: parseInt(selectedCustomer.value),
            cash_denomination: [],
            payment_details: [],
            remark,
        };

        setLoading(true);
        try {

            console.log("Playload : ", payload);
            const res = await axios.post(MAKE_PAYMENT, payload, {
                headers: { Authorization: userDetails.token },
            });

            if (res.data.status === 1) {
                toast.success("Payment successful");
                // handleClose();
            } else {
                toast.error(res.data.message || "Payment failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment submission error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={open} onHide={!loading ? handleClose : null} centered size="lg">
            <Modal.Header closeButton={!loading}>
                <Modal.Title>
                    Make Payment

                </Modal.Title>


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
