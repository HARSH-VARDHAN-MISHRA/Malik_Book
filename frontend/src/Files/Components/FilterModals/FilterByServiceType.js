import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { toast } from "react-hot-toast";
import { GET_SERVICE_TYPES } from "../../../api";

function FilterByServiceType({ selectedServiceTypes, onSelect }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [tempSelectedTypes, setTempSelectedTypes] = useState([...selectedServiceTypes]);
    const [loading, setLoading] = useState(false);
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    const fetchServiceTypes = async () => {
        const headers = {
            Authorization: `${userDetails?.token}`,
        };
        try {
            setLoading(true);
            const response = await axios.get(GET_SERVICE_TYPES, { headers });
            if (response.data.status === 1) {
                setServiceTypes(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch Service Types");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceTypes();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionChange = (typeId) => {
        if (tempSelectedTypes.includes(typeId)) {
            setTempSelectedTypes(tempSelectedTypes.filter((id) => id !== typeId));
        } else {
            setTempSelectedTypes([...tempSelectedTypes, typeId]);
        }
    };

    const handleClear = () => {
        setTempSelectedTypes([]);
        onSelect([]);
        setIsOpen(false);
    };

    const handleApply = () => {
        onSelect(tempSelectedTypes);
        setIsOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredServiceTypes = serviceTypes.filter(type =>
        type.service_type.toLowerCase().includes(searchTerm)
    );

    const getModalPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            return {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            };
        }
        return {};
    };

    const modalContent = (
        <div className="filter-modal" style={getModalPosition()} ref={modalRef}>
            <input
                className="form-control mb-2"
                type="text"
                placeholder="Search service types..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="filter-options">
                <ul className="ps-0 mb-0">
                    {loading ? (
                        <li>Loading...</li>
                    ) : (
                        filteredServiceTypes.map((type) => (
                            <li key={type.id} style={{ listStyle: "none" }}>
                                <label style={{ cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={tempSelectedTypes.includes(type.id)}
                                        onChange={() => handleOptionChange(type.id)}
                                        className="me-2"
                                    />
                                    <span>{type.service_type}</span>
                                </label>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-danger" onClick={handleClear}>Clear</button>
                <button className="ms-2 btn btn-success" onClick={handleApply}>Apply</button>
            </div>
        </div>
    );

    return (
        <div>
            <div
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
                Service Type <i className="fa-solid fa-angle-down"></i>
            </div>
            {isOpen && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
}

export default FilterByServiceType;
