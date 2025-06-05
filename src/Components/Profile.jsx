// src/Components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import Header from './Header'; // Adjust path if needed
import '../Profile.css'; // Ensure this CSS file is present
 
const Profile = () => {
    const { isLoggedIn, jwtToken, userEmail: authUserEmail, isLoading,logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    // This is the URL to your backend's fetchByEmail endpoint.
    // Assuming your API Gateway is at 1111 and routes /auth to the SecurityServer.
    // If you're calling SecurityServer directly and it's on 9090, use 'http://localhost:9090/auth/fetchByEmail'
    const API_BASE_URL = 'http://localhost:1111/auth/fetchByEmail';
 
    useEffect(() => {
        const fetchProfile = async () => {
            if (isLoading) {
                // Wait for authentication state to load completely
                return;
            }
 
            if (!isLoggedIn || !jwtToken || !authUserEmail) {
                setError("You must be logged in to view your profile.");
                setLoading(false);
                return;
            }
 
            setLoading(true);
            setError(null);
 
            try {
                // Construct the URL with the logged-in user's email
                const url = `${API_BASE_URL}/${authUserEmail}`;
 
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
 
                if (!response.ok) {
                    const errorDetails = await response.json(); // Backend might return JSON for errors
                    let errorMessage = errorDetails.message || `Failed to fetch profile: ${response.status} ${response.statusText}`;
                    throw new Error(errorMessage);
                }
 
                const data = await response.json();
               
                // Your backend returns Optional<UserInfo>, which typically deserializes
                // as either the UserInfo object or null/empty object if not found.
                // We'll check if the data object is actually populated.
                if (data && data.userId) { // Check for a key that indicates valid UserInfo
                    setProfileData(data);
                } else {
                    setError("No profile data found for this user.");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(`Error: ${err.message}. Please try again later.`);
            } finally {
                setLoading(false);
            }
        };
 
        fetchProfile();
    }, [isLoggedIn, jwtToken, authUserEmail, isLoading]); // Re-run effect if these change
// Handle logout functionality
const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the home page
};
 
    if (loading) {
        return (
            <div className="profile-page-container">
                <Header />
                <div className="profile-loading-message">Loading profile...</div>
            </div>
        );
    }
 
    if (error) {
        return (
            <div className="profile-page-container">
                <Header />
                <div className="profile-error-message">{error}</div>
            </div>
        );
    }
 
    if (!profileData) {
        return (
            <div className="profile-page-container">
                <Header />
                <div className="profile-empty-state">No profile data available.</div>
            </div>
        );
    }
 
    return (
        <div className="profile-page-container">
            <Header />
            <div className="profile-content">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-description">View your account details.</p>
 
                <div className="profile-details-card">
                    <div className="profile-detail-item">
                        <strong>User ID:</strong> <span>{profileData.userId}</span>
                    </div>
                    <div className="profile-detail-item">
                        <strong>Name:</strong> <span>{profileData.name}</span>
                    </div>
                    <div className="profile-detail-item">
                        <strong>Email:</strong> <span>{profileData.email}</span>
                    </div>
                    <div className="profile-detail-item">
                        <strong>Role(s):</strong> <span>{profileData.roles}</span>
                    </div>
                    <div className="logout-button-container">
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};
 
export default Profile;