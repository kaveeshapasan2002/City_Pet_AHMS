import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Added import for Link
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from "../api/auth";
import { FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa'; // Removed FaPaw

const Profile = () => {
  const { user, setUser, checkUserLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    profilePicture: "",
    specialization: "",
    licenseNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phonenumber: user.phonenumber || "",
        profilePicture: user.profilePicture || "",
        specialization: user.specialization || "",
        licenseNumber: user.licenseNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage("Password updated successfully!");
      setMessageType("success");
      setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      setMessage(error.message || "Failed to update password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile(formData);
      if (response.user) {
        setUser(response.user);
      } else {
        checkUserLoggedIn();
      }
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Failed to update profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sticky top-12 animate-slide-in-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" /> Navigation
              </h2>
              <nav className="space-y-2">
                {[
                  { label: 'Dashboard', to: '/dashboard' },
                  { label: 'Profile', to: '/profile', active: true },
                
                ].map((item, index) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                      item.active
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                    <img
                      src={
                        user?.profilePicture ||
                        "https://images.unsplash.com/photo-1601758177266-6a9a4a79972b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=Profile";
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-36 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full opacity-30"></div>
                </div>

                {/* Profile Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h1>
                  <p className="text-gray-600 text-lg mb-2">{user?.role}</p>
                  {user?.role === "Veterinarian" && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Specialization:</span> {user?.specialization}
                    </p>
                  )}
                  <div className="flex justify-center md:justify-start gap-4 text-gray-600 text-sm">
                    <span className="flex items-center">
                      <FaEnvelope className="mr-1" /> {user?.email}
                    </span>
                    <span className="flex items-center">
                      <FaPhone className="mr-1" /> {user?.phonenumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Profile Form */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 animate-slide-up">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
              {message && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  } animate-fade-in`}
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleProfileUpdate}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="text"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Profile Picture URL</label>
                    <input
                      type="text"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      placeholder="Enter profile picture URL (optional)"
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>
                  {user?.role === "Veterinarian" && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          placeholder="Enter your specialization"
                          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">License Number</label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          placeholder="Enter your license number"
                          className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                    onClick={() => setFormData({
                      name: user?.name || "",
                      phonenumber: user?.phonenumber || "",
                      profilePicture: user?.profilePicture || "",
                      specialization: user?.specialization || "",
                      licenseNumber: user?.licenseNumber || "",
                    })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-slide-up">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
              <form onSubmit={onPasswordSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        required
                      />
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        required
                      />
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Re-type New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        placeholder="Re-type your new password"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        required
                      />
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                    onClick={() => setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Updating Password...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;