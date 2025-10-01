'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthServices from '@/lib/api/services/AuthServices';
import Image from 'next/image';

const RegisterPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fullnameError, setFullnameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);  // Loading state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // Success message state
  const router = useRouter();

  // Simple form validation
  const validateForm = () => {
    let isValid = true;
    setFullnameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Validate full name
    if (!fullname) {
      setFullnameError("Full Name is required");
      isValid = false;
    }

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form before submission
    if (!validateForm()) return;

    // Set loading to true before starting the registration process
    setLoading(true);

    try {
      // Call the doRegister function
      const registerResponse = await AuthServices.doRegister(fullname, email, password);

      if (registerResponse.success) {
        // Show success message and set a timer to redirect after 7 seconds
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 5000);  // Redirect after 5 seconds
      } else {
        // Display error if registration fails
        setError(registerResponse.message);
      }
    } catch (error) {
      // Handle any unexpected errors
      setError('Something went wrong. Please try using different email.');
    } finally {
      // Set loading to false after the registration process is completed
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white h-full lg:min-h-screen">
      <div className="flex bg-white gap-6 p-8 rounded-lg w-full">
        {/* Left Side Illustration */}
        <div className="hidden lg:block flex-1 p-8">
          <Image src="/login-image.png" width={563} height={604} alt="Registration Illustration" className="w-full h-full object-cover rounded-lg" />
        </div>

        {/* Register Form */}
        <div className="flex-1 p-0 sm:px-6 sm:py-8">
          <div className="border rounded-lg border-gray-200 p-4 sm:p-8">
            <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">Create an Account</h2>
            {error && <div className="text-red-500 text-sm text-left mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 text-sm text-left mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter your full name"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fullnameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fullnameError && <p className="text-red-500 text-sm mt-1">{fullnameError}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
              </div>

              {/* Loading Spinner */}
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin border-t-2 border-blue-600 w-6 h-6 border-solid rounded-full"></div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#D99E46] cursor-pointer text-white py-2 rounded-md hover:bg-[#D99E46] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  Register
                </button>
              )}

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;