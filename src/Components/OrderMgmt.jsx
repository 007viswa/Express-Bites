import React, { useState, useEffect } from 'react';
import '../OrderMgmt.css';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer'; // Assuming Footer exists and needs to be rendered

const OrderMgmt = () => {
    const ORDER_API_BASE_URL = 'http://localhost:1111/order';
    const RESTAURANT_API_BASE_URL = 'http://localhost:1111/restaurant'; // Assuming this is your Restaurant Service base URL

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current');
    const [filterStatus, setFilterStatus] = useState('All');

    const auth = useAuth();

    useEffect(() => {
        console.log(`Frontend connecting to backend at: ${ORDER_API_BASE_URL}`);
    }, []);

    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isLoggedIn && auth.jwtToken) { // Ensure token is available
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

        const url = status && status !== 'All' ? `${ORDER_API_BASE_URL}/list?status=${status}` : `${ORDER_API_BASE_URL}/list`;
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
            let ordersData = await response.json();
            console.log('Successfully fetched raw orders:', ordersData);

            // Fetch restaurant names for each order
            const ordersWithRestaurantNames = await Promise.all(ordersData.map(async (order) => {
                if (order.restaurantID) {
                    try {
                        const restaurantResponse = await fetch(`${RESTAURANT_API_BASE_URL}/viewRestaurantById/${order.restaurantID}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${auth.jwtToken}` // Assuming restaurant service also needs auth
                            }
                        });
                        if (restaurantResponse.ok) {
                            const restaurantData = await restaurantResponse.json();
                            return { ...order, restaurantName: restaurantData.name || `ID: ${order.restaurantID}` };
                        } else {
                            console.warn(`Could not fetch restaurant name for ID: ${order.restaurantID}. Status: ${restaurantResponse.status}`);
                            return { ...order, restaurantName: `ID: ${order.restaurantID}` };
                        }
                    } catch (restErr) {
                        console.error(`Error fetching restaurant name for ID ${order.restaurantID}:`, restErr);
                        return { ...order, restaurantName: `ID: ${order.restaurantID}` };
                    }
                }
                return { ...order, restaurantName: 'N/A' }; // No restaurant ID
            }));

            setOrders(ordersWithRestaurantNames);
        } catch (err) {
            console.error('Error fetching orders or restaurant names:', err);
            setError(
                `Failed to fetch orders: ${err.message}. Please check the following: \n\n` +
                `1. **Backend Running?**: Ensure your API Gateway (port 1111), Order Service, and Restaurant Service are running. \n` +
                `2. **CORS Configuration**: Verify your backend services have correct \`@CrossOrigin\` annotations for \`http://localhost:5176\`. \n` +
                `3. **Backend Restart**: Remember to restart your backend services after *any* code changes. \n` +
                `4. **Authentication**: Ensure you are logged in. \n` +
                `5. **Network/Firewall**: Temporarily disable any local firewalls or antivirus that might block ports. \n` +
                `6. **Database Data**: Ensure your backend database contains order and restaurant data.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-orders-page">
            {/* Header is managed by App.jsx now */}

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
                            <option value="All">All</option>
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
                                {/* Display Restaurant Name */}
                                <p className="order-restaurant-name">Restaurant: <span>{order.restaurantName || 'Loading...'}</span></p>
                                <p className="order-total-amount">Total Amount: <span>₹{order.totalAmount?.toFixed(2)}</span></p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderMgmt;
