import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { toast } from "react-hot-toast";
import { GET_CUSTOMERS } from "../../../api";

function FilterByCustomers({ selectedCustomers, onSelect }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [tempSelectedCustomers, setTempSelectedCustomers] = useState([...selectedCustomers]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));


    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    // Fetch customers data
    const fetchData = (page = currentPage, query = searchTerm) => {
        setLoading(true);
        const data = {
            search: query,
            page_number: page,
            page_size: 25,
        };
        const headers = {
            Authorization: `${userDetails.token}`,
        };
        axios
            .post(GET_CUSTOMERS, data, { headers })
            .then((response) => {
                setCustomers(response.data.data);
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
    }, [searchTerm, currentPage]);

    // Close modal if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionChange = (customerId) => {
        if (tempSelectedCustomers.includes(customerId)) {
            setTempSelectedCustomers(tempSelectedCustomers.filter((id) => id !== customerId));
        } else {
            setTempSelectedCustomers([...tempSelectedCustomers, customerId]);
        }
    };

    const handleClear = () => {
        setTempSelectedCustomers([]);
        onSelect([]);
        setIsOpen(false); // Close the modal when clear is clicked
    };

    const handleApply = () => {
        onSelect(tempSelectedCustomers);
        setIsOpen(false); // Close modal after apply
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search term change
    };

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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="filter-options">
                <ul className="ps-0 mb-0">
                    {loading ? (
                        <li>Loading...</li>
                    ) : (
                        customers.map((customer) => (
                            <li key={customer.id} style={{ listStyle: "none" }}>
                                <label style={{ cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={tempSelectedCustomers.includes(customer.id)}
                                        onChange={() => handleOptionChange(customer.id)}
                                        className="me-2"
                                    />
                                    <span>
                                        {customer.name}
                                    </span>
                                </label>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-danger" onClick={handleClear}>
                    Clear
                </button>
                <button className="ms-2 btn btn-success" onClick={handleApply}>
                    Apply
                </button>
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
                Customers <i className="fa-solid fa-angle-down"></i>
            </div>
            {isOpen && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
}

export default FilterByCustomers;