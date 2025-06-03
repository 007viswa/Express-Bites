
// src/Components/OrderDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUtensils, faMapMarkerAlt, faDollarSign, faCreditCard, faClock, faCheckCircle, faTimesCircle, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const OrderDetailsModal = ({ order, onClose }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Trigger the active class for animation
        const timer = setTimeout(() => {
            setIsActive(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsActive(false);
        setTimeout(() => {
            onClose();
        }, 300); // Match CSS transition duration
    };

    if (!order) return null;

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
            default: return faClock; // Default icon
        }
    };

    return (
        <div className={`modal-overlay ${isActive ? 'active' : ''}`}>
            <div className={`modal-content ${isActive ? 'active' : ''}`}>
                <button className="modal-close-button" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="modal-header">
                    <h2>Order Details: {order.id}</h2>
                </div>

                <div className="modal-info-grid">
                    <div className="modal-info-item">
                        <strong>Date:</strong> {order.date}
                    </div>
                    <div className="modal-info-item">
                        <strong>Time:</strong> {order.time}
                    </div>
                    <div className="modal-info-item">
                        <strong>Status:</strong> <span className={`order-status ${getStatusClass(order.status)}`}>
                            <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-1" />
                            {order.status}
                        </span>
                    </div>
                    <div className="modal-info-item">
                        <strong>Restaurant:</strong> {order.restaurant.name}
                    </div>
                    <div className="modal-info-item col-span-full">
                        <strong><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />Delivery Address:</strong> {order.deliveryAddress}
                    </div>
                    <div className="modal-info-item">
                        <strong><FontAwesomeIcon icon={faCreditCard} className="mr-2" />Payment Method:</strong> {order.paymentMethod}
                    </div>
                </div>

                <div className="modal-items-list">
                    <h3>Ordered Items:</h3>
                    {order.items.map((item, index) => (
                        <div key={index} className="modal-item">
                            <span>{item.name} (x{item.qty})</span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="modal-summary">
                    <div className="modal-summary-row">
                        <span>Subtotal:</span>
                        <span>${(order.total - order.deliveryFee - order.serviceFee).toFixed(2)}</span>
                    </div>
                    <div className="modal-summary-row">
                        <span>Delivery Fee:</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="modal-summary-row">
                        <span>Service Fee:</span>
                        <span>${order.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="modal-summary-row total">
                        <span>Total Paid:</span>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;