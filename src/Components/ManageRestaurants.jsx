import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../ManageRestaurants.css'; // New CSS file for this component

function ManageRestaurants() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [restaurant, setRestaurant] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: ''
        // Add more fields here as per your backend Restaurant model (e.g., cuisine, lat/long)
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // For success or error messages
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const API_BASE_URL = 'http://localhost:1111/restaurant'; // Assuming your Restaurant Service base URL

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurant(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setMessageType('');

        if (!auth.jwtToken) {
            setMessage("Authentication token not found. Please log in as an administrator.");
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            // Validate basic fields
            if (!restaurant.name || !restaurant.address || !restaurant.phoneNumber || !restaurant.email) {
                throw new Error("All fields are required.");
            }
            if (!/^[7-9][0-9]{9}$/.test(restaurant.phoneNumber)) {
                throw new Error("Phone number must be 10 digits and start with 7, 8, or 9.");
            }
            if (!/\S+@\S+\.\S+/.test(restaurant.email)) {
                throw new Error("Invalid email address.");
            }

            const response = await fetch(`${API_BASE_URL}/addRestaurant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
                body: JSON.stringify(restaurant)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add restaurant.');
            }

            const newRestaurant = await response.json();
            setMessage(`Restaurant '${newRestaurant.name}' added successfully with ID: ${newRestaurant.restaurantId}`);
            setMessageType('success');
            setRestaurant({ // Clear form fields
                name: '',
                address: '',
                phoneNumber: '',
                email: ''
            });
            console.log('New restaurant added:', newRestaurant);

        } catch (err) {
            console.error('Error adding restaurant:', err);
            setMessage(`Error: ${err.message || 'Something went wrong.'}`);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-restaurants-container">
            <h1 className="page-title">Add New Restaurant</h1>

            {message && (
                <div className={`notification-message ${messageType}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="restaurant-form">
                <div className="form-group">
                    <label htmlFor="name">Restaurant Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={restaurant.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={restaurant.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={restaurant.phoneNumber}
                        onChange={handleChange}
                        required
                        pattern="[7-9]{1}[0-9]{9}" // Basic pattern for 10 digits starting with 7, 8, or 9
                        title="Phone number must be 10 digits and start with 7, 8, or 9"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={restaurant.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Restaurant'}
                    </button>
                    <button type="button" className="back-button" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ManageRestaurants;
