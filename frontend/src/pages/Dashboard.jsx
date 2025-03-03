import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CapsuleCard from "../components/CapsuleCard"; // Import CapsuleCard
import Logout from "../components/Logout";
import Create from "../components/Create"; // Assuming this is a component for creating capsules

function Dashboard() {
    const [capsules, setCapsules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCapsules = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/capsules/user", {
                    method: "GET",
                    credentials: "include", // Ensure session is sent
                });
                const data = await response.json();

                if (response.ok) {
                    setCapsules(data.capsules || []); // Assuming backend returns { capsules: [...] }
                } else {
                    toast.error(data.error || "Failed to load capsules");
                    navigate("/login"); // Redirect to login if not authenticated
                }
            } catch (error) {
                toast.error("Error loading capsules: " + error.message);
                navigate("/login"); // Redirect on error
            }
        };

        fetchCapsules();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 relative">
            <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 my-5">
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    Dashboard
                </h1>
                <p className="text-gray-300 text-center mb-6">
                    Welcome to your Virtual Time Capsule Dashboard! Manage your capsules here.
                </p>

                {/* Responsive grid of CapsuleCards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {capsules.length > 0 ? (
                        capsules.map((capsule) => (
                            <CapsuleCard
                                key={capsule._id} // Use MongoDB _id or a unique identifier
                                title={capsule.title}
                                content={capsule.content}
                                releaseDate={capsule.releaseDate}
                                media={capsule.media} // Path to image/video
                            />
                        ))
                    ) : (
                        <p className="text-gray-300 text-center">No capsules yet. Create one!</p>
                    )}
                </div>

                {/* Create button (assuming Create is a component for navigation) */}

            </div>
            <Logout />
            <Create />
            <Toaster /> {/* Ensure Toaster is here for toasts */}
        </div>
    );
}

export default Dashboard;