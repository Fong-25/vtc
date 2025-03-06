import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateCapsule() {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        releaseDate: "",
    });

    const navigate = useNavigate(); // For redirection

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.title.trim() || !formData.content.trim() || !formData.releaseDate) {
            toast.error("All fields are required");
            return;
        }

        const data = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            releaseDate: formData.releaseDate,
        };

        // console.log("Form data before submission:", data);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/capsules/create`, { // update later
                method: "POST",
                headers: { "Content-Type": "application/json" }, // Explicitly set JSON
                body: JSON.stringify(data),
                credentials: "include", // Ensure session is sent
            });
            // console.log("Response status:", response.status);
            // console.log("Response headers:", response.headers);
            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Capsule created successfully!");
                setFormData({ title: "", content: "", releaseDate: "" });
                navigate("/dashboard");
            } else {
                toast.error(result.error || "Failed to create capsule");
                navigate("/login"); // Redirect to login if not authenticated
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Error creating capsule: " + error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-6 sm:px-6">
            <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
                    Capsule
                </h2>

                <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm sm:text-base"
                            placeholder="Title"
                        />
                    </div>

                    <div>
                        <textarea
                            id="content"
                            name="content"
                            required
                            value={formData.content}
                            onChange={handleChange}
                            rows="4"
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm sm:text-base"
                            placeholder="Content"
                        ></textarea>
                    </div>

                    <div>
                        <label
                            htmlFor="releaseDate"
                            className="block text-xs sm:text-sm text-gray-300 mb-1"
                        >
                            Release Date
                        </label>
                        <input
                            id="releaseDate"
                            name="releaseDate"
                            type="date"
                            required
                            value={formData.releaseDate}
                            onChange={handleChange}
                            className="block w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm sm:text-base"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 ease-in-out text-sm sm:text-base mt-6"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateCapsule;