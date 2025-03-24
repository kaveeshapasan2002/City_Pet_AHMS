import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 
import AdminDashboard from './pages/AdminDashboard';
import Inventory from './pages/Inventory';
import PetBoarding from './pages/PetBoarding';

// Animal Record Imports
import AnimalRecords from "./components/animalRecord/animalRecord/animalRecord";
import AddPet from "./components/animalRecord/AddPet/Addpet";
import PetDetails from './components/animalRecord/PetDetails/PetDetails';
import UpdatePet from './components/animalRecord/UpdatePet/UpdatePet';
import MediRecord from './components/animalRecord/animalRecord/MediRecord';
import AddMedi from './components/animalRecord/AddPet/AddMedi';
import UpdateMedi from './components/animalRecord/UpdatePet/UpdateMedi';
import Addappointment from './components/animalRecord/AddAppointment/Addappointment';
import Appointmentdetails from './components/animalRecord/AppointmentDetails/Appointmentdetails';
import UpdateAppointment from './components/animalRecord/UpdateAppointment/UpdateAppointment';

// Route guard component for protected routes
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuth, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Route guard component for admin routes
const AdminRoute = ({ children }) => {
  const { isAuth, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuth || (user && user.role !== 'Admin')) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Common Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/pet-boarding" element={
                  <ProtectedRoute>
                    <PetBoarding />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                
                {/* Inventory Routes */}
                <Route 
                  path="/inventory" 
                  element={
                    <ProtectedRoute roles={['Admin', 'Veterinarian', 'Receptionist']}>
                      <Inventory />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Animal Record Routes */}
                <Route path="/animal-records" element={
                  <ProtectedRoute>
                    <AnimalRecords />
                  </ProtectedRoute>
                } />
                <Route path="/addpet" element={
                  <ProtectedRoute>
                    <AddPet />
                  </ProtectedRoute>
                } />
                <Route path="/petdetails" element={
                  <ProtectedRoute>
                    <PetDetails />
                  </ProtectedRoute>
                } />
                <Route path="/petdetails/:id" element={
                  <ProtectedRoute>
                    <UpdatePet />
                  </ProtectedRoute>
                } />
                
                {/* Appointment Routes */}
                <Route path="/appointmentdetails" element={
                  <ProtectedRoute>
                    <Appointmentdetails />
                  </ProtectedRoute>
                } />
                <Route path="/addappointment" element={
                  <ProtectedRoute>
                    <Addappointment />
                  </ProtectedRoute>
                } />
                <Route path="/appointmentdetails/:nic" element={
                  <ProtectedRoute>
                    <UpdateAppointment />
                  </ProtectedRoute>
                } />
                
                {/* Medical Record Routes */}
                <Route path="/medicalrecords/:petid" element={
                  <ProtectedRoute>
                    <MediRecord />
                  </ProtectedRoute>
                } />
                <Route path="/addmedi/:id" element={
                  <ProtectedRoute>
                    <AddMedi />
                  </ProtectedRoute>
                } />
                <Route path="/updatemedi/:id/:index" element={
                  <ProtectedRoute>
                    <UpdateMedi />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;