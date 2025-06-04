import React, { useState, useEffect } from 'react';
import '../OrderMgmt.css';
// import Header from './Header'; // REMOVED: Header is now in App.jsx
import { useAuth } from '../context/AuthContext';

const OrderMgmt = () => {
    const API_BASE_URL = 'http://localhost:1111/order';

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current');
    const [filterStatus, setFilterStatus] = useState('All');

    const auth = useAuth();

    useEffect(() => {
        console.log(`Frontend connecting to backend at: ${API_BASE_URL}`);
    }, []);

    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isLoggedIn) {
                let statusToFilter = filterStatus;
                if (activeTab === 'current' && filterStatus === 'All') {
                    statusToFilter = 'PENDING';
                } else if (activeTab === 'past' && filterStatus === 'All') {
                    statusToFilter = 'DELIVERED';
                }
                fetchAllOrders(statusToFilter);
            } else {
                setOrders([]);
                setError("You must be logged in to view your orders.");
                setLoading(false);
            }
        }
    }, [activeTab, filterStatus, auth.isLoggedIn, auth.isLoading, auth.jwtToken]);

    const fetchAllOrders = async (status) => {
        setLoading(true);
        setError(null);

        const url = status && status !== 'All' ? `${API_BASE_URL}/list?status=${status}` : `${API_BASE_URL}/list`;
        console.log(`Fetching orders from: ${url}`);
        console.log(`Using JWT Token: ${auth.jwtToken ? auth.jwtToken.substring(0, 30) + '...' : 'No Token'}`);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Raw backend response on error:', errorText);
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += ` - ${errorJson.message || errorJson.error || 'Unknown backend error'}`;
                } catch (e) {
                    errorMessage += ` - ${errorText}`;
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('Successfully fetched data:', data);
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(
                `Failed to fetch orders: ${err.message}. Please check the following: \n\n` +
                `1. **Backend Running?**: Ensure your API Gateway (port 1111) and Order Service are running. \n` +
                `2. **CORS Configuration**: Verify your API Gateway and Order Service have correct \`@CrossOrigin\` annotations for \`http://localhost:5176\`. \n` +
                `3. **Backend Restart**: Remember to restart your backend services after *any* code changes. \n` +
                `4. **Authentication**: Ensure you are logged in. (Error: ${err.message}) \n` +
                `5. **Network/Firewall**: Temporarily disable any local firewalls or antivirus that might block ports. \n` +
                `6. **Database Data**: Ensure your backend database contains order data.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-orders-page">
            {/* <Header /> Removed Header */}

            <div className="main-content">
                <h1 className="page-title">My Orders</h1>
                <p className="page-description">
                    View your past and current food orders with ease.
                </p>

                <div className="controls-container">
                    <div className="order-tabs">
                        <button
                            className={`order-tab-button ${activeTab === 'current' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('current');
                                setFilterStatus('All');
                            }}
                        >
                            Current Orders
                        </button>
                        <button
                            className={`order-tab-button ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('past');
                                setFilterStatus('All');
                            }}
                        >
                            Past Orders
                        </button>
                    </div>

                    <div className="filter-dropdown-container">
                        <select
                            className="filter-dropdown"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <div className="dropdown-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="loading-message">
                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                        </svg>
                        Loading orders...
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        <div className="error-icon-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m15 9-6 6"></path>
                                <path d="m9 9 6 6"></path>
                            </svg>
                            <span className="error-heading">Connection Error!</span>
                        </div>
                        <p className="error-details">{error}</p>
                    </div>
                )}

                <div className="orders-grid">
                    {orders.length === 0 && !loading && !error ? (
                        <p className="no-orders-message">No orders found for the selected criteria.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order.orderId} className="order-card">
                                <div className="order-card-header">
                                    <h3 className="order-id">Order ID: {order.orderId}</h3>
                                    <span className={`order-status status-${order.status ? order.status.toLowerCase() : 'unknown'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="order-restaurant-id">Restaurant ID: <span>{order.restaurantId}</span></p>
                                <p className="order-total-amount">Total Amount: <span>${order.totalAmount?.toFixed(2)}</span></p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderMgmt;
