import { useNavigate } from "react-router-dom";
import add from "../assets/images/add.png"

function Create() {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate("/create-capsule")
    }
    return (

        <>
            <button className="w-8 h-8 absolute top-1 left-1 bg-gray-200 rounded-[4px] hover:bg-gray-400 active:outline-none active:ring-2 active:ring-white/50 active:bg-gray-300 transition-all duration-300 ease-in-out" onClick={handleClick}>
                <img src={add} alt="" className="w-full h-full" />
            </button>
        </>

    )
}

export default Create