import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { GET_SHOP_USERS, DELETE_USER, UPDATE_USER, ADD_USER } from "../../../api";

const ShopUsers = ({ open, handleClose, shopPk }) => {
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", password: "", is_active: true });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", email: "", password: "", is_active: true });

    const [deleteUserId, setDeleteUserId] = useState(null);

    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    };

    const fetchData = () => {
        setLoading(true);
        const headers = { Authorization: `${userDetails.token}` };
        const params = { shop_pk: shopPk };

        axios
            .get(`${GET_SHOP_USERS}`, { params, headers })
            .then((res) => {
                if (res.data.status === 1) {
                    setUsers(res.data.data);
                } else {
                    toast.error(res.data.message || "Failed to fetch users");
                }
            })
            .catch((err) => toast.error(err?.response?.data?.message || "Internal Server Error"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (open) fetchData();
    }, [open]);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            password: user.password,
            is_active: user.is_active,
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        const data = {
            user_pk: editingUser.id,
            ...editForm
        };

        axios
            .post(`${UPDATE_USER}`, data, {
                headers: { Authorization: `${userDetails.token}` },
            })
            .then(() => {
                toast.success("User updated successfully");
                setEditingUser(null);
                fetchData();
            })
            .catch((err) => toast.error(err?.response?.data?.message || "Update failed"))
            .finally(() => setSubmitLoading(false));
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        const data = {
            shop_pk: shopPk,
            ...addForm,
        };

        axios
            .post(`${ADD_USER}`, data, {
                headers: { Authorization: `${userDetails.token}` },
            })
            .then(() => {
                toast.success("User added successfully");
                setAddModalOpen(false);
                setAddForm({ name: "", email: "", password: "", is_active: true });
                fetchData();
            })
            .catch((err) => toast.error(err?.response?.data?.message || "Failed to add user"))
            .finally(() => setSubmitLoading(false));
    };

    const handleDeleteUser = () => {
        setDeleteLoading(true);
        const data = { user_pk: deleteUserId };
        axios
            .post(`${DELETE_USER}`, data, {
                headers: { Authorization: `${userDetails.token}` },
            })
            .then(() => {
                toast.success("User deleted successfully");
                setDeleteUserId(null);
                fetchData();
            })
            .catch((err) => toast.error(err?.response?.data?.message || "Error deleting user"))
            .finally(() => setDeleteLoading(false));
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Modal show={open} onHide={handleClose} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Shop Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="primary" className="text-nowrap" onClick={() => setAddModalOpen(true)}>
                            + Add
                        </Button>
                    </div>

                    <div style={{ height: "50vh", overflowY: "auto" }}>
                        {loading ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" />
                                <p className="mt-2">Loading users...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="d-flex align-items-center justify-content-between p-2 border rounded mb-2"
                                >
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle d-flex justify-content-center align-items-center text-white"
                                            style={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: stringToColor(user.name),
                                                fontSize: 14,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </div>
                                        <div className="ms-2">
                                            <strong>{user.name}</strong>
                                            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{user.email}</p>
                                            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                                                Password: {user.password}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column align-items-end">
                                        <span className={`badge mb-1 ${user.is_active ? "bg-success" : "bg-danger"}`}>
                                            {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                        <div>
                                            <Button variant="primary" size="sm" className="me-1"
                                                onClick={() => handleEditClick(user)}>
                                                <i className="fa fa-pen"></i>
                                            </Button>
                                            <Button variant="danger" size="sm"
                                                onClick={() => setDeleteUserId(user.id)}>
                                                <i className="fa fa-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-3">No users found for this shop.</p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="py-2">
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={!!editingUser} onHide={() => setEditingUser(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUpdateSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={editForm.name} autoFocus required
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={editForm.email} required
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" value={editForm.password} required
                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
                        </Form.Group>
                        <Form.Check
                            type="checkbox"
                            id="edit-active"
                            label="Active"
                            checked={editForm.is_active}
                            onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={submitLoading}>
                            {submitLoading ? <Spinner size="sm" animation="border" /> : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Add User Modal */}
            <Modal show={addModalOpen} onHide={() => setAddModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddUser}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={addForm.name} autoFocus required
                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={addForm.email} required
                                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" value={addForm.password} required
                                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
                        </Form.Group>
                        <Form.Check
                            type="checkbox"
                            id="add-active"
                            label="Active"
                            checked={addForm.is_active}
                            onChange={(e) => setAddForm({ ...addForm, is_active: e.target.checked })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="success" disabled={submitLoading}>
                            {submitLoading ? <Spinner size="sm" animation="border" /> : "Add User"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deleteUserId} onHide={() => setDeleteUserId(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteUserId(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteUser} disabled={deleteLoading}>
                        {deleteLoading ? <Spinner size="sm" animation="border" /> : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ShopUsers;
