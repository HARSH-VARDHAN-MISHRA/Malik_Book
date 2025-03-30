import React, { useState, useEffect, useRef } from "react";

const FilterTableColumns = ({ tableId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [columnNames, setColumnNames] = useState([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (tableId) {
      handleColumnVisibility(tableId);
    }
  }, [tableId]);

  const handleColumnVisibility = (tableId) => {
    const table = document.querySelector(`.${tableId}`);
    const columns = table.querySelectorAll("th");
    const initialColumns = {};
    const names = [];

    columns.forEach((column, index) => {
      const columnName = column.innerText.trim() || "Checkbox";
      names.push(columnName);
      const isVisible = column.style.display !== "none";
      initialColumns[index] = isVisible;
    });

    setColumnNames(names);
    setVisibleColumns(initialColumns);
  };

  const toggleColumnVisibility = (index) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAllColumnsVisibility = () => {
    const allVisible = Object.values(visibleColumns).every((value) => value);
    const newVisibility = {};
    for (let key in visibleColumns) {
      newVisibility[key] = !allVisible;
    }
    setVisibleColumns(newVisibility);
  };

  const applyChanges = () => {
    const table = document.querySelector(`.${tableId}`);
    if (table) {
      const columns = table.querySelectorAll("th");
      const rows = table.querySelectorAll("tr");
      columns.forEach((column, index) => {
        const isVisible = visibleColumns[index];
        column.style.display = isVisible ? "" : "none";
        rows.forEach((row) => {
          const cell = row.children[index];
          if (cell) {
            cell.style.display = isVisible ? "" : "none";
          }
        });
      });
    }
    setModalVisible(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "120%",
    left: "0",
    padding: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: "1000",
    width: "250px",
    borderRadius: "5px",
  };

  return (
    <>
      <div className="position-relative">
        <button
          ref={buttonRef}
          onClick={() => setModalVisible(!modalVisible)}
          className="table-adjust-btn"
        >
          <i class="fa-solid fa-chart-simple"></i> Adjust Columns
        </button>
        {modalVisible && (
          <div className="table-column-selection" style={modalStyle}>
            <h5>Select Columns</h5>
            <li style={{ listStyle: "none", margin: "7px 0" }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Object.values(visibleColumns).every((value) => value)}
                  onChange={toggleAllColumnsVisibility}
                  className="me-1"
                />
                <span >Select All</span>
              </label>
            </li>
            <div className="filter-options">
              <ul className="ps-0 mb-0">
                {columnNames.map((name, index) => (
                  <li
                    style={{ listStyle: "none", margin: "7px 0" }}
                    key={index}
                  >
                    <label style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        label={name}
                        checked={visibleColumns[index]}
                        onChange={() => toggleColumnVisibility(index)}
                        className="me-1"
                      />
                      <span >{name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="d-flex justify-content-end mt-2">
              <button
                onClick={() => setModalVisible(false)}
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button
                onClick={applyChanges}
                className="ms-2 btn btn-success"
              >
                Apply
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default FilterTableColumns;
