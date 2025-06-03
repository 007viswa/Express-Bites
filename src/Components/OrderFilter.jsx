import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const OrderFilter = ({ onFilterChange, currentFilter }) => {
    const statuses = ['All', 'Processing', 'Delivered', 'Cancelled', 'Pending'];

    return (
        <div className="order-filter-container">
            <label htmlFor="order-status-filter" className="sr-only">Filter by Status</label>
            <FontAwesomeIcon icon={faFilter} className="text-text-light mr-2 self-center" />
            <select
                id="order-status-filter"
                className="order-filter-select"
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value)}
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default OrderFilter;