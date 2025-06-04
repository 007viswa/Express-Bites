// App.jsx
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'; // Added BrowserRouter
import React, { useState } from 'react';
import Home from './Components/Home';
import OrderMgmt from './Components/OrderMgmt';
import AboutUs from './Components/AboutUs';
import PartnerWithUs from './Components/PartnerWithUs';
import HowItWorks from './Components/HowItWorks';
import LoginPopup from './Components/LoginPopup';
import AdminDashboard from './Components/AdminDashboard';
import { useAuth } from './context/AuthContext';
import MenuPage from './Components/MenuPage';
import Header from './Components/Header';
import Unauthorized from './Components/Unauthorized';
import ProtectedRoute from './Components/ProtectedRoute';

const NotFound = () => (
    <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: 'calc(100vh - 140px)' }}>
        <h1 style={{ fontSize: '4em', color: '#f77024' }}>404</h1>
        <p style={{ fontSize: '1.5em', color: '#666' }}>Page Not Found</p>
        <p style={{ fontSize: '1em', color: '#888' }}>The page you are looking for does not exist.</p>
    </div>
);

function App() {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [popupTriggerContext, setPopupTriggerContext] = useState(null);
    const auth = useAuth();

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
        // The Home component will handle showing its own success notification
    };

    return (
        <>
            <Header onSignInClick={handleSignInClick} />
            {auth.isLoggedIn && auth.userRole === 'ADMIN' ? (
                // If admin is logged in, show the Admin Dashboard
                <AdminDashboard />
            ) : (
                // Otherwise, show the regular routes
                <Routes>
                    <Route path="/" element={<Home onSignInClick={handleSignInClick} onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/about-us" element={<AboutUs onSignInClick={handleSignInClick} />} />
                    <Route path="/partner-with-us" element={<PartnerWithUs onSignInClick={handleSignInClick} />} />
                    <Route path="/how-it-works" element={<HowItWorks onSignInClick={handleSignInClick} />} />
                    <Route path="/order" element={<OrderMgmt onSignInClick={handleSignInClick} />} />
                    <Route
                        path="/restaurant/:restaurantId/menu"
                        element={<MenuPage />}
                    />
                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />                    
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            )}

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
