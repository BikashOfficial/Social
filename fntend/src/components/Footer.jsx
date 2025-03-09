import React from 'react'

const Footer = () => {
  return (
    <div><footer className="mt-2 py-10 bg-gray-900 text-gray-300 w-full text-center shadow-lg flex flex-col items-center">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-10 w-full max-w-6xl text-left">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">About Us</h3>
        <p className="text-sm">SocialApp is your go-to platform for seamless communication and networking with friends and communities worldwide.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
        <ul className="text-sm space-y-2">
          <li><a href="#" className="hover:text-white">Home</a></li>
          <li><a href="#" className="hover:text-white">Features</a></li>
          <li><a href="#" className="hover:text-white">Pricing</a></li>
          <li><a href="#" className="hover:text-white">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">Twitter</a>
          <a href="#" className="hover:text-white">Instagram</a>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Subscribe</h3>
        <input type="email" placeholder="Enter your email" className="px-4 py-2 w-full rounded-lg text-white border-2 border-gray-500" />
        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Subscribe</button>
      </div>
    </div>
    <div className="mt-6 text-sm text-gray-500">&copy; 2025 SocialApp. All rights reserved.</div>
  </footer></div>
  )
}

export default Footer