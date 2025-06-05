import React from 'react';
import '../OrderMgmt.css'; // Use the same CSS for modal styling

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  // Helper to format delivery details into a readable string
  const formatAddress = (details) => {
    if (!details) return "N/A";
    const { firstName, lastName, street, city, state, zipCode, country, phone, email } = details;
    return (
      <>
        <p><strong>Name:</strong> {firstName} {lastName}</p>
        <p><strong>Address:</strong> {street}, {city}, {state} - {zipCode}, {country}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Email:</strong> {email}</p>
      </>
    );
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h2 className="order-modal-title">Order Details: {order.orderId}</h2>
          <button className="close-modal-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="order-modal-body">
          <p><strong>Restaurant:</strong> {order.restaurantName || `ID: ${order.restaurantID}`}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
          <p><strong>Status:</strong> <span className={`order-status status-${order.status ? order.status.toLowerCase() : 'unknown'}`}>{order.status}</span></p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
          <p><strong>Order Time:</strong> {order.orderTime ? new Date(order.orderTime).toLocaleString() : 'N/A'}</p>

          <h3 className="modal-section-title">Delivery Information</h3>
          <div className="delivery-info-section">
            {formatAddress(order.deliveryDetails)}
          </div>

          <h3 className="modal-section-title">Items Ordered</h3>
          {order.orderItems && order.orderItems.length > 0 ? (
            <ul className="ordered-items-list">
              {order.orderItems.map((item, index) => (
                <li key={index} className="ordered-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity)?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-items-message">No detailed item list available (may not be cached).</p>
          )}
        </div>
        <div className="order-modal-footer">
          <button className="close-modal-button-footer" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
