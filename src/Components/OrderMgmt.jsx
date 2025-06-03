import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../OrderMgmt.css'; // Import the CSS file
import OrderCard from './OrderCard'; // New import
import OrderDetailsModal from './OrderDetailsModal'; // New import
import OrderFilter from './OrderFilter'; // New import
import LoadingSkeleton from './LoadingSkeleton'; // New import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // For empty state icon
import { faBoxOpen, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const OrderMgmt = ({ onSignInClick }) => {
    const auth = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current'); // 'current' or 'past'
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Processing', 'Delivered', 'Cancelled', 'Pending'
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal details

    // Mock Data for demonstration
    const allMockOrders = useMemo(() => [
        {
            id: 'ORD001',
            date: '2025-05-28',
            time: '19:30',
            total: 25.50,
            status: 'Delivered',
            restaurant: { name: 'Spice Route', address: '123 Main St, Anytown' },
            items: [
                { name: 'Chicken Biryani', qty: 1, price: 15.00, notes: '' },
                { name: 'Garlic Naan', qty: 2, price: 2.75, notes: '' },
                { name: 'Coca-Cola', qty: 1, price: 2.00, notes: '' }
            ],
            deliveryAddress: 'Apt 4B, 789 Oak Ave, Anytown',
            deliveryFee: 3.00,
            serviceFee: 1.00,
            paymentMethod: 'Credit Card',
            isPast: true // Mark as past order
        },
        {
            id: 'ORD002',
            date: '2025-06-01',
            time: '12:45',
            total: 18.00,
            status: 'Processing',
            restaurant: { name: 'Pizza Palace', address: '456 Elm St, Anytown' },
            items: [
                { name: 'Pepperoni Pizza (Large)', qty: 1, price: 18.00, notes: 'Extra cheese' }
            ],
            deliveryAddress: 'House 12, 101 Pine Rd, Anytown',
            deliveryFee: 2.50,
            serviceFee: 0.50,
            paymentMethod: 'Cash on Delivery',
            isPast: false // Mark as current order
        },
        {
            id: 'ORD003',
            date: '2025-05-20',
            time: '14:00',
            total: 30.00,
            status: 'Cancelled',
            restaurant: { name: 'Green Garden', address: '789 Birch Ave, Anytown' },
            items: [
                { name: 'Vegan Burger', qty: 1, price: 12.00, notes: 'No pickles' },
                { name: 'Sweet Potato Fries', qty: 1, price: 6.00, notes: '' },
                { name: 'Green Smoothie', qty: 1, price: 5.00, notes: '' }
            ],
            deliveryAddress: 'Office 301, 200 Cedar Ln, Anytown',
            deliveryFee: 3.00,
            serviceFee: 1.00,
            paymentMethod: 'Online Banking',
            isPast: true // Mark as past order
        },
        {
            id: 'ORD004',
            date: '2025-06-02',
            time: '18:00',
            total: 12.50,
            status: 'Pending',
            restaurant: { name: 'Burger Joint', address: '111 Oak St, Anytown' },
            items: [
                { name: 'Classic Burger', qty: 1, price: 9.00, notes: '' },
                { name: 'French Fries', qty: 1, price: 3.50, notes: '' }
            ],
            deliveryAddress: 'Apt 1A, 555 Maple Dr, Anytown',
            deliveryFee: 2.00,
            serviceFee: 0.50,
            paymentMethod: 'Credit Card',
            isPast: false // Mark as current order
        },
        {
            id: 'ORD005',
            date: '2025-05-15',
            time: '20:00',
            total: 40.00,
            status: 'Delivered',
            restaurant: { name: 'Sushi Spot', address: '999 Pine St, Anytown' },
            items: [
                { name: 'California Roll', qty: 1, price: 15.00, notes: '' },
                { name: 'Spicy Tuna Roll', qty: 1, price: 16.00, notes: '' },
                { name: 'Miso Soup', qty: 2, price: 4.50, notes: '' }
            ],
            deliveryAddress: 'House 7, 222 Willow Ct, Anytown',
            deliveryFee: 4.00,
            serviceFee: 1.00,
            paymentMethod: 'PayPal',
            isPast: true // Mark as past order
        }
    ], []); // Memoize mock data

    useEffect(() => {
        if (auth.isLoggedIn && auth.jwtToken) {
            setLoading(true);
            setError(null);
            // Simulate API call with a delay
            const fetchUserOrders = async () => {
                try {
                    // In a real application, you'd fetch from your order management microservice
                    // const response = await fetch('http://localhost:XXXX/order/my-orders', {
                    //     headers: {
                    //         'Authorization': `Bearer ${auth.jwtToken}`
                    //     }
                    // });
                    // if (!response.ok) {
                    //     throw new Error(`Failed to fetch orders: ${response.statusText}`);
                    // }
                    // const data = await response.json();
                    // setOrders(data);

                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOrders(allMockOrders);

                } catch (err) {
                    console.error("Error fetching orders:", err);
                    setError("Failed to load orders. Please try again.");
                } finally {
                    setLoading(false);
                }
            };
            fetchUserOrders();
        } else {
            setLoading(false); // If not logged in, no need to load orders
            setOrders([]);
        }
    }, [auth.isLoggedIn, auth.jwtToken, allMockOrders]); // Re-run when login status or token changes

    const filteredOrders = useMemo(() => {
        let filtered = orders.filter(order =>
            activeTab === 'current' ? !order.isPast : order.isPast
        );

        if (filterStatus !== 'All') {
            filtered = filtered.filter(order => order.status === filterStatus);
        }
        return filtered.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)); // Sort by date descending
    }, [orders, activeTab, filterStatus]);

    const handleOrderCardClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="min-h-screen flex flex-col font-poppins bg-background-light">
            <Header onSignInClick={onSignInClick} />

            <main className="flex-grow py-16 px-4 container">
                <section className="text-center mb-12">
                    <h1 className="order-section-header">My Orders</h1>
                    <p className="text-lg text-text-light leading-relaxed max-w-2xl mx-auto">
                        View your past and current food orders.
                    </p>
                </section>

                {!auth.isLoggedIn ? (
                    <section className="empty-state">
                        <FontAwesomeIcon icon={faSignInAlt} className="icon" />
                        <h2 className="text-3xl font-semibold text-text-dark mb-4">Please Log In to View Your Orders</h2>
                        <p className="text-text-light mb-6">
                            You need to be logged in to access your order history and details.
                        </p>
                        <button
                            onClick={() => onSignInClick()} // Trigger login popup
                            className="btn btn-secondary-solid"
                        >
                            Sign In
                        </button>
                    </section>
                ) : (
                    <section className="max-w-4xl mx-auto w-full">
                        <h2 className="text-3xl font-semibold text-text-dark mb-6 text-center">
                            Welcome, {auth.userEmail || 'User'}!
                        </h2>

                        <div className="order-tabs">
                            <button
                                className={`order-tab-button ${activeTab === 'current' ? 'active' : ''}`}
                                onClick={() => setActiveTab('current')}
                            >
                                Current Orders
                            </button>
                            <button
                                className={`order-tab-button ${activeTab === 'past' ? 'active' : ''}`}
                                onClick={() => setActiveTab('past')}
                            >
                                Past Orders
                            </button>
                        </div>

                        <OrderFilter onFilterChange={setFilterStatus} currentFilter={filterStatus} />

                        {loading && <LoadingSkeleton />}

                        {!loading && !error && filteredOrders.length === 0 && (
                            <div className="empty-state">
                                <FontAwesomeIcon icon={faBoxOpen} className="icon" />
                                <h3 className="text-2xl font-semibold text-text-dark mb-4">
                                    No {filterStatus !== 'All' ? filterStatus : ''} {activeTab === 'current' ? 'Current' : 'Past'} Orders Found
                                </h3>
                                <p className="text-text-light mb-6">
                                    It looks like you haven't placed any {activeTab === 'current' ? 'active' : 'past'} orders yet, or they don't match your filter.
                                </p>
                                {activeTab === 'current' && (
                                    <Link to="/" className="btn btn-secondary-solid inline-block">
                                        Browse Restaurants
                                    </Link>
                                )}
                                {activeTab === 'past' && filterStatus !== 'All' && (
                                    <button onClick={() => setFilterStatus('All')} className="btn bg-gray-300 text-text-dark px-4 py-2 rounded-md hover:bg-gray-400">
                                        Clear Filter
                                    </button>
                                )}
                            </div>
                        )}

                        {!loading && !error && filteredOrders.length > 0 && (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredOrders.map(order => (
                                    <OrderCard key={order.id} order={order} onClick={handleOrderCardClick} />
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

            <Footer />
            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />}
        </div>
    );
};

export default OrderMgmt;
