import React from "react";
import lock from "../assets/images/lock.png";
import unlock from "../assets/images/unlock.png";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import deleteIcon from "../assets/images/delete.png";

function CapsuleCard({ title, content, id, releaseDate, onDelete }) {
    // Format release date for display
    const formattedDate = new Date(releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Check if capsule is locked or unlocked
    const isLocked = new Date(releaseDate) > new Date();
    const lockStatus = isLocked ? "Locked" : "Unlocked";

    // State to toggle content visibility (default closed for unlocked capsules)
    const [isOpen, setIsOpen] = useState(false);

    // Handle toggle (only for unlocked capsules)
    const handleToggle = () => {
        if (!isLocked) {
            setIsOpen(!isOpen);
        }
    };

    // Handle delete (send request to backend and call onDelete callback)
    const handleDelete = async () => {
        if (!id) {
            toast.error("Capsule ID is missing");
            console.error("Capsule ID is undefined:", { title, releaseDate }); // Log capsule details if ID is missing
            return;
        }

        if (window.confirm("Are you sure you want to delete this capsule?")) {
            try {
                // console.log("Attempting to delete capsule with ID:", id); // Log the ID being sent
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/capsules/${id}`, {
                    method: "DELETE",
                    credentials: "include", // Ensure session is sent
                });
                console.log("Delete response status:", response.status); // Log response status
                // console.log("Delete response headers:", response.headers); // Log headers
                const data = await response.json();

                if (response.ok) {
                    toast.success(data.message || "Capsule deleted successfully!");
                    onDelete(id); // Callback to remove the card from Dashboard state
                } else {
                    toast.error(data.error || "Failed to delete capsule");
                    console.error("Delete response error:", data); // Log the error response
                }
            } catch (error) {
                toast.error("Error deleting capsule: " + error.message);
                console.error("Delete fetch error:", error); // Log the full error
            }
        }
    };

    return (
        <div className="p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 mb-4 transition-all duration-500 ease-in-out">
            <img src={isLocked ? lock : unlock} alt="" className="fixed h-7 w-7 rounded-md bg-white/10 backdrop-blur-lg right-[2px] top-[2px]" />
            <h3 className="text-lg font-bold text-white mb-2">
                {isLocked ? "Locked Capsule" : title}
            </h3>
            {isLocked ? (
                <p className="text-gray-300">
                    This capsule is locked until {formattedDate}. Check back later!
                </p>
            ) : (
                <>
                    <button
                        onClick={handleToggle}
                        className="text-white text-[13px] mb-2 flex items-center hover:text-gray-300 transition-colors"
                        aria-label={isOpen ? "Close capsule" : "Open capsule"}
                    >
                        {isOpen ? "▼ Close" : "► Open"}
                    </button>
                    <div
                        className={`overflow-hidden transition duration-500 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"
                            }`}
                    >
                        {isOpen && (
                            <>
                                <p className="text-gray-300 mb-2 text-[16px]">{content}</p>
                                <p className="text-[10px] text-gray-400 mb-2">
                                    Release Date: {formattedDate} ({lockStatus})
                                </p>
                            </>
                        )}
                    </div>
                </>
            )}
            <button className="fixed h-7 w-7 rounded-md bg-white/10 backdrop-blur-lg right-[2px] bottom-[2px] flex items-center justify-center hover:bg-white/20 active:bg-white-50">
                <img src={deleteIcon} onClick={handleDelete} alt="" className="w-4 h-4" />
            </button>
        </div>
    );
}
export default CapsuleCard;