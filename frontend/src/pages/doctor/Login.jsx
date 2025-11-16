"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? "https://pcod-healthcare.onrender.com/api/doctor/auth/login"
      : "https://pcod-healthcare.onrender.com/api/doctor/auth/register";

    try {
      const response = await axios.post(endpoint, {
        email,
        password,
        ...(isLogin ? {} : { name, specialization, experience }),
      });

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("doctorId", response.data.doctorId);
        navigate("/doctor"); // change as needed
      } else {
        navigate("/create-profile", { state: { email, password } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login/Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isLogin ? "Doctor Login" : "Doctor Sign Up"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Specialization"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Experience (in years)"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-2">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
