import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CapsuleCard from "../components/CapsuleCard"; // Import CapsuleCard
import Logout from "../components/Logout";
import Create from "../components/Create"; // Assuming this is a component for creating capsules
import UserNavigate from "../assets/images/user.png"

function Dashboard() {
    const [capsules, setCapsules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCapsules = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/capsules/user`, {
                    method: "GET",
                    credentials: "include", // Ensure session is sent
                });
                const data = await response.json();
                // console.log("Fetched capsules data:", data); // Log the response data

                if (response.ok) {
                    setCapsules(data.capsules || []);
                } else {
                    toast.error(data.error || "Failed to load capsules");
                    navigate("/login"); // Redirect to login if not authenticated
                }
            } catch (error) {
                console.error("Error loading capsules:", error);
                toast.error("Error loading capsules: " + error.message);
                navigate("/login"); // Redirect on error
            }
        };

        fetchCapsules();
    }, [navigate]);

    const handleDeleteCapsule = (capsuleId) => {
        // console.log("Deleting capsule with ID:", capsuleId); // Log the ID being deleted
        setCapsules(capsules.filter((capsule) => capsule._id !== capsuleId));
    };

    const handleInfo = () => {
        navigate("/info");
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 relative">
            <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 my-5">
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    Dashboard
                </h1>
                <p className="text-gray-300 text-center mb-6">
                    Welcome to your Virtual Time Capsule Dashboard! Manage your capsules here.
                </p>

                {/* Capsule cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                    {capsules.length > 0 ? (
                        capsules.map((capsule) => (
                            <CapsuleCard
                                key={capsule._id} // Use MongoDB _id or a unique identifier
                                id={capsule._id} // Pass the MongoDB _id
                                title={capsule.title}
                                content={capsule.content}
                                releaseDate={capsule.releaseDate}
                                onDelete={handleDeleteCapsule} // Pass delete callback
                            />
                        ))
                    ) : (
                        <p className="text-gray-300 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">No capsules yet. Create one!</p>
                    )}
                </div>
            </div>
            <button onClick={handleInfo} className="flex items-center justify-center fixed w-8 h-8 bottom-1 right-1 bg-gray-200 rounded-[4px] hover:bg-gray-400 active:outline-none active:ring-2 active:ring-white/50 active:bg-gray-300 transition-all duration-300 ease-in-out">
                <img src={UserNavigate} alt="" className="w-4/5 h-4/5"></img>
            </button>
            <Logout />
            <Create />
            <Toaster />
        </div>
    );
}

export default Dashboard;