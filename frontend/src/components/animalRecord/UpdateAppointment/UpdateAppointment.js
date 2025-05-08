
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateAppointment() {
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    nic: "",
    gmail: "",
    petID: "",
    appointmentType: ""
  });
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/appointments/${id}`);
        setInputs(res.data.appointment);
      } catch (err) {
        window.alert('Failed to fetch appointment details');
      }
    };
    fetchHandler();
  }, [id]); 

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5001/appointments/${id}`,inputs);
      window.alert('Appointment updated successfully!');
    } catch (err) {
      window.alert('Failed to update appointment');
    }
  };

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
    navigate("/viewappointments");
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Update Appointment</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type='text'
              name='name'
              onChange={handleChange}
              value={inputs.name || ''}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact:</label>
            <input
              type='text'
              name='contact'
              onChange={handleChange}
              value={inputs.contact || ''}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">Gmail:</label>
            <input
              type='text'
              name='gmail'
              onChange={handleChange}
              value={inputs.gmail || ''}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="petID" className="block text-sm font-medium text-gray-700">Pet ID:</label>
            <input
              type='text'
              name='petID'
              onChange={handleChange}
              value={inputs.petID || ''}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Appointment Type:</label>
            <select
              name="appointmentType"
              onChange={handleChange}
              value={inputs.appointmentType || ''}
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>Select Appointment Type</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Emergency">Emergency</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Surgery">Surgery</option>
              <option value="Dental Care">Dental Care</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAppointment;
