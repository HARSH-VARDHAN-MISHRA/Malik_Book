import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DELETE_CUSTOMER, GET_CUSTOMERS } from '../../../api';
import { Modal, Button } from "react-bootstrap";
import Loader from '../../Components/Loader/Loader';
import Pagination from '../../Components/Pagination/Pagination';
import toast from "react-hot-toast";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";

const AllCustomer = () => {

    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [searchquery, setSearchQuery] = useState("");
    const userDetails = JSON.parse(localStorage.getItem("malik_book_user"));

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setCurrentPage(1);
        fetchData(1, query);
    };

    // Handle page change for pagination
    const handlePageChange = (activePage) => {
        setCurrentPage(activePage);
        fetchData(activePage, searchquery);
    };

    // Handle page size change (items per page)
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when page size changes
        fetchData(1, searchquery); // Fetch data for the first page with updated page size
    };

    // Fetch customers data based on pagination and search
    const fetchData = (page = currentPage, query = searchquery) => {
        setLoadingMsg("Fetching Customers from Database!")
        const data = {
            search: query,
            page_number: page,
            page_size: pageSize,
        };
        const headers = {
            Authorization: `${userDetails.token}`,
        };


        axios
            .post(GET_CUSTOMERS, data, { headers })
            .then((response) => {
                // console.log(response.data.customers);
                setCustomers(response.data.data);
                setTotalPages(response.data.total_pages);
                setTotalRows(response.data.total_rows);
                setLoading(false);
                setLoadingMsg("")
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Internal Server Error");
                setLoading(false);
                setLoadingMsg("")
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchquery]);


    // Add Customer Modal
    const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
    const handleOpenAddCustomerModal = () => {
        setOpenAddCustomerModal(true);
    };

    const handleCloseAddCustomerModal = () => {
        setOpenAddCustomerModal(false);
        fetchData()
    };

    // Edit Customer
    const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleOpenEditCustomerModal = (customer) => {
        setSelectedCustomer(customer);
        setOpenEditCustomerModal(true);
    };

    const handleCloseEditCustomerModal = () => {
        setOpenEditCustomerModal(false);
        fetchData();
    };


    // Delete Customer
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    // Open the delete confirmation modal
    const handleDeleteCustomerModal = (customer) => {
        setSelectedCustomer(customer);
        setShowDeleteModal(true);
    };

    // Delete customer function
    const handleDeleteCustomer = async () => {
        if (!selectedCustomer) return;
        setButtonLoading(true);

        const config = {
            headers: { Authorization: `${userDetails.token}` },
        };

        try {
            const response = await axios.delete(`${DELETE_CUSTOMER}`, {
                headers: config.headers,
                data: { customer_pk: selectedCustomer.id },
            });
            if (response.data.status === 1) {
                toast.success("Customer Deleted Successfully");
                fetchData(); // Refresh customer list
                setShowDeleteModal(false);
            } else {
                toast.error(response.data.message || "Failed to delete customer");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
            console.error("Error while deleting customer:", error.response);
        } finally {
            setButtonLoading(false);
        }
    };


    return (
        <>

            {loading && <Loader message={loadingMsg} />}

            {openAddCustomerModal && (
                <AddCustomerModal
                    open={openAddCustomerModal}
                    handleClose={handleCloseAddCustomerModal}
                />
            )}

            {openEditCustomerModal && (
                <EditCustomerModal
                    open={openEditCustomerModal}
                    handleClose={handleCloseEditCustomerModal}
                    selectedCustomer={selectedCustomer}
                    fetchData={fetchData}
                />
            )}


            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={!buttonLoading ? () => setShowDeleteModal(false) : null} centered>
                <Modal.Header closeButton={!buttonLoading}>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {buttonLoading ? (
                        <div className="d-flex justify-content-center">
                            <span className="spinner-border"></span>
                        </div>
                    ) : (
                        <p>Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={!buttonLoading ? () => setShowDeleteModal(false) : null} disabled={buttonLoading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCustomer} disabled={buttonLoading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>



            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <i
                            className="fa-solid fa-arrow-left"
                            onClick={() => {
                                if (window.history.length > 1) {
                                    navigate(-1);
                                } else {
                                    navigate(`/dashboard/`);
                                }
                            }}
                        ></i>{" "}
                        <Link to={`/`}>Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        All Customers
                    </li>
                </ol>
            </nav>


            <div className="top-content mb-2">
                <div className="row">
                    <div className="col-xl-4">
                        <div className="input-group">
                            <label className="input-group-text">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </label>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search Customers ..."
                                value={searchquery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="top-content-btns">
                            <button
                                onClick={() => handleOpenAddCustomerModal()}
                                className="btn btn-primary add-btn"
                            >
                                <i className="fa-solid fa-plus"></i> Add Customer
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <section className="main-table">
                <table className="table table-bordered allcustomer">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {loading ? (
                            <tr>
                                <td className="text-center loading-table" colSpan={10}>Loading..</td>
                            </tr>
                        ) : (
                            customers && customers.map((customer) => (
                                <tr key={customer.id}>

                                    <td>{customer.id}</td>
                                    <td>
                                        <Link to={`/customer-detail/${customer.id}`}>
                                            {customer.name}
                                        </Link>
                                    </td>
                                    <td>{customer.phone || "-"}</td>
                                    <td>{customer.email || "-"}</td>
                                    <td>{customer.address || "-"}</td>
                                    <td className="actions">
                                        <button className="btn btn-primary" onClick={() => handleOpenEditCustomerModal(customer)}>
                                            <i className="fa-solid fa-edit"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteCustomerModal(customer)} >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </section>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
            />
        </>
    )
}

export default AllCustomer