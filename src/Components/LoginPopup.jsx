import React, { useState, useEffect } from 'react';
import '../LoginPopup.css'; // Import the CSS file
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Accept a new prop: triggerContext and onLoginSuccess
function LoginPopup({ onClose, triggerContext, onLoginSuccess }) {
    const [isActive, setIsActive] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginSuccessMessage, setLoginSuccessMessage] = useState(''); // For internal popup success

    const [loginUsername, setLoginUsername] = useState(''); // Maps to 'name' in UserInfo for login
    const [loginPassword, setLoginPassword] = useState('');

    const [signupUsername, setSignupUsername] = useState(''); // Maps to 'name' in UserInfo for signup
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const auth = useAuth();

    const API_BASE_URL = 'http://localhost:7777'; // Your SecurityServer URL

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsActive(false);
        setTimeout(() => {
            onClose();
            // Reset popup state when it's fully closed
            setIsSignup(false);
            setErrorMessage('');
            setLoginSuccessMessage('');
            setLoginUsername('');
            setLoginPassword('');
            setSignupUsername(''); // Reset signup username
            setSignupEmail('');
            setSignupPassword('');
        }, 400);
    };

    const handleToggleView = (e, view) => {
        e.preventDefault();
        setIsSignup(view === 'signup');
        setErrorMessage('');
        setLoginSuccessMessage(''); // Clear success message on view toggle
        if (view === 'login') {
            setSignupUsername(''); // Clear signup username
            setSignupEmail('');
            setSignupPassword('');
        } else {
            setLoginUsername('');
            setLoginPassword('');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoginSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername, // Send as username
                    password: loginPassword,
                }),
            });

            if (response.ok) {
                // Backend returns plain text JWT token on success
                const token = await response.text();
                console.log('Login successful! Token:', token);
                setLoginSuccessMessage('Successfully Logged In!'); // Set internal success message

                setTimeout(() => {
                    auth.login(token); // Pass the raw token to AuthContext
                    onLoginSuccess(); // Trigger the success callback in Home.jsx
                    handleClose(); // Close the popup
                }, 1500); // Show success message for 1.5 seconds
            } else {
                // Handle error response: try to parse as JSON, fallback to text
                let errorMsg = 'Login failed. Please try again.';
                try {
                    const errorBody = await response.json();
                    if (errorBody && errorBody.message) {
                        errorMsg = errorBody.message;
                    } else {
                        // If it's JSON but no 'message' field, stringify the whole object
                        errorMsg = JSON.stringify(errorBody);
                    }
                } catch (jsonParseError) {
                    // If response is not JSON, get it as plain text
                    const textError = await response.text();
                    errorMsg = textError || 'An unknown error occurred during login.';
                }
                console.error('Login failed:', response.status, errorMsg);
                setErrorMessage(errorMsg);
            }
        } catch (error) {
            console.error('Network error or unexpected issue:', error);
            setErrorMessage('Could not connect to the server. Please ensure the backend is running and accessible.');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoginSuccessMessage('');

        if (!signupUsername.trim()) { // Validate signup username
            setErrorMessage('Username cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/new`, { // Correct signup endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: signupUsername, // Use signupUsername directly for 'name'
                    email: signupEmail,
                    password: signupPassword,
                    roles: "ROLE_USER" // Default role for new users
                }),
            });

            if (response.ok) {
                const responseText = await response.text(); // Backend returns plain text message on success
                console.log('Signup successful:', responseText);
                setLoginSuccessMessage('Registration successful! Please log in.'); // Set internal success message
                setIsSignup(false); // Switch to login view after successful signup
                setLoginUsername(signupEmail); // Pre-fill login username with newly registered email (assuming email is used as username)
                setLoginPassword(''); // Clear password
                setSignupUsername(''); // Clear signup form fields
                setSignupEmail('');
                setSignupPassword('');

                setTimeout(() => {
                    setLoginSuccessMessage(''); // Clear success message after a delay
                }, 3000); // Message disappears after 3 seconds
            } else {
                // Handle error response: try to parse as JSON, fallback to text
                let errorMsg = 'Registration failed. Please try again.';
                try {
                    const errorBody = await response.json();
                    if (errorBody && errorBody.message) {
                        errorMsg = errorBody.message;
                    } else {
                        // If it's JSON but no 'message' field, stringify the whole object
                        errorMsg = JSON.stringify(errorBody);
                    }
                } catch (jsonParseError) {
                    // If response is not JSON, get it as plain text
                    const textError = await response.text();
                    errorMsg = textError || 'An unknown error occurred during registration.';
                }
                console.error('Signup failed:', response.status, errorMsg);
                setErrorMessage(errorMsg);
            }
        } catch (error) {
            console.error('Network error or unexpected issue during signup:', error);
            setErrorMessage('Could not connect to the server for registration. Please ensure the backend is running and accessible.');
        }
    };

    // Determine the heading text based on the context and current view
    const getPopupHeading = () => {
        if (isSignup) {
            return 'Sign up';
        } else if (triggerContext === 'partner') {
            return 'Sign In as Partner';
        } else {
            return 'Login';
        }
    };

    return (
        <div className={`login-popup-overlay ${isActive ? 'active' : ''}`}>
            <div className={`login-popup-content ${isActive ? 'active' : ''}`}>
                <button className="close-button" onClick={handleClose}>
                    &times;
                </button>

                {loginSuccessMessage ? (
                    <div className="login-success-container">
                        {/* Using FontAwesomeIcon for the checkmark */}
                        <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                        <p className="success-message">{loginSuccessMessage}</p>
                    </div>
                ) : (
                    <>
                        <div className="popup-top-section">
                            <div className="popup-header">
                                <h2>{getPopupHeading()}</h2> {/* Use the dynamic heading */}
                                <p className="toggle-view-link">
                                    or{' '}
                                    {isSignup ? (
                                        <a href="#" onClick={(e) => handleToggleView(e, 'login')}>
                                            login to your account
                                        </a>
                                    ) : (
                                        <a href="#" onClick={(e) => handleToggleView(e, 'signup')}>
                                            create an account
                                        </a>
                                    )}
                                </p>
                            </div>
                            <div className="popup-image">
                                <img
                                    src={"https://placehold.co/60x60/FF7F50/FFFFFF?text=🥕"} // Placeholder image for carrot
                                    alt={isSignup ? "Signup icon" : "Login icon"}
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/CCCCCC/000000?text=Error" }}
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                                {errorMessage}
                            </p>
                        )}

                        {isSignup ? (
                            <form onSubmit={handleSignupSubmit} className="popup-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="signupUsername" // Changed ID
                                        placeholder=" "
                                        value={signupUsername}
                                        onChange={(e) => setSignupUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="signupUsername">Username</label> {/* Changed label */}
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        id="signupEmail"
                                        placeholder=" "
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="signupEmail">Email</label>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="signupPassword"
                                        placeholder=" "
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="signupPassword">Password</label>
                                </div>
        
                                <button type="submit" className="popup-button">
                                    CONTINUE
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleLoginSubmit} className="popup-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="loginUsername"
                                        placeholder=" "
                                        value={loginUsername}
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="loginUsername">Username</label>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="loginPassword"
                                        placeholder=" "
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="loginPassword">Password</label>
                                </div>
                                <button type="submit" className="popup-button">
                                    LOGIN
                                </button>
                            </form>
                        )}

                        <p className="terms-policy">
                            By {isSignup ? 'creating an account' : 'clicking on Login'}, I accept the{' '}
                            <a href="#terms">Terms & Conditions</a> &{' '}
                            <a href="#policy">Privacy Policy</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
export default LoginPopup;