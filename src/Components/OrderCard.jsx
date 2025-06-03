import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faClock, faCheckCircle, faTimesCircle, faBoxOpen, faHistory } from '@fortawesome/free-solid-svg-icons';

const OrderCard = ({ order, onClick }) => {
    // Determine status class and icon
    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered': return 'status-delivered';
            case 'Processing': return 'status-processing';
            case 'Cancelled': return 'status-cancelled';
            case 'Pending': return 'status-pending';
            default: return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return faCheckCircle;
            case 'Processing': return faClock;
            case 'Cancelled': return faTimesCircle;
            case 'Pending': return faBoxOpen;
            default: return faHistory;
        }
    };

    return (
        <div className="order-card" onClick={() => onClick(order)}>
            <div className="order-card-header">
                <div>
                    <h3 className="order-id">Order ID: {order.id}</h3>
                    <p className="order-date">Date: {order.date} at {order.time}</p>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
                    {order.status}
                </span>
            </div>
            <div className="order-restaurant-info">
                <FontAwesomeIcon icon={faUtensils} className="fa-icon" />
                <span>{order.restaurant.name}</span>
            </div>
            <ul className="order-items-summary">
                {order.items.slice(0, 2).map((item, index) => ( // Show first 2 items
                    <li key={index}>
                        <span>{item.name} (x{item.qty})</span>
                        <span>${(item.price * item.qty).toFixed(2)}</span>
                    </li>
                ))}
                {order.items.length > 2 && (
                    <li>...and {order.items.length - 2} more items</li>
                )}
            </ul>
            <div className="order-total">
                Total: ${order.total.toFixed(2)}
            </div>
            {order.status === 'Processing' && (
                <div className="mt-4 text-right">
                    <button className="btn bg-dark-orange text-white px-4 py-2 rounded-md hover:bg-orange-700">Track Order</button>
                </div>
            )}
            {order.status === 'Delivered' && (
                <div className="mt-4 text-right">
                    <button className="btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Reorder</button>
                </div>
            )}
        </div>
    );
};

export default OrderCard;