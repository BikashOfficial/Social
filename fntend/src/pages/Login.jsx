import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    // Animations
    gsap.fromTo(
      ".login-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".login-heading",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
    gsap.fromTo(
      ".login-subtext",
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
      ".login-button",
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

  useEffect(() => {
    console.log("Updated user:", user);
  })



  // const submitHandlerr = async (e) => {
  //   e.preventDefault();
  //   const userData = {
  //     email,
  //     password,
  //   };

  //   const response = await axios.post(
  //     `${import.meta.env.VITE_BASE_URL}/user/login`,
  //     userData,
  //     {
  //       withCredentials: true // This is important
  //     }
  //   );

  //   if (response.status === 200) {
  //     const data = response.data;
  //     // setUser(data.user);
  //     // // console.log(data.user);
  //     // localStorage.setItem("token", data.token);
  //     // navigate("/");

  //     setUser(data.user);
  //     localStorage.setItem('token', data.token);
  //     localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
  //     navigate("/");
  //   } else {
  //     alert("Invalid email or password");
  //   }

  //   // console.log("User logged in:", user);
  //   setEmail("");
  //   setPassword("");
  // };

  const [error, setError] = useState(""); // Add this state at the top with other states

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        userData,
        {
          withCredentials: true
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/1945538809/vector/speech-bubble-talking-chatting-quote-communication-abstract-background.jpg?s=2048x2048&w=is&k=20&c=W22FjBV28QmM49IByt6ejSSuC6OYt1oUvc2WGUNHRHg=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>

        <div
          className="login-container relative m-2 z-10 w-full max-w-2xl p-8 space-y-6 rounded-xl shadow-xl"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 className="login-heading text-3xl font-extrabold text-center text-white">
            Welcome Back
          </h2>
          <p className="login-subtext text-sm text-center text-gray-400">
            Login to access your account
          </p>
          <form className="space-y-6" onSubmit={submitHandler}>
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
                className="form-input w-full px-4 py-3 mt-1 text-white bg-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
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
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
                className="form-input w-full px-4 py-3 mt-1 text-white bg-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your password"
                min={6}
                max={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="login-button w-full px-4 py-3 font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {"⚠️ "}{error}
              </div>
            )}
          </form>
          <p className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
