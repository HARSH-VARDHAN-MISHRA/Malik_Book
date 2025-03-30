import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADD_PRODUCT_BRAND, APIKEY } from '../../../../../api';
import toast from 'react-hot-toast';

function AddBrand({ show, handleClose, refreshBrands , setProductBrand  }) {
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddBrand = () => {
    setLoading(true);  
    const config = {
      headers: {
        "API-Key": APIKEY,
      }
    };
    axios.post(ADD_PRODUCT_BRAND, { product_brand: brandName }, config)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Brand Added Successfully");
          const newBrandId = response.data.data.id; 
          setProductBrand(newBrandId);
        }
        refreshBrands();
        handleClose();
        setBrandName(''); 
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Internal Server Error");
        console.error("Error while adding brand:", error.response);
        setLoading(false);
      });
  };

  // Effect to handle key press events for 'Enter' and 'Escape'
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        handleClose(); 
        setBrandName(''); 
        setLoading(false);
      }
    };

    // Add event listener for keydown when modal is open
    if (show) {
      window.addEventListener('keydown', handleKeyPress);
    }

    // Cleanup event listener when the component is unmounted or modal is closed
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [show, brandName]); // Run the effect when 'show' or 'brandName' changes

  return (
    show ? (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Brand</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Brand Name"
                autoFocus
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && brandName) {
                    e.preventDefault();
                    handleAddBrand(); 
                  }
                }}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddBrand} disabled={loading}> {loading ? 'Adding...' : 'Add Brand'} </button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default AddBrand;
