import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import api from "../services/api";
import { logAuth } from "../utils/debug";
import { UserDataContext } from "../context/UserContext";

const SignUp = () => {
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Animations
    gsap.fromTo(
      ".signup-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".signup-heading",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
    gsap.fromTo(
      ".signup-subtext",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );
    gsap.fromTo(
      ".form-input",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
    gsap.fromTo(
      ".signup-button",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "elastic.out(1, 0.5)",
      }
    );
  }, []);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        name,
        email,
        password,
        username
      };

      logAuth('Attempting user registration', { email, username });
      const response = await api.post(
        '/user/create',
        userData
      );

      if (response.status === 201) {
        logAuth('Registration successful');
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/");
      }
    } catch (error) {
      logAuth('Registration failed', { error: error.response?.data });
      console.error("Registration error:", error.response?.data?.error);
      alert(error.response?.data?.error || "Registration failed");
    }

    // Clear form inputs
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1945538809/vector/speech-bubble-talking-chatting-quote-communication-abstract-background.jpg?s=2048x2048&w=is&k=20&c=W22FjBV28QmM49IByt6ejSSuC6OYt1oUvc2WGUNHRHg=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Signup Card */}
      <div
        className="signup-container relative m-2 z-10 w-full max-w-2xl p-8 space-y-6 rounded-xl shadow-xl"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
          backdropFilter: "blur(10px)", // Blurry effect
        }}
      >
        <h2 className="signup-heading text-3xl font-extrabold text-center text-white">
          Create Your Account
        </h2>
        <p className="signup-subtext text-sm text-center text-gray-400">
          Join us today! Sign up to get started.
        </p>
        <form className="space-y-6" onSubmit={submitHandler}>
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
                backdropFilter: "blur(10px)", // Blurry effect
              }}
              className="form-input w-full px-4 py-3 mt-1 text-white bg-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              UserName (unique)
            </label>
            <input
              id="username"
              type="text"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
                backdropFilter: "blur(10px)", // Blurry effect
              }}
              className="form-input w-full px-4 py-3 mt-1 text-white bg-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={async (e) => {
                setUsername(e.target.value);
                if (e.target.value.length > 2) {
                  try {
                    logAuth('Checking username availability', { username: e.target.value });
                    const response = await api.get(
                      `/user/check-username/${e.target.value}`
                    );
                    if (!response.data.available) {
                      alert('Username already exists! Please choose another.');
                    }
                  } catch (error) {
                    logAuth('Error checking username', { error: error.message });
                    console.error('Error checking username:', error);
                  }
                }
              }}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
                backdropFilter: "blur(10px)", // Blurry effect
              }}
              className="form-input w-full px-4 py-3 mt-1 text-white bg-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
                backdropFilter: "blur(10px)", // Blurry effect
              }}
              className="form-input w-full px-4 py-3 mt-1 text-white bg-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {"⚠️ "}{error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-button w-full px-4 py-3 font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        {/* Already Have an Account? */}
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
