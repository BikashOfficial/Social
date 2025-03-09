import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="text-center p-10 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-xl">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 animate-pulse">404</h1>
                <p className="text-4xl font-semibold text-[#fff7] mt-4">Bad Request 😭</p>
                <p className="text-2xl font-semibold text-[#fff7] mt-4">Page Not Found</p>
                <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
                <a href="/" className="mt-6 inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold rounded-full shadow-lg hover:shadow-2xl hover:from-gray-600 hover:to-gray-800 transition duration-300 transform hover:scale-110">
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;