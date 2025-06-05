import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './Components/Home';
import OrderMgmt from './Components/OrderMgmt';
import AboutUs from './Components/AboutUs';
import PartnerWithUs from './Components/PartnerWithUs';
import HowItWorks from './Components/HowItWorks';
import LoginPopup from './Components/LoginPopup';
import AdminDashboard from './Components/AdminDashboard';
import { useAuth } from './context/AuthContext'; // Import useAuth
import MenuPage from './Components/MenuPage';
import Header from './Components/Header';
import Unauthorized from './Components/Unauthorized';
// ProtectedRoute is already imported from './Components/ProtectedRoute' if you use it,
// but we'll define a simpler PrivateRoute/AdminRoute here for clarity and self-containment.
import CheckoutPage from './Components/CheckoutPage';
import Profile from './Components/Profile';
import ManageRestaurants from './Components/ManageRestaurants'; // Import ManageRestaurants

// Define PrivateRoute and AdminRoute components inline for this file
// (You might have these in a separate file like './Components/ProtectedRoute.jsx' already)
const PrivateRoute = ({ children, roles }) => {
    const auth = useAuth(); // Ensure useAuth is accessible here
    if (auth.isLoading) {
        return <div>Loading authentication...</div>; // Or a spinner/loader
    }
    if (!auth.isLoggedIn) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }
    // Check roles if specified
    if (roles && auth.userRole && !roles.includes(auth.userRole)) {
        console.warn(`Unauthorized access attempt for role: ${auth.userRole}. Required roles: ${roles.join(', ')}`);
        return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page
    }
    return children; // Render the child component if authorized
};

const AdminRoute = ({ children }) => (
    <PrivateRoute roles={['ADMIN']}>{children}</PrivateRoute> // Assumes ADMIN role string
);


const NotFound = () => (
    <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: 'calc(100vh - 140px)' }}>
        <h1 style={{ fontSize: '4em', color: '#ffac12' }}>404</h1> {/* Using your theme color */}
        <p style={{ fontSize: '1.5em', color: '#666' }}>Page Not Found</p>
        <p style={{ fontSize: '1em', color: '#888' }}>The page you are looking for does not exist.</p>
    </div>
);

function App() {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [popupTriggerContext, setPopupTriggerContext] = useState(null);
    const auth = useAuth(); // Get auth context here

    const handleSignInClick = (context = null) => {
        setPopupTriggerContext(context);
        setShowLoginPopup(true);
    };

    const handleCloseLoginPopup = () => {
        setShowLoginPopup(false);
        setPopupTriggerContext(null);
    };

    const handleLoginSuccess = () => {
        setShowLoginPopup(false);
        // Additional logic if needed for Home component or other parts
    };

    return (
        <>
            {/* Header is always rendered */}
            <Header onSignInClick={handleSignInClick} />

            {/* ALL routes go inside the <Routes> component */}
            <Routes>
                <Route path="/" element={<Home onSignInClick={handleSignInClick} onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/about-us" element={<AboutUs onSignInClick={handleSignInClick} />} />
                <Route path="/partner-with-us" element={<PartnerWithUs onSignInClick={handleSignInClick} />} />
                <Route path="/how-it-works" element={<HowItWorks onSignInClick={handleSignInClick} />} />
                
                {/* User Protected Routes */}
                <Route path="/order" element={<PrivateRoute><OrderMgmt onSignInClick={handleSignInClick} /></PrivateRoute>} />
                <Route path="/profile-settings" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                
                {/* Public restaurant menu (no login required to view a menu) */}
                <Route path="/restaurant/:restaurantId/menu" element={<MenuPage />} />

                {/* Admin Protected Routes */}
                {/* Make sure 'ADMIN' matches the exact role string from your backend */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/manage-restaurants" element={<AdminRoute><ManageRestaurants /></AdminRoute>} />
                
                {/* Public Unauthorized page */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Catch-all for 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Login Popup is conditionally rendered outside of Routes as an overlay */}
            {showLoginPopup && (
                <LoginPopup
                    onClose={handleCloseLoginPopup}
                    triggerContext={popupTriggerContext}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
}

export default App;
