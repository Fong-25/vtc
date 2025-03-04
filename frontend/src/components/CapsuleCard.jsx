import React from "react";
import lock from "../assets/images/lock.png";
import unlock from "../assets/images/unlock.png";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function CapsuleCard({ title, content, releaseDate }) {
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

    return (
        <div className="p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 mb-4 transition-all duration-500 ease-in-out">
            <img src={isLocked ? lock : unlock} alt="" className="fixed h-7 w-7 rounded-md bg-white/10 backdrop-blur-lg right-[2px] top-[2px]" />
            <h3 className="text-xl font-bold text-white mb-2">
                {isLocked ? "Locked Capsule" : title} {/* Hide title if locked */}
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
                        {isOpen ? "▼ Close" : "► Open"} {/* Arrow icons (▼ for down, ► for right) */}
                    </button>
                    {isOpen && (
                        <>
                            <p className="text-gray-300 mb-2 text-[15px]">{content}</p>
                            <p className="text-xs text-gray-400 mb-1">
                                Release Date: {formattedDate} ({lockStatus})
                            </p>
                        </>
                    )}
                </>
            )}

        </div>
    );
}

export default CapsuleCard;