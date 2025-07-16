// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { SupplierProvider } from './context/SupplierContext';
import { PurchaseRequestProvider } from './context/PurchaseRequestContext';
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
import Suppliers from './pages/Suppliers';
import FinancialManagement from './pages/FinancialManagement';
import PetBoarding from './pages/PetBoarding';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import UpdateBookingForm from './components/boarding/UpdateBookingForm';
import Messaging from './pages/Messaging';
import PetHospitalChatbot from './components/PetHospitalChatbot'; // Import the chatbot component
import { ToastContainer } from 'react-toastify';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import 'react-toastify/dist/ReactToastify.css';

// Password Reset Routes
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOtp from './pages/VerifyResetOtp';
import ResetPassword from './pages/ResetPassword';

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

//Invoice Imports
import InvoiceList from './components/financial/InvoiceList';
import InvoiceForm from './components/financial/InvoiceForm';
import InvoiceDetail from './components/financial/InvoiceDetail';
import ServiceList from './components/financial/ServiceList';
import InventoryPurchases from './pages/InventoryPurchases'; // Import the new page

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
        <SupplierProvider>
          <PurchaseRequestProvider>
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
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
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

                    <Route path="/update-booking/:bookingId" element={
                      <ProtectedRoute>
                        <UpdateBookingForm />
                      </ProtectedRoute>
                    } />
                    
                    {/* Messaging Routes */}
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <Messaging />
                      </ProtectedRoute>
                    } />
                    <Route path="/messages/conversation/:id" element={
                      <ProtectedRoute>
                        <Messaging />
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
                    
                    {/* Supplier Routes */}
                    <Route 
                      path="/suppliers" 
                      element={
                        <ProtectedRoute roles={['Admin', 'Veterinarian', 'Receptionist']}>
                          <Suppliers />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Financial Management Routes */}
                    <Route 
                      path="/financial-management" 
                      element={
                        <ProtectedRoute roles={['Admin', 'Veterinarian']}>
                          <FinancialManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
  path="/financial-management/invoices" 
  element={
    <ProtectedRoute roles={['Admin', 'Veterinarian', 'Receptionist']}>
      <InvoiceList />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/financial-management/invoices/create" 
  element={
    <ProtectedRoute roles={['Admin', 'Veterinarian', 'Receptionist']}>
      <InvoiceForm />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/financial-management/invoices/:id" 
  element={
    <ProtectedRoute roles={['Admin', 'Veterinarian', 'Receptionist']}>
      <InvoiceDetail />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/financial-management/invoices/:id/edit" 
  element={
    <ProtectedRoute roles={['Admin', 'Veterinarian', 'Receptionist']}>
      <InvoiceForm />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/financial-management/services" 
  element={
    <ProtectedRoute roles={['Admin', 'Veterinarian']}>
      <ServiceList />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/financial-management/inventory-purchases" 
  element={
    <ProtectedRoute roles={['Admin', 'Veterinarian']}>
      <InventoryPurchases />
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

                    {/* Payment Success Route */}
                    <Route 
                      path="/payment-success" 
                      element={
                        <ProtectedRoute>
                          <PaymentSuccessPage />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
                
                {/* Add chatbot component here - it will be available on all pages */}
                <PetHospitalChatbot />
                
                <ToastContainer position="bottom-right" />
              </div>
            </Router>
          </PurchaseRequestProvider>
        </SupplierProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;