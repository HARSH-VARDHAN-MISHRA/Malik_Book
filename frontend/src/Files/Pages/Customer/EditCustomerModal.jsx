import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col, InputGroup } from "react-bootstrap";
import axios from "axios";
import { UPDATE_CUSTOMER } from "../../../api";
import toast from "react-hot-toast";

function EditCustomerModal({ open, handleClose, selectedCustomer, fetchData }) {
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [customerDetails, setCustomerDetails] = useState({
        customer_pk: '',
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedCustomer) {
            setCustomerDetails({
                customer_pk: selectedCustomer.id || "",
                name: selectedCustomer.name || "",
                phone: selectedCustomer.phone || "",
                email: selectedCustomer.email || "",
                address: selectedCustomer.address || "",
            });
        }
    }, [selectedCustomer]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = {
            headers: { Authorization: `${userDetails.token}` },
        };

        try {
            const response = await axios.post(`${UPDATE_CUSTOMER}`, customerDetails, config);
            if (response.data.status === 1) {
                toast.success("Customer Updated Successfully");
                handleClose();
                fetchData();
            } else {
                toast.error(response.data.message || "Failed to update customer");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
            console.error("Error while updating customer:", error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={open} size="lg" onHide={!loading ? handleClose : null} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Customer</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={customerDetails.name}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>Contact Number</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={customerDetails.phone}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={customerDetails.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={customerDetails.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Customer"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EditCustomerModal;
