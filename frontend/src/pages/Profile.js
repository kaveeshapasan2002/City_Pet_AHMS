// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from "../api/auth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

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
    licenseNumber: ""
  });
  
  const [passwordData, setPasswordData] = useState({ 
    oldPassword: "", 
    newPassword: "" 
  });
  
  useEffect(() => {
    // Set form data when user data is available
    if (user) {
      setFormData({
        name: user.name || "",
        phonenumber: user.phonenumber || "",
        profilePicture: user.profilePicture || "",
        specialization: user.specialization || "",
        licenseNumber: user.licenseNumber || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await changePassword(passwordData);
      setMessage("Password updated successfully!");
      setMessageType("success");
      setPasswordData({ oldPassword: "", newPassword: "" });
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
      
      // Update the user in AuthContext
      if (response.user) {
        setUser(response.user);
      } else {
        // If the response doesn't include the user object, refresh from localStorage
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {message && (
        <Alert 
          type={messageType} 
          message={message} 
          onClose={() => setMessage("")} 
        />
      )}
      
      {/* Account Information */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Account Information</h2>
        
        {/* Profile Picture */}
{user?.profilePicture && (
  <div className="flex justify-center mb-6">
    <div className="w-32 h-32 rounded-full overflow-hidden">
      <img 
        src={`${user.profilePicture}?t=${new Date().getTime()}`} 
        alt="Profile" 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=Profile";
        }}
      />
    </div>
  </div>
)}
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><span className="font-medium">Name:</span> {user?.name}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {user?.email}</p>
            <p className="mb-2"><span className="font-medium">Phone:</span> {user?.phonenumber}</p>
            <p className="mb-2"><span className="font-medium">Role:</span> {user?.role}</p>
          </div>
          
          {user?.role === "Pet Owner" && user?.pets && user.pets.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Your Pets:</h3>
              <ul className="list-disc pl-5">
                {user.pets.map((pet, index) => (
                  <li key={index}>{pet.name} - {pet.species} ({pet.breed})</li>
                ))}
              </ul>
            </div>
          )}
          
          {user?.role === "Veterinarian" && (
            <div>
              <p className="mb-2"><span className="font-medium">Specialization:</span> {user?.specialization}</p>
              <p className="mb-2"><span className="font-medium">License Number:</span> {user?.licenseNumber}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Update Profile Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleProfileUpdate}>
          <Input 
            label="Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your name"
            required
          />
          
          <Input 
            label="Phone Number" 
            name="phonenumber" 
            value={formData.phonenumber} 
            onChange={handleChange} 
            placeholder="Enter your phone number"
            required
          />
          
          <Input 
            label="Profile Picture URL" 
            name="profilePicture" 
            value={formData.profilePicture} 
            onChange={handleChange} 
            placeholder="Enter profile picture URL (optional)"
          />
          
          {user?.role === "Veterinarian" && (
            <>
              <Input 
                label="Specialization" 
                name="specialization" 
                value={formData.specialization} 
                onChange={handleChange} 
                placeholder="Enter your specialization"
              />
              
              <Input 
                label="License Number" 
                name="licenseNumber" 
                value={formData.licenseNumber} 
                onChange={handleChange} 
                placeholder="Enter your license number"
              />
            </>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
      
      {/* Change Password Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <Input 
            label="Current Password" 
            type="password" 
            name="oldPassword" 
            value={passwordData.oldPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} 
            placeholder="Enter your current password"
            required
          />
          
          <Input 
            label="New Password" 
            type="password" 
            name="newPassword" 
            value={passwordData.newPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
            placeholder="Enter your new password"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;