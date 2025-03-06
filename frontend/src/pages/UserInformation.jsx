import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import profilePic from "../assets/images/profilepic.jpg";
import comeBack from "../assets/images/comeback.png"


function UserInformation() {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
    });
    const [editData, setEditData] = useState({
        username: "",
        password: "", // Only for new password, optional
        email: "",
    });

    // fetch user data
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
                    method: "GET",
                    credentials: "include", // Use session
                });
                const data = await response.json();

                if (response.ok) {
                    setProfileData({
                        username: data.user.username,
                        email: data.user.email,
                    });
                    setEditData({
                        username: data.user.username,
                        password: "", // No password by default
                        email: data.user.email,
                    });
                } else {
                    toast.error(data.error || "Failed to load user info");
                    navigate("/login"); // Redirect to login if not authenticated
                }
            } catch (error) {
                toast.error("Error loading user info: " + error.message);
            }
        };

        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            username: profileData.username,
            password: profileData.password,
            email: profileData.email
        });
    };

    const handleSave = async () => {
        // Basic validation
        if (!editData.username.trim() || !editData.email.trim()) {
            toast.error("Username and email are required");
            return;
        }
        if (editData.email && !/^\S+@\S+\.\S+$/.test(editData.email)) {
            toast.error("Invalid email format");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: editData.username.trim(),
                    password: editData.password.trim() || undefined, // Only send if changed
                    email: editData.email.trim(),
                }),
                credentials: "include", // Use session
            });
            const data = await response.json();

            if (response.ok) {
                setProfileData({
                    username: editData.username,
                    email: editData.email,
                });
                setEditData({
                    username: editData.username,
                    password: "",
                    email: editData.email,
                });
                setIsEditing(false);
                toast.success(data.message || "Profile updated successfully!");
            } else {
                toast.error(data.error || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Error updating profile: " + error.message);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleComeback = () => {
        navigate("/dashboard");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-6 sm:px-6">
            <button onClick={handleComeback} className="flex items-center justify-center fixed w-8 h-8 top-1 left-1 bg-gray-200 rounded-[4px] hover:bg-gray-400 active:outline-none active:ring-2 active:ring-white/50 active:bg-gray-300 transition-all duration-300 ease-in-out">
                <img src={comeBack} alt="" className="w-4/5 h-4/5"></img>
            </button>
            <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">Edit your Profile</h2>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white/30 object-cover bg-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="username" className="text-white text-sm font-medium">
                                Username:
                            </label>
                            {isEditing ? (
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={editData.username}
                                    onChange={handleChange}
                                    className="col-span-2 px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                            ) : (
                                <div className="col-span-2 px-3 py-2 bg-black/30 border border-gray-700 rounded-md text-white text-sm">
                                    {profileData.username}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="password" className="text-white text-sm font-medium">
                                Password:
                            </label>
                            {isEditing ? (
                                <div className="col-span-2 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={editData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                </div>
                            ) : (
                                <div className="col-span-2 px-3 py-2 bg-black/30 border border-gray-700 rounded-md text-white text-sm">
                                    ••••••••
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="grid grid-cols-3 items-center gap-4">
                                <div></div>
                                <div className="col-span-2">
                                    <div className="flex items-center">
                                        <input
                                            id="showPassword"
                                            name="showPassword"
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={toggleShowPassword}
                                            className="h-4 w-4 bg-black/50 border-gray-600 rounded focus:ring-white/50"
                                        />
                                        <label htmlFor="showPassword" className="ml-2 block text-xs text-gray-300">
                                            Show password
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="email" className="text-white text-sm font-medium">
                                Email:
                            </label>
                            {isEditing ? (
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={editData.email}
                                    onChange={handleChange}
                                    className="col-span-2 px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                            ) : (
                                <div className="col-span-2 px-3 py-2 bg-black/30 border border-gray-700 rounded-md text-white text-sm overflow-x-auto">
                                    {profileData.email}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default UserInformation;