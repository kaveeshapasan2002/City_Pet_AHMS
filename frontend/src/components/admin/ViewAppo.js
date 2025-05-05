import React from 'react';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AppointmentDetails() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5001/appointments");
        setAppointments(response.data.Appointments || []);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusChange = async (nic, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/appointments/${nic}`, // Use _id, not nic
        { status: newStatus }
      );
  
      // Update state with the returned data
      setAppointments(appointments.map(app => 
        app.nic === nic ? response.data : app
      ));
    } catch (err) {
      console.error("Frontend Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };
  
  
  
  

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/appointments/${id}`);
      setAppointments(appointments.filter(app => app._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
      setError('Failed to delete appointment');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status] || 'bg-gray-100'}`}>
        {status || 'Pending'}
      </span>
    );
  };

  if (loading) return <div className="text-center p-6">Loading appointments...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Appointment Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 border text-left">Name</th>
              <th className="py-3 px-4 border text-left">Contact</th>
              <th className="py-3 px-4 border text-left">Email</th>
              <th className="py-3 px-4 border text-left">NIC</th>
              <th className="py-3 px-4 border text-left">Pet ID</th>
              <th className="py-3 px-4 border text-left">Type</th>
              <th className="py-3 px-4 border text-left">Status</th>
              <th className="py-3 px-4 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border">{appointment.name}</td>
                <td className="py-3 px-4 border">{appointment.contact}</td>
                <td className="py-3 px-4 border">{appointment.gmail}</td>
                <td className="py-3 px-4 border">{appointment.nic}</td>
                <td className="py-3 px-4 border">{appointment.petID}</td>
                <td className="py-3 px-4 border">{appointment.appointmentType}</td>
                <td className="py-3 px-4 border">
                  {getStatusBadge(appointment.status)}
                </td>
                <td className="py-3 px-4 border">
                  <div className="flex items-center space-x-2">
                    <select
                      value={appointment.status || 'Pending'}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                      className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirm</option>
                      <option value="Rejected">Reject</option>
                    </select>
                    <button
                      onClick={() => deleteHandler(appointment._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentDetails;
