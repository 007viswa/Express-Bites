
// Components/Home.jsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import pacmanWhiteLogo from '../logos/pacman-white.png';
import appStoreBadge from '../logos/app-store-badge.svg';
import googlePlayBadge from '../logos/google-play-badge.svg';
import Biriyani from '../Food items/Biriyani.avif';
import food2 from '../Food items/2.png';
import food1 from '../Food items/food1.png';
import dosa1 from '../Food items/dosa1.png';
import RestaurantCarousel from './RestaurantCarousel';
import { useAuth } from '../context/AuthContext';

// Main Home Component
function Home({ onSignInClick, onLoginSuccess }) { // Receive onLoginSuccess prop
    const [showLoginSuccessNotification, setShowLoginSuccessNotification] = useState(false);
    const auth = useAuth();

    useEffect(() => {
        // This effect ensures the notification is shown if login was successful
        // and then hides it after a delay.
        // It also ensures the popup is closed if the user logs in while it's open.
        if (auth.isLoggedIn && !showLoginSuccessNotification) {
            // This condition prevents the notification from re-appearing on every render
            // if the user is already logged in. It should only appear right after a successful login.
            // The `onLoginSuccess` prop from App.jsx will handle setting this state.
        }
    }, [auth.isLoggedIn, showLoginSuccessNotification]);

    // Effect to hide the success notification after a few seconds
    useEffect(() => {
        let timer;
        if (showLoginSuccessNotification) {
            timer = setTimeout(() => {
                setShowLoginSuccessNotification(false);
            }, 3000); // Notification disappears after 3 seconds
        }
        return () => clearTimeout(timer); // Cleanup on component unmount or if notification hides sooner
    }, [showLoginSuccessNotification]);

    const handleLocalSignInClick = () => {
        onSignInClick(); // Call the App's handler to open the popup
        setShowLoginSuccessNotification(false); // Ensure notification is hidden if opening login again
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
                }, 1000);
                return () => clearTimeout(fadeOutTimeout);
            }, 4500);
            return () => clearInterval(intervalId);
        }, [images.length]);

        return (
            <section className="hero-section">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <h1 className="hero-headline">Craving something delicious?<span className="highlight">We Deliver!</span></h1>
                        <p className="sub-headline">Order from your Favorite restaurants and get your food delivered straight to your doorstep.</p>
                        <div className="search-box">
                            <input type="text" placeholder="Enter your delivery location..." className="location-input" />
                            <button className="btn btn-secondary-solid">Find Food</button>
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

    // Footer Component
    function Footer() {
        return (
            <footer className="main-footer">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <a href="#" className="logo footer-logo">
                            <img src={pacmanWhiteLogo} alt="Express bite logo" />
                            <span>ExpressBite</span>
                        </a>
                    </div>
                    <div className="footer-column">
                        <h3>About ExpressBite</h3>
                        <ul>
                            <li><a href="#">Who We Are</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Investor Relations</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>For Restaurants</h3>
                        <ul>
                            <li><a href="#">Partner With Us</a></li>
                            <li><a href="#">Our Network</a></li>
                            <li><a href="#">Business Tools</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>For Delivery Partners</h3>
                        <ul>
                            <li><a href="#">Become a Rider</a></li>
                            <li><a href="#">Deliver with Us</a></li>
                            <li><a href="#">Rider Benefits</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Learn More</h3>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Security</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Help & Support</a></li>
                            <li><a href="#">Report a Fraud</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <div className="app-buttons">
                            <a href="#" aria-label="Download on App Store">
                                <img src={appStoreBadge} alt="App Store" className="app-badge" />
                            </a>
                            <a href="#" aria-label="Get it on Google Play">
                                <img src={googlePlayBadge} alt="Google Play" className="app-badge" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container footer-bottom">
                    <p>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners.</p>
                    <p>&copy; 2023 ExpressBite. All rights reserved.</p>
                </div>
            </footer>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-inter">
            <Header onSignInClick={handleLocalSignInClick} />

            {/* Login Success Notification BAR */}
            {showLoginSuccessNotification && (
                <div className="login-success-notification-wrapper">
                    <div className="login-success-notification">
                        <i className="fa-solid fa-circle-check"></i> {/* Green tick icon */}
                        <span>Successfully logged in</span>
                    </div>
                </div>
            )}

            <main className="flex-grow">
                <HeroSection />
                <RestaurantCarousel />
            </main>
            <Footer />
        </div>
    );
}

export default Home;