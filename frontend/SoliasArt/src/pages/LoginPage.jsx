import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Icon for the Google button


const LoginPage = () => {

    // --- 1. STATE (The Brain) ---
  // State for managing form input values for login
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false, // New field for 'Remember for 30 days'
  });

  // State for tracking API request loading status
  const [loading, setLoading] = useState(false);

  // State for storing and displaying error messages
  const [error, setError] = useState(null);

  // --- 2. HANDLERS (The Logic) ---
  /**
   * handleChange: Updates form state when user types in input fields
   * Same generic handler used in the signup form.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * handleSubmit: Form submission handler for login
   * Calls the backend login API and handles responses.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);     // Clear any previous errors
    setLoading(true);   // Disable form button

    try {
      // Send login request to backend API
      // Assuming your backend has a corresponding '/auth/login' endpoint
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send email, password, and rememberMe state
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(data.detail || "Failed to login");
      }

      // Display success message (In a real app, you would redirect or store a token here)
      alert(`Success! Logged in.`);

    } catch (err) {
      // Catch and display any errors that occurred during login
      setError(err.message || "An unexpected error occurred");
    } finally {
      // Re-enable the form after request completes
      setLoading(false);
    }
  };

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 transition-colors";
    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* LEFT SIDE: Form Container */}
            <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-24">
                <div className="mx-auto w-full max-w-md">
                    <h2 className="mb-2 text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mb-8 text-sm text-gray-600">
                        Enter your Credentials to access your account
                    </p>
                            {/* Error Message Box */}
                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email Field */}
                    <div className="flex flex-col">
                    <label className="mb-1 text-sm font-semibold text-gray-700">Email address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className={inputClass}
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                    </div>

                    {/* Password Field with "Forgot password" link */}
                    <div className="flex flex-col">
                    <div className="mb-1 flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <a href="/forgot-password" className="text-xs text-[#C58940] hover:underline">
                        forgot password
                        </a>
                    </div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={inputClass}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                    </div>

                    {/* "Remember for 30 days" Checkbox */}
                    <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-yellow-600 focus:ring-yellow-600 accent-[#C58940]"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                    />
                    <label htmlFor="rememberMe" className="cursor-pointer select-none text-sm text-gray-600">
                        Remember for 30 days.
                    </label>
                    </div>

                    {/* Login Button */}
                    <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-lg bg-[#C58940] py-3 font-bold text-white transition hover:bg-[#b07836] disabled:opacity-50"
                    >
                    {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-sm text-gray-400">Or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Google Sign-In Button */}
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <FcGoogle className="text-xl" />
                    Sign in with Google
                </button>

                {/* Link to Sign Up Page */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-semibold text-[#C58940] hover:underline">
                    Sign Up
                    </a>
                </p>

                </div>
            </div>
            {/* RIGHT SIDE: The Image (Width 50%) */}
                <div className="hidden w-1/2 md:block">
                    <img 
                    src="./src/assets/Sign In.jpg" 
                    alt="Decoration" 
                    className="h-full w-full object-cover rounded-bl-[20px] rounded-tl-[20px]"
                    />
            </div>
        </div>
    );
}

export default LoginPage;