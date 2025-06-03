import React from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext is in parent directory's context folder

function AdminDashboard() {
    const auth = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome, Admin! You are logged in as: <span className="font-semibold">{auth.userEmail}</span></p>
            <p className="text-md text-gray-500 mb-4">Your role: <span className="font-semibold text-blue-600">{auth.userRole}</span></p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Manage Users</h2>
                    <p className="text-gray-600 mb-4">View, add, edit, or delete user accounts.</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">Go to User Management</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Manage Restaurants</h2>
                    <p className="text-gray-600 mb-4">Approve new restaurants, update existing ones.</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300">Go to Restaurant Management</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">View Orders</h2>
                    <p className="text-gray-600 mb-4">Monitor all orders and their statuses.</p>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors duration-300">View All Orders</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">System Settings</h2>
                    <p className="text-gray-600 mb-4">Configure application-wide settings.</p>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300">Adjust Settings</button>
                </div>
            </div>

            <button
                onClick={auth.logout}
                className="mt-10 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors duration-300 text-lg font-semibold"
            >
                Logout
            </button>
        </div>
    );
}

export default AdminDashboard;
