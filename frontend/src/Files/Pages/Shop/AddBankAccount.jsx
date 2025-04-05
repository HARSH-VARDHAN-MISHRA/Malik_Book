import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { ADD_BANK_ACCOUNT } from "../../../api"; // update path if needed

const AddBankAccount = ({ open, handleClose, shopPk, balance, fetchShopDetail, fetchData }) => {
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [formData, setFormData] = useState({
        shop_pk: shopPk,
        bank_name: "",
        account_name: "",
        account_number: "",
        ifsc_code: "",
        balance: balance || 0.0,
    });

    const [loading, setLoading] = useState(false);
    const bankNameRef = useRef(null);


    useEffect(() => {
        if (open) {
            setTimeout(() => {
                bankNameRef.current?.focus();
            }, 200); // small delay ensures modal is fully rendered
        }
    }, [open]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            headers: {
                Authorization: `${userDetails.token}`,
            },
        };

        try {
            const response = await axios.post(ADD_BANK_ACCOUNT, formData, config);
            if (response.data.status === 1) {
                toast.success("Bank account added successfully!");
                handleClose();
                fetchShopDetail();
                fetchData();
            } else {
                toast.error(response.data.message || "Failed to add bank account");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
            console.error("Error while adding bank account:", error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={open} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Bank Account</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="bank_name"
                            value={formData.bank_name}
                            onChange={handleChange}
                            placeholder="Enter bank name"
                            required
                            ref={bankNameRef}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Account Holder Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="account_name"
                            value={formData.account_name}
                            onChange={handleChange}
                            placeholder="Enter account holder name"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Account Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="account_number"
                            value={formData.account_number}
                            onChange={handleChange}
                            placeholder="Enter account number"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>IFSC Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="ifsc_code"
                            value={formData.ifsc_code}
                            onChange={handleChange}
                            placeholder="Enter IFSC code"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control
                            type="number"
                            name="balance"
                            value={formData.balance}
                            onChange={handleChange}
                            placeholder="Enter balance"
                            step="0.01"
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" /> Saving...
                            </>
                        ) : (
                            "Add Bank Account"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddBankAccount;
