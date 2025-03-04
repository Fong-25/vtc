import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logout from "../assets/images/logout.png"
import toast, { Toaster } from 'react-hot-toast'

function Logout() {
    const navigate = useNavigate(); // Get navigation function

    const handleLogout = async () => {
        try {
            // Send request to backend logout endpoint
            const response = await fetch("http://localhost:3000/api/auth/logout", { //update later
                method: "POST",
                credentials: "include", // Ensure cookies/sessions are sent
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Logged out successfully!"); // Show success toast
                navigate("/login"); // Redirect to login page
            } else {
                toast.error(data.error || "Logout failed"); // Show error toast
            }
        } catch (error) {
            toast.error("Error logging out: " + error.message);
        }
    };

    // Use useEffect to handle any cleanup or initial checks (optional)
    useEffect(() => {
        // You could check if the user is logged in here, but for now, just handle the click
    }, []);
    return (
        <>
            <button className="w-8 h-8 absolute top-1 right-1 bg-gray-200 rounded-[4px] hover:bg-gray-400 active:outline-none active:ring-2 active:ring-white/50 active:bg-gray-300 transition-all duration-300 ease-in-out" onClick={handleLogout}>
                <img src={logout} alt="" className="w-full h-full" />
            </button>
            <Toaster />
        </>

    )
}

export default Logout