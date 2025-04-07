import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col, InputGroup, } from "react-bootstrap";
import axios from "axios";
import { ADD_CUSTOMER } from "../../../api";
import toast from "react-hot-toast";

function AddCustomerModal({ open, handleClose, setSelectedCustomer = () => { }, }) {

    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));
    const [customerDetails, setCustomerDetails] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the state with the new value for the changed field
        setCustomerDetails((prevDetails) => {
            // Create a new object for updated details
            const updatedDetails = {
                ...prevDetails,
                [name]: value,
            };


            // Return the updated state object
            return updatedDetails;
        });
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
            const response = await axios.post(ADD_CUSTOMER, customerDetails, config);
            if (response.data.status === 1) {
                if (setSelectedCustomer) {
                    setSelectedCustomer(response.data.customer);
                }
                // console.log("response.data  :",response.data);
                const newCustomer = response.data.data;
                setSelectedCustomer({
                    ...newCustomer,
                    value: newCustomer.id,
                    label: `${newCustomer.name} (${newCustomer.phone})`,
                });

                toast.success("Customer Added Successfully");
                setCustomerDetails({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                });
                handleClose();
            } else {
                toast.error(response.data.message || "Failed to add customer");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
            console.error("Error while adding customer:", error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={open}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Customer</Modal.Title>
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
                                <Form.Group controlId="formFirstName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={customerDetails.name}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        required
                                        autoFocus
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formContactNumber">
                                    <Form.Label>Contact Number</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={customerDetails.phone}
                                            onChange={handleChange}
                                            placeholder="Enter contact number"
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
                                        placeholder="Enter email"
                                    />
                                </Form.Group>
                            </Col>



                            <Col md={12}>
                                <Form.Group controlId="formAddress1">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={customerDetails.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="py-1">
                    <Button
                        variant="danger"
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Customer"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddCustomerModal;