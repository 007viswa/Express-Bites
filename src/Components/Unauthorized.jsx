// Components/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Assuming Header is in the same directory
import Footer from './Footer'; // Assuming Footer is available

function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header /> {/* Display header */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied!</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        You do not have the proper authorization to view this page.
                        Kindly log in with appropriate credentials.
                    </p>
                    <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors duration-300 text-lg font-semibold">
                        Go to Home
                    </Link>
                </div>
            </main>
            <Footer /> {/* Display footer */}
        </div>
    );
}

export default Unauthorized;
