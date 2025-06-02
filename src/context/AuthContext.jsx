import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [userEmail, setUserEmail] = useState(null); // This will actually be the username (name field)

    // Helper function to decode JWT payload
    const decodeJwt = useCallback((token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedToken = decodeJwt(token);
            if (decodedToken && decodedToken.sub) { // 'sub' typically holds the username/email
                setJwtToken(token);
                setUserEmail(decodedToken.sub); // Set user email from token (which is the username)
                // Extract roles from the decoded token
                if (decodedToken.roles) {
                    setUserRole(decodedToken.roles);
                    console.log('AuthContext: Initialized from localStorage - Logged in as', decodedToken.sub, 'with roles:', decodedToken.roles);
                } else {
                    console.warn('AuthContext: JWT token found but no roles claim.');
                    setUserRole(null); // Ensure role is null if not found
                }
                setIsLoggedIn(true);
            } else {
                // Token invalid or missing sub, clear local storage
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole'); // Ensure this is also cleared
                console.log('AuthContext: Invalid token in localStorage. Not logged in.');
            }
        } else {
            console.log('AuthContext: No token found in localStorage. Not logged in.');
        }
    }, [decodeJwt]);

    const login = (token) => { // Now only accepts token
        localStorage.setItem('jwtToken', token);
        const decodedToken = decodeJwt(token);
        if (decodedToken && decodedToken.sub) {
            setJwtToken(token);
            setUserEmail(decodedToken.sub); // Set user email (username)
            if (decodedToken.roles) {
                setUserRole(decodedToken.roles);
                localStorage.setItem('userRole', decodedToken.roles); // Store role in localStorage
                console.log('AuthContext: User logged in as', decodedToken.sub, 'with roles:', decodedToken.roles);
            } else {
                console.warn('Login: JWT token provided but no roles claim.');
                setUserRole(null);
                localStorage.removeItem('userRole');
            }
            setIsLoggedIn(true);
        } else {
            console.error("Login: Could not decode token or 'sub' claim missing.");
            logout(); // Logout if token is bad
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        setJwtToken(null);
        setUserRole(null);
        setUserEmail(null); // Clear user email on logout
        setIsLoggedIn(false);
        console.log('AuthContext: User logged out.');
    };

    const authContextValue = {
        isLoggedIn,
        userRole,
        jwtToken,
        userEmail, // Provide user email (username) in context
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};