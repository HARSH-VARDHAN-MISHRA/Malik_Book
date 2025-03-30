import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ADD_PRODUCT_TYPE, APIKEY } from '../../../../../api';
import toast from 'react-hot-toast';

function AddType({ show, handleClose, refreshTypes, setProductType }) {
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle the Add Type operation
  const handleAddType = () => {
    setLoading(true);
    const config = {
      headers: {
        "API-Key": APIKEY,
      }
    };
    axios.post(ADD_PRODUCT_TYPE, { product_type: typeName }, config)
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Type Added Successfully");
          const newTypeId = response.data.data.id;
          setProductType(newTypeId);
        }
        refreshTypes();
        handleClose();
        setTypeName('');
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Internal Server Error");
        console.error("Error while adding type:", error.response);
        setLoading(false);
      });
  };

  // Effect to handle key press events for 'Enter' and 'Esc'
  useEffect(() => {
    const handleKeyPress = (e) => {

      if (e.key === 'Escape') {
        handleClose(); // Close the modal on Esc key
        setTypeName('');
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
  }, [show, typeName]); // Run the effect when 'show' or 'typeName' changes

  return (
    show ? (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Type</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Type Name"
                value={typeName}
                autoFocus
                onChange={(e) => setTypeName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddType(); }}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleAddType} disabled={loading}>{loading ? 'Adding...' : 'Add Type'} </button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default AddType;
