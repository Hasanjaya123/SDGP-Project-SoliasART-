import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Icon for the Google button

const SignupPage = () => {

    const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    // This is the main container for the page
    <div className="flex min-h-screen w-full bg-white">
      
      {/*The Form */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2">
        <h1>Form goes here</h1>
      </div>

      {/*The Image */}
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