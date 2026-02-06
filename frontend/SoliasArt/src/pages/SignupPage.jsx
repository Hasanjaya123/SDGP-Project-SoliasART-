import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Icon for the Google button

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
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  // State for tracking API request loading status
  const [loading, setLoading] = useState(false);
  
  // State for storing and displaying error messages
  const [error, setError] = useState(null);

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
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST', // POST request to create new user
        headers: {
          'Content-Type': 'application/json',
        },
        // Transform full name into first and last name for backend
        body: JSON.stringify({
          first_name: formData.full_name.split(' ')[0],
          last_name: formData.full_name.split(' ')[1] || '-',
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json(); // Parse response from server

      // Check if request was successful
      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      // Additional error check (redundant - could be removed)
      if (!response.ok) throw new Error(data.detail);

      // Display success message to user
      alert("Success! Account created.");

    } catch (err) {
      // Catch and display any errors that occurred during signup
      setError(err.message);
    } finally {
      // Re-enable the form after request completes (success or error)
      setLoading(false);
    }
  };

  return (
    // Main container: flexbox layout with full screen height and white background
    <div className="flex min-h-screen w-full bg-white">
      
      {/* Form Section: Takes up 100% on mobile, 50% on medium+ screens */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2">
        <div className="w-full max-w-md mx-auto">
          <h2 className="md-8 text-3xl font-bold text-gray-800 mb-6">
            Create Your Account</h2>
          </div>
      </div>

      {/* Image Section: Hidden on mobile, visible on medium+ screens (right half) */}
      <div className="hidden w-1/2 md:block">
        <img 
          src="./src/assets/Sign Up.jpg" 
          alt="Decoration"
          className="h-full w-full object-cover rounded-bl-[30px] rounded-tl-[30px]" 
        />
      </div>

    </div>
  );
};


export default SignupPage;