import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Icon for the Google button
import { api } from '../services/uploadApi';

/**
 * SignupPage Component
 * Displays a user registration form with fields for name, email, password, and terms agreement.
 * Handles form submission to the backend API for creating new user accounts.
 */
const SignupPage = () => {

  // State for managing form input values
  // - full_name: User's complete name
  // - email: User's email address
  // - password: User's password
  // - confirmPassword: Password confirmation for validation
  // - agreeToTerms: Checkbox for terms and conditions agreement
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  // State for tracking API request loading status
  const [loading, setLoading] = useState(false);
  
  // State for storing and displaying error messages
  const [error, setError] = useState(null);

  // Tailwind CSS classes for input fields (reusable styling)
  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 transition-colors";

  /**
   * handleChange: Updates form state when user types in input fields
   * @param {Event} e - The change event from input/checkbox elements
   * 
   * For regular inputs: captures the 'value' property
   * For checkboxes: captures the 'checked' property to determine true/false state
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  /**
   * handleSubmit: Form submission handler
   * Validates form data, calls the backend signup API, and handles responses
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null); // Clear any previous error messages

    // Validation 1: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validation 2: Check if user agreed to terms and conditions
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setLoading(true); // Disable form to prevent multiple submissions

    try {

      // Send signup request to backend API
      const response = await api.post('/auth/signup', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data; // Server response data

      // Display success message to user with their full name
       alert(`Registration Successful!\n\nPlease check your email inbox for a verification link to activate your account.`);
      
      // Clear form after successful signup
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });

    } catch (err) {
      // Catch and display any errors that occurred during signup
      setError(err.response?.data?.detail || err.message || "An unexpected error occurred");
    } finally {
      // Re-enable the form after request completes (success or error)
      setLoading(false);
    }
  };

  return (
    // This is the main container for the page - flex layout with form on left, fixed image on right
    <div className="flex min-h-screen w-full bg-white">
      
      {/* The Form - scrollable on its own */}
       <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:px-24 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
                Get Started Now
            </h2>
            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" name="signup" method="POST">
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-semibold text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name"
                        className={inputClass}
                        value={formData.first_name}
                        onChange={handleChange}
                        autoComplete="given-name"
                        required
                    />

                </div>

                <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Enter your last name"
                            className={inputClass}
                            value={formData.last_name}
                            onChange={handleChange}
                            autoComplete="family-name" 
                            required
                        />
                    </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-semibold text-gray-700">Email Address</label>
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



                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-semibold text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className={inputClass}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>

                    {/* Confirm Password Input */}

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"      // <--- MUST match state key
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className={inputClass}      // Re-using our style variable!
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="agreeToTerms"
                        id="terms"
                        className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-600 cursor-pointer accent-yellow-600"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                        I agree to the terms & policy
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-lg bg-[#C58940] py-3 font-bold text-white transition hover:bg-[#b07836] disabled:opacity-50"
                >
                    {loading ? 'Signing up...' : 'Signup'}
                </button>
            </form>

            <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 text-sm text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
                <FcGoogle className="text-xl" />
                Sign in with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-600">
                Have an account?{' '}
                <a href="/login" className="font-semibold text-[#C58940] hover:underline">
                Sign In
                </a>
            </p>
        </div>
      </div>

      {/* The Image - fixed on right side, doesn't scroll */}
      <div className="hidden w-1/2 md:flex md:fixed md:right-0 md:top-0 md:h-screen md:items-center md:justify-center">
        <img 
            src="/SignUp.jpg"
            alt="Decoration"
            className="h-full w-full object-cover rounded-bl-[20px] rounded-tl-[20px]" 
        />
      </div>

    </div>

    
  );
};

export default SignupPage;