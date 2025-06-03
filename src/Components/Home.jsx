// Components/Home.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import Header from './Header';
// Restored original local image imports
import pacmanWhiteLogo from '../logos/pacman-white.png';
import appStoreBadge from '../logos/app-store-badge.svg';
import googlePlayBadge from '../logos/google-play-badge.svg';
import Biriyani from '../Food items/Biriyani.avif';
import food2 from '../Food items/2.png';
import food1 from '../Food items/food1.png';
import dosa1 from '../Food items/dosa1.png';

import RestaurantCarousel from './RestaurantCarousel';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// Main Home Component
function Home({ onSignInClick, onLoginSuccess }) {
    const [showLoginSuccessNotification, setShowLoginSuccessNotification] = useState(false);
    const [showLogoutSuccessNotification, setShowLogoutSuccessNotification] = useState(false);
    const [showRestaurants, setShowRestaurants] = useState(false);
    const auth = useAuth();

    // Ref to store the previous login state
    const prevIsLoggedInRef = useRef(auth.isLoggedIn);
    // Ref for the restaurant carousel section
    const restaurantCarouselRef = useRef(null); // New ref for scrolling

    // Effect to handle login/logout state changes and update UI accordingly
    useEffect(() => {
        const prevIsLoggedIn = prevIsLoggedInRef.current;

        // If login status has changed
        if (auth.isLoggedIn !== prevIsLoggedIn) {
            if (auth.isLoggedIn) {
                // User just logged in
                setShowLoginSuccessNotification(true);
                setShowLogoutSuccessNotification(false); // Hide logout notification if logging in
                setShowRestaurants(true);
            } else {
                // User just logged out
                setShowLoginSuccessNotification(false); // Hide login notification
                setShowLogoutSuccessNotification(true); // Show logout notification
                setShowRestaurants(false); // Hide restaurants
            }
        } else if (auth.isLoggedIn && !showRestaurants) {
            // If already logged in on initial load, ensure restaurants are shown
            setShowRestaurants(true);
            setShowLogoutSuccessNotification(false); // Hide any lingering logout notification
        } else if (!auth.isLoggedIn && showRestaurants) {
            // If not logged in but restaurants are showing (e.g., after a refresh when not logged in)
            setShowRestaurants(false);
        }

        // Update the ref to the current login state for the next render
        prevIsLoggedInRef.current = auth.isLoggedIn;

    }, [auth.isLoggedIn, showRestaurants]); // Dependencies: react to login state and carousel visibility

    // Effect to hide the success notifications after a few seconds
    useEffect(() => {
        let timer;
        if (showLoginSuccessNotification || showLogoutSuccessNotification) {
            timer = setTimeout(() => {
                setShowLoginSuccessNotification(false);
                setShowLogoutSuccessNotification(false);
            }, 3000); // Both notifications disappear after 3 seconds
        }
        return () => clearTimeout(timer); // Cleanup on component unmount or if notification hides sooner
    }, [showLoginSuccessNotification, showLogoutSuccessNotification]);


    const handleOrderNowClick = () => {
        if (auth.isLoggedIn) {
            setShowRestaurants(true); // Show restaurants if logged in
            // The useEffect above will handle the scrolling
        } else {
            onSignInClick(); // Pop up login if not logged in
        }
    };

    // HeroSection Component
    function HeroSection() {
        const images = [
            Biriyani,
            food2,
            food1,
            dosa1,
        ];

        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const [activeImageClass, setActiveImageClass] = useState('');

        useEffect(() => {
            setActiveImageClass('active');
            const intervalId = setInterval(() => {
                setActiveImageClass('');
                const fadeOutTimeout = setTimeout(() => {
                    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
                    setActiveImageClass('active');
                }, 1000); // Duration of fade-out
                return () => clearTimeout(fadeOutTimeout);
            }, 4500); // Total duration for each image (fade-in + display + fade-out)
            return () => clearInterval(intervalId);
        }, [images.length]);

        return (
            <section className="hero-section">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <h1 className="hero-headline">Craving something delicious?<span className="highlight">We Deliver!</span></h1>
                        <p className="sub-headline">Order from your Favorite restaurants and get your food delivered straight to your doorstep.</p>
                        <div>
                            <button className="btn btn-secondary-solid" onClick={handleOrderNowClick}>Order Now</button>
                        </div>
                        <p className="popular-search-text">Popular: Pizza, Biriyani, Burgers, Sushi, etc.. </p>
                    </div>
                    <div className="hero-img" id="hero-image-carousel">
                        <img
                            src={images[currentImageIndex]}
                            alt="Delicious Food Item"
                            className={`biryani-image ${activeImageClass}`}
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-inter">
            <Header onSignInClick={onSignInClick} />

            {/* Login Success Notification BAR */}
            {showLoginSuccessNotification && (
                <div className="login-success-notification-wrapper">
                    <div className="login-success-notification">
                        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                        <span>Successfully logged in</span>
                    </div>
                </div>
            )}

            {/* Logout Success Notification BAR */}
            {showLogoutSuccessNotification && (
                <div className="login-success-notification-wrapper">
                    <div className="login-success-notification logout-notification">
                        <FontAwesomeIcon icon={faSignOutAlt} className="success-icon" />
                        <span>Successfully signed out</span>
                    </div>
                </div>
            )}

            <main className="flex-grow">
                <HeroSection />
                {/* Attach the ref to the section containing the RestaurantCarousel */}
                <section ref={restaurantCarouselRef}>
                    {showRestaurants && <RestaurantCarousel />}
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
