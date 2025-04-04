import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DateRangePicker, defaultStaticRanges, createStaticRanges, } from "react-date-range";
import { format, subMonths, startOfYear, endOfYear, subYears, subDays, addDays } from "date-fns";




function FilterDateRangeModal({ title, startDate, endDate, onDateChange }) {

    const defaultStartDate = startDate || subMonths(new Date(), 1); // One month ago
    const defaultEndDate = endDate || new Date(); // Today


    const [isOpen, setIsOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(defaultStartDate);
    const [tempEndDate, setTempEndDate] = useState(defaultEndDate);
    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        // Update tempStartDate and tempEndDate only if they are defined
        if (startDate) {
          setTempStartDate(startDate);
        } else {
          setTempStartDate(subMonths(new Date(), 1)); // Fallback to one month ago
        }
    
        if (endDate) {
          setTempEndDate(endDate);
        } else {
          setTempEndDate(new Date()); // Fallback to today
        }
      }, [startDate, endDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleApply = () => {
        // const adjustedStartDate = subDays(tempStartDate, 1);
        // const adjustedEndDate = addDays(tempEndDate, 1);
        const adjustedStartDate = tempStartDate;
        const adjustedEndDate = tempEndDate;
        const formattedStartDate = format(adjustedStartDate, "yyyy-MM-dd");
        const formattedEndDate = format(adjustedEndDate, "yyyy-MM-dd");
        onDateChange(formattedStartDate, formattedEndDate);
        setIsOpen(false);
    };

    // const handleClear = () => {
    //     onDateChange(null, null);
    //     setTempStartDate(null);
    //     setTempEndDate(null);
    //     setIsOpen(false);
    // };
    const handleClear = () => {
        const now = new Date();
        const oneMonthAgo = subMonths(now, 1);
    
        onDateChange(null, null); // still tell parent that it's cleared
        setTempStartDate(oneMonthAgo);
        setTempEndDate(now);
        setIsOpen(false);
    };
    

    const handleToggleOpen = () => {
        setIsOpen(!isOpen);
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

    const customStaticRanges = createStaticRanges([
        ...defaultStaticRanges,
        {
            label: "6 Months",
            range: () => ({
                startDate: subMonths(new Date(), 6),
                endDate: new Date(),
            }),
        },
        {
            label: "This Year",
            range: () => ({
                startDate: startOfYear(new Date()),
                endDate: endOfYear(new Date()),
            }),
        },
        {
            label: "Previous Year",
            range: () => ({
                startDate: startOfYear(subYears(new Date(), 1)),
                endDate: endOfYear(subYears(new Date(), 1)),
            }),
        },
    ]);

    const modalContent = (
        <div className="filter-modal" style={getModalPosition()} ref={modalRef}>
            <DateRangePicker
                onChange={(item) => {
                    setTempStartDate(item.selection.startDate);
                    setTempEndDate(item.selection.endDate);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={[{ startDate: tempStartDate, endDate: tempEndDate, key: 'selection' }]}
                direction="horizontal"
                preventSnapRefocus={true}
                staticRanges={customStaticRanges}
            />
            <div className="d-flex justify-content-end mt-2">
                <button className="btn btn-danger" onClick={handleClear}>Clear</button>
                <button className="ms-2 btn btn-success" onClick={handleApply}>Apply</button>
            </div>
        </div>
    );

    return (
        <div ref={buttonRef}>
            <div onClick={handleToggleOpen} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                {title} <i className="fa-solid fa-angle-down"></i>
            </div>
            {isOpen && ReactDOM.createPortal(
                modalContent,
                document.body
            )}
        </div>
    );
}

export default FilterDateRangeModal;
