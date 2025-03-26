import React from 'react'
import axios from "axios";
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate,useParams } from 'react-router-dom';




function Appointmentdetails() {
  const history = useNavigate();
  const {nic} = useParams();
  const [appoinment, setAppoinment] = useState([]);

    
      useEffect(() => {
        const fetchRecords = async () => {
            await axios
                .get(`http://localhost:5001/appointments`)
                .then((res) => setAppoinment(res.data.Appointments))  // Updated to match backend response
                .catch((err) => console.log("Error fetching records:", err));
        };
        fetchRecords();
    }, []);

    const deleteHandler = async (nic) => {
        await axios
            .delete(`http://localhost:5001/appointments/${nic}`)
            .then((res) => res.data)
            .then(() => {
                setAppoinment((prevAppointments) => prevAppointments.filter((appointment) => appointment.nic !== nic));
            })
            .catch((err) => console.log("Error deleting record:", err));
    };

    return(
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Appointments</h1>
  
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Contact</th>
                <th className="py-2 px-4 border">NIC</th>
                <th className="py-2 px-4 border">Gmail</th>
                <th className="py-2 px-4 border">Pet ID</th>
                <th className="py-2 px-4 border">Appointment Type</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(appoinment) && appoinment.length > 0 ? (
                appoinment.map((Appointment) => (
                  <tr key={Appointment.nic} className="text-center border">
                    <td className="py-2 px-4 border">{Appointment.name}</td>
                    <td className="py-2 px-4 border">{Appointment.contact}</td>
                    <td className="py-2 px-4 border">{Appointment.nic}</td>
                    <td className="py-2 px-4 border">{Appointment.gmail}</td>
                    <td className="py-2 px-4 border">{Appointment.petID}</td>
                    <td className="py-2 px-4 border">{Appointment.appointmentType}</td>
                    <td className="py-2 px-4 border">
                      <Link to={`/appointmentdetails/${Appointment.nic}`}>
                        <button className='bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition'>Update</button>
                      </Link>
                      <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition ml-2" onClick={() => deleteHandler(Appointment.nic)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">No medical records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
);
}

export default Appointmentdetails;
