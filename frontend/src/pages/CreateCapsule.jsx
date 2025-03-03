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

    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const navigate = useNavigate(); // For redirection

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create preview for images
            if (selectedFile.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreview(e.target.result);
                };
                reader.readAsDataURL(selectedFile);
            } else if (selectedFile.type.startsWith("video/")) {
                // For video, we'll just display the file name
                setFilePreview(null);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("releaseDate", formData.releaseDate);
        if (file) {
            data.append("media", file);
        }

        console.log("Form data:", formData);
        console.log("File:", file);

        try {
            const response = await fetch("http://localhost:3000/api/capsules/create", {
                method: "POST",
                body: data,
                credentials: "include", // Ensure session is sent
            });
            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Capsule created successfully!");
                setFormData({ title: "", content: "", releaseDate: "" });
                setFile(null);
                setFilePreview(null);
                navigate("/dashboard");
            } else {
                toast.error(result.error || "Failed to create capsule");
            }
        } catch (error) {
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

                    <div className="space-y-2">
                        <label
                            htmlFor="media"
                            className="block text-xs sm:text-sm text-gray-300 mb-1"
                        >
                            Upload Image or Video
                        </label>
                        <input
                            id="media"
                            name="media"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 focus:outline-none"
                        />

                        {filePreview && (
                            <div className="mt-2">
                                <img
                                    src={filePreview}
                                    alt="Preview"
                                    className="max-h-40 rounded-md"
                                />
                            </div>
                        )}

                        {file && file.type.startsWith("video/") && (
                            <div className="mt-2 text-sm text-gray-300">
                                Video selected: {file.name}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 ease-in-out text-sm sm:text-base mt-6"
                    >
                        Submit
                    </button>
                </form>
            </div>
            <Toaster />
        </div>
    );
}

export default CreateCapsule;