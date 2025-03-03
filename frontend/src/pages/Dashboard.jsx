import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Logout from "../components/Logout"
import Create from "../components/Create"

function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 relative">
            <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    Dashboard
                </h1>
                <p className="text-gray-300 text-center">
                    Welcome to your Virtual Time Capsule Dashboard! Manage your capsules here.
                </p>
                {/* Add capsule-related features later */}
            </div>
            <Logout />
            <Create />
        </div>
    );
}

export default Dashboard;