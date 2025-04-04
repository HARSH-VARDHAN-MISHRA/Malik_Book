
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function FilterSelectionModal({ title, options, selectedOptions, onSelect , searchable = true , selectableAll = true }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    // const [tempSelectedOptions, setTempSelectedOptions] = useState([
    //     ...selectedOptions,
    // ]);
    const [tempSelectedOptions, setTempSelectedOptions] = useState([
        ...(selectedOptions && Array.isArray(selectedOptions) ? selectedOptions : []),
      ]);
      
    const buttonRef = useRef(null);
    const modalRef = useRef(null); // Ref for the modal container

    useEffect(() => {
        setTempSelectedOptions([
            // ...selectedOptions
            ...(selectedOptions && Array.isArray(selectedOptions) ? selectedOptions : []),
        ]);
    }, [selectedOptions]);

    useEffect(() => {
        // Close the modal if a click outside is detected
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectAll = () => {
        if (tempSelectedOptions.length === options.length) {
            setTempSelectedOptions([]);
        } else {
            setTempSelectedOptions(options.map((option) => option.label));
        }
    };

    const handleOptionChange = (optionLabel) => {
        if (tempSelectedOptions.includes(optionLabel)) {
            setTempSelectedOptions(
                tempSelectedOptions.filter((label) => label !== optionLabel)
            );
        } else {
            setTempSelectedOptions([...tempSelectedOptions, optionLabel]);
        }
    };

    const handleClear = () => {
        setTempSelectedOptions([]);
        onSelect([]);
        setIsOpen(false);
    };

    const handleApply = () => {
        onSelect(tempSelectedOptions);
        setIsOpen(false);
    };

    const handleToggleOpen = () => {
        setIsOpen(!isOpen);
    };

    // const filteredOptions = options.filter(
    //     (option) =>
    //         option.label &&
    //         option.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredOptions = options.filter(
        (option) =>
          option.label !== null && option.label !== undefined &&
          option.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

            {searchable && (
                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder={`Search ${title}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            )}

            {selectableAll && (
                <div>
                    <input
                        type="checkbox"
                        id="selectAll"
                        checked={tempSelectedOptions.length === options.length}
                        onChange={handleSelectAll}
                    />
                    <label htmlFor="selectAll">Select All</label>
                </div>

            )}
            <div className="filter-options">

                <ul className="ps-0 mb-0">
                    {filteredOptions.map((option, index) => (
                        <li
                            style={{ listStyle: "none"}}
                            key={index}
                        >
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={tempSelectedOptions.includes(option.label)}
                                    onChange={() => handleOptionChange(option.label)}
                                    className="me-2"
                                />
                                <span >{option.value}</span>
                            </label>
                        </li>
                    ))}
                </ul>

            </div>
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-danger" onClick={handleClear}>
                    Clear
                </button>
                <button
                    className="ms-2 btn btn-success"
                    onClick={handleApply}
                >
                    Apply
                </button>
            </div>
        </div>
    );

    return (
        <div ref={buttonRef}>
            <div
                onClick={handleToggleOpen}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
                {title} <i className="fa-solid fa-angle-down"></i>
            </div>
            {isOpen && ReactDOM.createPortal(modalContent, document.body)}
        </div>
    );
}

export default FilterSelectionModal;
