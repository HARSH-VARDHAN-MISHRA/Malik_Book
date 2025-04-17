import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import { ADD_SERVICE_TYPE } from "../../../api";

const AddServiceModal = ({ open, handleClose, fetchData , onSuccess  }) => {
    const [serviceType, setServiceType] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serviceType.trim()) {
            toast.error("Please enter a service type");
            return;
        }

        setLoading(true);
        const headers = {
            Authorization: `${userDetails?.token}`,
        };

        try {
            const response = await axios.post(
                ADD_SERVICE_TYPE,
                { service_type: serviceType },
                { headers }
            );

            if (response.data.status === 1) {
                toast.success("Service added successfully!");
                if (fetchData) fetchData();
                if (onSuccess) { onSuccess(response.data.service_type) }; // Send back the new service
                handleClose();
            } else {
                toast.error(response.data.message || "Failed to add service");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);
    

    return (
        <Modal className='dimmed' show={open} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Service</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Service Type</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter service type (e.g., Passport Apply)"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            ref={inputRef}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Service"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddServiceModal;
