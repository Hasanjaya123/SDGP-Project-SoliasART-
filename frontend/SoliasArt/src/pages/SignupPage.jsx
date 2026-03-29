import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { api } from '../services/uploadApi';

// SignupPage: Manages new user registration
const SignupPage = () => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 transition-colors";

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic form validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.agreeToTerms) {
            setError("You must agree to the terms and conditions");
            return;
        }

        setLoading(true);

        try {
            // Call backend signup API
            const response = await api.post('/auth/signup', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            });

            const data = response.data;

            alert(`Registration Successful!\n\nPlease check your email inbox for a verification link to activate your account.`);

            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirmPassword: '',
                agreeToTerms: false,
            });

        } catch (err) {
            setError(err.response?.data?.detail || err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* --- Signup Form Section --- */}
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
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className={`${inputClass} pr-12`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                                <div
                                    role="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    className={`${inputClass} pr-12`}
                                    required
                                />
                                <div
                                    role="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>
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

            {/* --- Side Decorative Image --- */}
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