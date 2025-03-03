import React from "react";

function CapsuleCard({ title, content, releaseDate, media }) {
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
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 mb-2">{content}</p>
            <p className="text-sm text-gray-400 mb-2">
                Release Date: {formattedDate} ({lockStatus})
            </p>

            {media && (
                <div className="mt-2">
                    {media.startsWith("/uploads/") && media.includes(".jpg") && (
                        <img
                            src={`http://localhost:3000${media}`} // Adjust based on backend URL
                            alt={`${title} preview`}
                            className="max-h-40 rounded-md object-cover"
                        />
                    )}
                    {media.startsWith("/uploads/") && media.includes(".mp4") && (
                        <video
                            controls
                            className="max-h-40 rounded-md"
                        >
                            <source
                                src={`http://localhost:3000${media}`} // Adjust based on backend URL
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            )}
        </div>
    );
}

export default CapsuleCard;