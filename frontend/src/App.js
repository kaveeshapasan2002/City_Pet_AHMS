// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import { AuthProvider,useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 
import AdminDashboard from './pages/AdminDashboard';
import PetBoarding from './pages/PetBoarding';


////////////animalRecord
import AnimalRecords from "./components/animalRecord/animalRecord/animalRecord"
import AddPet from "./components/animalRecord/AddPet/AddMedi"
import PetDetails from './components/animalRecord/PetDetails/PetDetails';
import UpdatePet from './components/animalRecord/UpdatePet/UpdatePet';
import MediRecord from './components/animalRecord/animalRecord/MediRecord';
import AddMedi from './components/animalRecord/AddPet/AddMedi';
import UpdateMedi from './components/animalRecord/UpdatePet/UpdateMedi';
import Addappointment from './components/animalRecord/AddAppointment/Addappointment';
import Appointmentdetails from './components/animalRecord/AppointmentDetails/Appointmentdetails';
import UpdateAppointment from './components/animalRecord/UpdateAppointment/UpdateAppointment';




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
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<OtpVerify />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pet-boarding" element={<PetBoarding />} />

              <Route path="/finacial-dashbord" element={<Dashboard />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />        <Route path="/dashboard" element={<AnimalRecords />} />
              <Route path="/addpet" element={<AddPet />} />
              <Route path="/petdetails" element={<PetDetails />} />
              <Route path="/petdetails/:id" element={<UpdatePet />} />
            
           
            
              
              <Route path="/appointmentdetails" element={ <Appointmentdetails/>} />
              <Route path="/addappointment" element={<Addappointment />} />
              <Route path="/appointmentdetails/:nic" element={<UpdateAppointment />} />
      
             
      
                      <Route path="/petdetails/:id" element={<PetDetails />} />
            
            
      
                   
            <Route path="/medicalrecords/:petid" element={<MediRecord />} />
            <Route path="/addmedi/:id" element={<AddMedi />} />
            <Route path="/updatemedi/:id/:index" element={<UpdateMedi />} />
            </Routes>
          </main>
          <Footer />
        </div>

      </Router>
    </AuthProvider>

    
  );
}

export default App;
