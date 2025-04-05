import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { ADD_SHOP } from "../../../api";

const AddShopModal = ({ open, handleClose , getAllShops }) => {
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const [formData, setFormData] = useState({
        name: "",
        contact_number: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);

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
            const response = await axios.post(ADD_SHOP, formData, config);
            if (response.data.status === 1) {
                toast.success("Shop added successfully!");
                handleClose();
                getAllShops();
                setFormData({ name: "", contact_number: "", address: "" });
            } else {
                toast.error(response.data.message || "Failed to add shop");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
            console.error("Error while adding shop:", error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={open} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Shop</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Shop Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter shop name"
                            required
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            rows={3}
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
                            "Add Shop"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddShopModal;
