import React from 'react'
import { Link } from 'react-router-dom'

const StartHeader = () => {
  return (
    <div>
        <header className="w-full fixed top-0 left-0 bg-transparent rounded-bl-2xl rounded-br-2xl backdrop-blur-lg shadow-lg py-4 px-6 flex justify-between items-center border-3 border-transparent animate-border-glow z-10">
                <Link to='/'><h1 className="text-2xl font-bold text-blue-600">SocialApp</h1></Link>
                <nav className="flex space-x-4">
                    <Link to='/login' className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">Sign In</Link>
                    <Link to='/register' className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700">Register</Link>
                </nav>
            </header>
    </div>
  )
}

export default StartHeader