import React from "react";

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

    return (
        <div className="p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 mb-4">
            <h3 className="text-xl font-bold text-white mb-2">
                {isLocked ? "Locked Capsule" : title} {/* Hide title if locked */}
            </h3>
            {isLocked ? (
                <p className="text-gray-300">
                    This capsule is locked until {formattedDate}. Check back later!
                </p>
            ) : (
                <>
                    <p className="text-gray-300 mb-2">{content}</p>
                    <p className="text-sm text-gray-400 mb-2">
                        Release Date: {formattedDate} ({lockStatus})
                    </p>
                </>
            )}
        </div>
    );
}

export default CapsuleCard;