import React from 'react'
import { useLocation } from 'react-router-dom'


const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => {
        return currentPath === path ? "bg-gray-700" : "";
    };
    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block mt-18 fixed top-0 left-0 w-64 h-screen border-r bg-gray-800 text-white p-4">
                <nav>
                    <ul className="space-y-4">
                        <li className={`flex items-center ${isActive('/')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <span className="mr-4"><img className='size-7' src="https://img.icons8.com/?size=100&id=103183&format=png&color=000000" alt="" /></span>
                            <a href="/">Home</a>
                        </li>
                        <li className={`flex items-center ${isActive('/explore')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <span className="mr-4"><img className='size-6' src="https://img.icons8.com/?size=100&id=WES9yWocEh5g&format=png&color=000000" alt="" /></span>
                            <a href="/explore">Explore</a>
                        </li>
                        <li className={`flex items-center ${isActive('/upload')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <span className="mr-4"><img className='size-6' src="https://img.icons8.com/?size=100&id=uy0H1Jw7eWTb&format=png&color=000000" alt="" /></span>
                            <a href="/upload">add New Post</a>
                        </li>
                        <li className={`flex items-center ${isActive('/messages')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <span className="mr-4"><img className='size-6' src="https://img.icons8.com/?size=100&id=OVhNF7HVOQGe&format=png&color=000000" alt="" /></span>
                            <a href="/messages">Messages</a>
                        </li>
                        <li className={`flex items-center ${isActive('/profile')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <span className="mr-4"><img className='size-6' src="https://img.icons8.com/?size=100&id=IBgUXg3MQlTW&format=png&color=000000" alt="" /></span>
                            <a href="/profile">Profile</a>
                        </li>

                    </ul>
                </nav>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="block md:hidden fixed bottom-0 opacity-98 left-0 w-full rounded-tl-2xl rounded-tr-2xl bg-gray-800 text-white p-2 py-3">
                <nav>
                    <ul className="flex justify-around items-center">
                        <li className={`${isActive('/')} hover:shadow-amber-100 p-2 rounded-lg cursor-pointer`}>
                            <a href="/" title="Home"><img className='size-8' src="https://img.icons8.com/?size=100&id=103183&format=png&color=000000" alt="" /></a>
                        </li>
                        <li className={`${isActive('/explore')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <a href="/explore" title="Explore"><img className='size-6' src="https://img.icons8.com/?size=100&id=WES9yWocEh5g&format=png&color=000000" alt="" /></a>
                        </li>
                        <li className={`${isActive('/upload')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <a href="/upload" title="Notifications"><img className='size-7' src="https://img.icons8.com/?size=100&id=uy0H1Jw7eWTb&format=png&color=000000" alt="" /></a>
                        </li>
                        <li className={`${isActive('/messages')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <a href="/messages" title="Messages"><img className='size-7' src="https://img.icons8.com/?size=100&id=OVhNF7HVOQGe&format=png&color=000000" alt="" /></a>
                        </li>
                        <li className={`${isActive('/profile')} hover:bg-gray-700 p-2 rounded-lg cursor-pointer`}>
                            <a href="/profile" title="Profile"><img className='size-7' src="https://img.icons8.com/?size=100&id=IBgUXg3MQlTW&format=png&color=000000" alt="" /></a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Sidebar