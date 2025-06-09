import React, { useState, useEffect } from 'react';
import '../OrderMgmt.css';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import OrderDetailModal from './OrderDetailModal'; // New component for detailed view

const OrderMgmt = () => {
    const ORDER_API_BASE_URL = 'http://localhost:1111/order';
    const RESTAURANT_API_BASE_URL = 'http://localhost:1111/restaurant';

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current');
    const [filterStatus, setFilterStatus] = useState('All');

    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null); // State to hold details for the modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const auth = useAuth();

    useEffect(() => {
        console.log(`Frontend connecting to backend at: ${ORDER_API_BASE_URL}`);
    }, []);

    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isLoggedIn && auth.jwtToken) {
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

        // Get userEmail and role from auth context or localStorage
        const userEmail = auth.userEmail;
        const userRole = auth.userRole;
        
        // Construct URL based on user role and filters
        let url = `${ORDER_API_BASE_URL}/list`;

        // Add query parameters based on role and status
        if (userRole === 'ADMIN') {
            // Admin can see all orders or filter by status
            if (status && status !== 'All') {
                url = `${ORDER_API_BASE_URL}/list?status=${status}`;
            }
        } else {
            // Regular users see their orders filtered by email and optionally by status
            if (status && status !== 'All') {
                url = `${ORDER_API_BASE_URL}/list?status=${status}&email=${userEmail}`;
            } else {
                url = `${ORDER_API_BASE_URL}/list?email=${userEmail}`;
            }
        }

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
            let backendOrders = await response.json();
            console.log('Successfully fetched raw backend orders:', backendOrders);

            // Load detailed orders from localStorage (cache)
            let cachedOrders = {};
            try {
                cachedOrders = JSON.parse(localStorage.getItem('expressbite_orders_cache')) || {};
            } catch { cachedOrders = {}; }

            // Merge backend orders with cached details
            const ordersToDisplay = await Promise.all(backendOrders.map(async (backendOrder) => {
                const cachedDetail = cachedOrders[backendOrder.orderId];
                let orderDisplay = { ...backendOrder };

                if (cachedDetail) {
                    orderDisplay = {
                        ...orderDisplay,
                        ...cachedDetail, // This merges deliveryDetails, orderItems, paymentMethod, etc.
                        status: backendOrder.status // Always use backend status
                    };
                }

                // Fetch restaurant name if needed (as before)
                if (orderDisplay.restaurantID && !orderDisplay.restaurantName) {
                    try {
                        const restaurantResponse = await fetch(`${RESTAURANT_API_BASE_URL}/viewRestaurantById/${orderDisplay.restaurantID}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${auth.jwtToken}`
                            }
                        });
                        if (restaurantResponse.ok) {
                            const restaurantData = await restaurantResponse.json();
                            orderDisplay.restaurantName = restaurantData.name || `ID: ${orderDisplay.restaurantID}`;
                        } else {
                            orderDisplay.restaurantName = `ID: ${orderDisplay.restaurantID}`;
                        }
                    } catch {
                        orderDisplay.restaurantName = `ID: ${orderDisplay.restaurantID}`;
                    }
                } else if (!orderDisplay.restaurantID) {
                    orderDisplay.restaurantName = 'N/A';
                }

                return orderDisplay;
            }));

            setOrders(ordersToDisplay);
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

    const cacheOrderDetails = (orderId, orderDetails) => {
        let cache = {};
        try {
            cache = JSON.parse(localStorage.getItem('expressbite_orders_cache')) || {};
        } catch {}
        cache[orderId] = orderDetails;
        localStorage.setItem('expressbite_orders_cache', JSON.stringify(cache));
    };

    const handleOrderCardClick = (order) => {
        setSelectedOrderDetails(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrderDetails(null);
    };

    return (
        <div className="my-orders-page">
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
                            <div key={order.orderId} className="order-card" onClick={() => handleOrderCardClick(order)}>
                                <div className="order-card-header">
                                    <h3 className="order-id">Order ID: {order.orderId}</h3>
                                    <span className={`order-status status-${order.status ? order.status.toLowerCase() : 'unknown'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="order-restaurant-name">Restaurant: <span>{order.restaurantName || 'Loading...'}</span></p>
                                <p className="order-total-amount">Total Amount: <span>₹{order.totalAmount?.toFixed(2)}</span></p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {isModalOpen && selectedOrderDetails && (
                <OrderDetailModal order={selectedOrderDetails} onClose={handleCloseModal} />
            )}

            <Footer />
        </div>
    );
};

export default OrderMgmt;
