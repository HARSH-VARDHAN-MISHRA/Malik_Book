import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { toast } from "react-hot-toast";
import { GET_SHOP_USERS } from "../../../api";

function FilterByShopUsers({ selectedShopUsers, onSelect, id }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [tempSelectedShopUsers, setTempSelectedShopUsers] = useState([...selectedShopUsers]);
    const [loading, setLoading] = useState(false);
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    const fetchData = () => {
        setLoading(true);
        const headers = { Authorization: `${userDetails.token}` };
        const params = { shop_pk: id };

        axios
            .get(GET_SHOP_USERS, { params, headers })
            .then((res) => {
                if (res.data.status === 1) {


                    let usersList = res.data.data;

                    // Check if the current user is already in the list
                    const isCurrentUserInList = usersList.some(
                        (user) => user.id === userDetails.id
                    );

                    if (!isCurrentUserInList) {
                        usersList = [
                            {
                                id: userDetails.id,
                                name: userDetails.name,
                            },
                            ...usersList,
                        ];
                    }

                    setUsers(usersList);
                    setFilteredUsers(usersList);

                    // console.log(res.data.data)
                    // setUsers(res.data.data);
                    // setFilteredUsers(res.data.data);
                } else {
                    toast.error(res.data.message || "Failed to fetch users");
                }
            })
            .catch((err) => toast.error(err?.response?.data?.message || "Internal Server Error"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionChange = (userId) => {
        if (tempSelectedShopUsers.includes(userId)) {
            setTempSelectedShopUsers(tempSelectedShopUsers.filter((id) => id !== userId));
        } else {
            setTempSelectedShopUsers([...tempSelectedShopUsers, userId]);
        }
    };

    const handleClear = () => {
        setTempSelectedShopUsers([]);
        onSelect([]);
        setIsOpen(false);
    };

    const handleApply = () => {
        onSelect(tempSelectedShopUsers);
        setIsOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const getModalPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            return {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                zIndex: 9999,
            };
        }
        return {};
    };

    const modalContent = (
        <div className="filter-modal p-3 bg-white border rounded shadow" style={getModalPosition()} ref={modalRef}>
            <input
                className="form-control mb-2"
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="filter-options" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <ul className="ps-0 mb-0">
                    {loading ? (
                        <li>Loading...</li>
                    ) : (
                        filteredUsers.map((user) => (
                            <li key={user.id} style={{ listStyle: "none" }}>
                                <label style={{ cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={tempSelectedShopUsers.includes(user.id)}
                                        onChange={() => handleOptionChange(user.id)}
                                        className="me-2"
                                    />
                                    <span>{user.name}</span>
                                </label>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <div className="d-flex justify-content-end mt-3">
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
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                Users <i className="fa-solid fa-angle-down ms-2"></i>
            </div>
            {isOpen && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
}

export default FilterByShopUsers;
