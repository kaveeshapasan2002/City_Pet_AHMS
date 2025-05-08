import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

function Appointmentdetails() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/appointments`);
        setAppointments(res.data.Appointments || []);
      } catch (err) {
        setError('Failed to fetch appointments');
        console.log("Error fetching records:", err);
      }
    };
    fetchRecords();
  }, []);



  const handleDelete = async (appointment) => {
    if (!window.confirm(`Are you sure you want to delete the appointment ?`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5001/appointments/${appointment._id}`);
      setAppointments(prev => prev.filter(app => app._id !== appointment._id));
      window.alert('Appointment deleted successfully');
    } catch (err) {
      window.alert('Failed to delete appointment');
      console.error("Delete error:", err);
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Appointments</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">NIC</th>
              <th className="py-2 px-4 border">Gmail</th>
              <th className="py-2 px-4 border">Pet name</th>
              <th className="py-2 px-4 border">Appointment Type</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(appointments) && appointments.length > 0 ? (
              appointments.map((app) => (
                <tr key={app.nic} className="text-center border">
                  <td className="py-2 px-4 border">{app.name}</td>
                  <td className="py-2 px-4 border">{app.contact}</td>
                  <td className="py-2 px-4 border">{app.nic}</td>
                  <td className="py-2 px-4 border">{app.gmail}</td>
                  <td className="py-2 px-4 border">{app.petID}</td>
                  <td className="py-2 px-4 border">{app.appointmentType}</td>
                  <td className="py-2 px-4 border">
             
                    <div className="mt-2">
                    <td className="py-3 px-4 border-b">
  <span className={`px-2 py-1 rounded-full text-xs ${
    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
    app.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
    app.status === 'Checked-in' ? 'bg-blue-100 text-blue-800' :
    app.status === 'Checked-out' ? 'bg-gray-100 text-gray-800' :
    'bg-red-100 text-red-800'
  }`}>
    {app.status}
  </span>
</td>

                    </div>
                  </td>
                  <td className="py-2 px-4 border flex gap-2">
                  <Link to={`/appointmentdetails/${app._id}`}>
                  <button className='bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition'>Update</button>
            
                </Link>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition ml-2"
                  onClick={() => handleDelete(app)} 
                >
                  Delete
                </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">No appointments available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointmentdetails;
