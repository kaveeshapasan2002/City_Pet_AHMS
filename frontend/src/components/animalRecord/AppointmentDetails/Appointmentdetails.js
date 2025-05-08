
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

function Appointmentdetails() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/appointments');
      setAppointments(res.data.Appointments || []);
    } catch (err) {
      window.alert('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointment) => {
    if (!window.confirm(`Are you sure you want to delete the appointment for ${appointment.name}? This action cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5001/appointments/${appointment._id}`);
      setAppointments(appointments.filter(app => app._id !== appointment._id));
      window.alert('Appointment deleted successfully');
    } catch (err) {
      window.alert('Failed to delete appointment');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Appointments</h1>
      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No appointments found......</p>
        </div>
      ) : (
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
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="text-center border">
                  <td className="py-2 px-4 border">{appointment.name}</td>
                  <td className="py-2 px-4 border">{appointment.contact}</td>
                  <td className="py-2 px-4 border">{appointment.nic}</td>
                  <td className="py-2 px-4 border">{appointment.gmail}</td>
                  <td className="py-2 px-4 border">{appointment.petID}</td>
                  <td className="py-2 px-4 border">{appointment.appointmentType}</td>
                  <td className="py-2 px-4 border">
                    <Link to={`/appointmentdetails/${appointment._id}`}>
                      <button className='bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition'>Update</button>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition ml-2"
                      onClick={() => handleDelete(appointment)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Appointmentdetails;
