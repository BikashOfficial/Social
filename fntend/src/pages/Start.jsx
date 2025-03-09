
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import Footer from '../components/Footer';
import StartHeader from '../components/StartHeader';

const testimonials = [
  { text: "SocialApp has changed how I connect with my friends. The interface is so smooth!", author: "Alex Smith" },
  { text: "I love the real-time chat feature. It makes staying in touch effortless!", author: "Maria Johnson" },
  { text: "A fantastic platform with an intuitive design and great features!", author: "John Doe" },
  { text: "The best social app out there. Highly recommend!", author: "Sarah Lee" },
  { text: "Simple, sleek, and user-friendly. Love it!", author: "Michael Brown" }
];
const Start = () => {
  return (

    <>
    <StartHeader/>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center relative">
      
      <main className="flex flex-col items-center text-center mt-32 px-4 w-full max-w-6xl">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">Connect with the world</h2>
        <p className="text-gray-600 text-lg mb-6 max-w-xl">
          Join our social media platform to connect, share, and interact with people around the globe.
        </p>
        <Link to='/login' className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300">
          Get Started
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center">
            <img src="https://static.thenounproject.com/png/214735-200.png" alt="Create Posts" className="w-20 h-20 mb-4" />
            <h3 className="text-xl font-semibold text-blue-600">Create Posts</h3>
            <p className="text-gray-600 mt-2 text-center">Share your thoughts, images, and videos with friends and the community.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center">
            <img src="https://cdn-icons-png.freepik.com/256/14722/14722347.png?semt=ais_hybrid" alt="Follow Friends" className="w-20 h-20 mb-4" />
            <h3 className="text-xl font-semibold text-blue-600">Follow Friends</h3>
            <p className="text-gray-600 mt-2 text-center">Connect with your friends and see what they are up to in real-time.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col items-center">
            <img src="https://thumbs.dreamstime.com/b/group-people-logo-handshake-circle-teamwork-icon-vector-illustrator-150899205.jpg" alt="Join Groups" className="w-20 h-20 mb-4" />
            <h3 className="text-xl font-semibold text-blue-600">Join Groups</h3>
            <p className="text-gray-600 mt-2 text-center">Discover and join groups that match your interests and engage with like-minded people.</p>
          </div>
        </div>
      </main>


      <section className="py-16 px-4 w-full max-w-6xl text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-6">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h4 className="text-xl font-semibold text-blue-600">Real-time Messaging</h4>
            <p className="text-gray-600 mt-2">Chat with friends instantly using our seamless messaging feature.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h4 className="text-xl font-semibold text-purple-600">Customizable Profiles</h4>
            <p className="text-gray-600 mt-2">Personalize your profile to reflect your unique style and interests.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h4 className="text-xl font-semibold text-green-600">Secure & Private</h4>
            <p className="text-gray-600 mt-2">We prioritize your privacy with end-to-end encryption.</p>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-16 px-4 w-full max-w-6xl text-center overflow-hidden">
        <h3 className="text-4xl font-bold text-gray-800 mb-6">What Users Say</h3>
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={{ x: [-1000, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-lg inline-block min-w-[300px]">
                <p className="text-gray-600">&quot;{testimonial.text}&quot;</p>
                <span className="block mt-4 font-semibold">- {testimonial.author}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* <Link to='/home' className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">Home</Link> */}

      

      <style>{`
        @keyframes borderGlow {
          0% { border-color: rgba(0, 255, 255, 0.5); }
          25% { border-color: rgba(255, 0, 255, 0.5); }
          50% { border-color: rgba(255, 165, 0, 0.5); }
          75% { border-color: rgba(0, 255, 0, 0.5); }
          100% { border-color: rgba(0, 255, 255, 0.5); }
        }
        .animate-border-glow {
          animation: borderGlow 3s infinite linear;
        }
      `}</style>
    </div>
    <Footer/>
    </>
  )
}

export default Start