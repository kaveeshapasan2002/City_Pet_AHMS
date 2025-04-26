import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [role, setRole] = useState("Pet Owner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: ""
  });
  
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (emailValue) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailValue) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Validate password strength
  const validatePassword = (passwordValue) => {
    if (!passwordValue) {
      setPasswordError("Password is required");
      setPasswordStrength({ score: 0, label: "" });
      return false;
    } else if (passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      setPasswordStrength({ score: 1, label: "Weak" });
      return false;
    }

    // Calculate password strength
    let score = 0;
    if (passwordValue.length >= 6) score++;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    
    setPasswordStrength({ 
      score, 
      label: labels[score] 
    });

    // Only show error for weak passwords
    if (score < 2) {
      setPasswordError("Password is too weak. Include uppercase, numbers and special characters.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword);
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  // Validate phone number format
  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      return false;
    } else if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Handle phone change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhonenumber(value);
    validatePhone(value);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate all fields before submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(phonenumber);
    const doPasswordsMatch = password === confirmPassword;

    if (!isEmailValid || !isPasswordValid || !isPhoneValid || !doPasswordsMatch) {
      setLoading(false);
      if (!doPasswordsMatch) {
        setPasswordMatch(false);
        setError("Passwords do not match");
      }
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        phonenumber,
        role
      });

      if (response.data) {
        navigate('/verify-otp', { state: { email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    return colors[passwordStrength.score] || "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join Pet Hospital Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="you@example.com"
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="••••••"
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${getPasswordStrengthColor()}`} 
                      style={{ width: `${passwordStrength.score * 20}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Password Strength: {passwordStrength.label}
                  </p>
                </div>
              )}
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    !passwordMatch ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="••••••"
                />
              </div>
              {!passwordMatch && confirmPassword && (
                <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  required
                  value={phonenumber}
                  onChange={handlePhoneChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="0712345678"
                />
              </div>
              {phoneError && (
                <p className="mt-2 text-sm text-red-600">{phoneError}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Pet Owner">Pet Owner</option>
                  <option value="Veterinarian">Veterinarian</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !passwordMatch || !!emailError || !!passwordError || !!phoneError}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
                  loading || !passwordMatch || !!emailError || !!passwordError || !!phoneError
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;