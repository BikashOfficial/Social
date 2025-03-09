import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'


const Header = () => {

    const { logout } = useContext(UserDataContext);
    const navigate = useNavigate();


    const handleLogout = async () => {
        // logout();
        // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`);
        // console.log(response.data);
        // navigate('/start');
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/logout`,
                { withCredentials: true }
            );
            if (response.status === 200) {
                logout(); // This calls the context logout function
                navigate('/start');
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <div>
            <header className="w-full fixed top-0 left-0 bg-transparent rounded-bl-2xl rounded-br-2xl backdrop-blur-lg shadow-lg py-4 px-6 flex justify-between items-center border-3 border-transparent animate-border-glow z-10">
                <Link to='/'><h1 className="text-2xl font-bold text-blue-600">SocialApp</h1></Link>
                {/* <Link to='/'><h1 className="instagram-logo">SocialApp</h1></Link> */}

                <nav className="flex space-x-4">

                    <div className="hover:opacity-90 p-1 cursor-pointer border rounded-full">
                        <a href="/notifications" title="Notifications"><img className='size-6' src="https://img.icons8.com/?size=100&id=BaKtTlZJIFTy&format=png&color=000000" alt="" /></a>
                        {/* <a href="/notifications" title="Notifications"><img className='size-7' src="https://img.icons8.com/?size=100&id=uy0H1Jw7eWTb&format=png&color=000000" alt="" /></a> */}

                    </div>
                    {/* <Link to='/login' className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">Sign In</Link> */}
                    {/* <Link to="#" ><img className='h-8' src="https://img.icons8.com/?size=100&id=114043&format=png&color=000000" alt="" /></Link>  */}
                    <button onClick={handleLogout}>
                        <img
                            className='h-8 cursor-pointer hover:opacity-80 transition-opacity'
                            src="https://img.icons8.com/?size=100&id=114043&format=png&color=000000"
                            alt="Logout"
                        />
                    </button>
                </nav>
            </header>
        </div>
    )
}

export default Header