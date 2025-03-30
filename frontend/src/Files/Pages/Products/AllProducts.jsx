import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { FETCH_ALL_PRODUCTS, APIKEY } from "../../../api";
import { Link, useNavigate } from "react-router-dom";
import FilterTableColumns from "../../Components/TableFilter/FilterTableColumns";
import FilterSelectionModal from "../../Components/FilterModals/FilterSelectionModal";
import { formatRupees } from '../../Components/Utils/Currency';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [searchquery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const debouncedFetchData = useCallback(
    debounce((page, query) => {
      fetchData(page, query);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPageSize(25);
    setCurrentPage(1);
    debouncedFetchData(1, query);
  };

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    pageSize,
    searchquery,
    // selectedBrands,
    // selectedTypes,
    // selectedStocks,
  ]);

  const fetchData = (page = currentPage, query = searchquery) => {
    const data = {
      search: query,
      page_number: page,
      page_size: 25,
    };
    const headers = {
      "Content-Type": "application/json",
      "API-Key": APIKEY,
    };

    axios
      .post(FETCH_ALL_PRODUCTS, data, { headers })
      .then((response) => {
        console.log(response.data.data);
        setProducts(response.data.data);
        // setTotalPages(response.data.num_pages);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
          <i
              className="fa-solid fa-arrow-left"
              onClick={() => navigate(`/dashboard/`)}
            ></i>{" "}
            <Link to={`/dashboard/`}>Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
           Products
          </li>
        </ol>
      </nav>

      <div className="top-content mb-2">
      <div className="row">
        <div className="col-md-4">
          <div className="input-group">
            <label className="input-group-text">
              <i className="fa-solid fa-magnifying-glass"></i>
            </label>
            <input
              type="search"
              className="form-control"
              placeholder="Search Products ..."
            />
          </div>
        </div>
        <div className="col-md-8">
          <div className="top-content-btns">
            {/* <FilterTableColumns tableId="allproduct" /> */}
            <button className="btn btn-primary add-btn">
              <i className="fa-solid fa-plus"></i> Add Product
            </button>
            <button className="btn btn-primary upload-btn">
              <i className="fa-solid fa-upload"></i> Export
            </button>
            <button className="btn btn-primary import-btn">
              <i className="fa-solid fa-file-import"></i> Import
            </button>
            <button className="btn btn-primary history-btn">
              <i className="fa-solid fa-clock-rotate-left"></i> History
            </button>
            <button className="btn btn-danger delete-btn">
              <i className="fa-solid fa-trash"></i> Delete All
            </button>
          </div>
        </div>
      </div>
      </div>

    

      <section className="main-table">
        <table className="table table-bordered allproduct">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>SKU</th>
              <th>Product</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </section>
    </>
  );
}

export default AllProducts;
