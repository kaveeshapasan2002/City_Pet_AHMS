
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function Addappointment() {
    const history=useNavigate();
    const [inputs,setInputs]=useState({
     
  
      name:"",
      contact:"",
      nic:"",
      gmail:"",
      petID:"",
      appointmentType:""
    });

    const handleChange=(e)=>{
      setInputs((prevState)=>({
        ...prevState,
        [e.target.name]:e.target.value,
      }));
    };
    const handleSubmit=(e)=>{
      e.preventDefault();
      console.log(inputs);
      sendRequest().then(()=>history('/appointmentdetails'))
    }
    const sendRequest=async()=>{
      await axios.post(`${API_BASE_URL}/appointments`,{
       
        name:String(inputs.name),
        contact:Number(inputs.contact),
        nic:String(inputs.nic),
        gmail:String(inputs.gmail),
        petID:String(inputs.petID),
        appointmentType:String(inputs.appointmentType),
    
      }).then(res=>res.data);
    }


  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Add Appointment</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-gray-700 font-medium">Name:</label>
            <input type='text' name='name' onChange={handleChange} value={inputs.name} required 
                className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
        </div>

        <div>
            <label className="block text-gray-700 font-medium">Contact:</label>
            <input type='text' name='contact' onChange={handleChange} value={inputs.contact} required 
                className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
        </div>

        <div>
            <label className="block text-gray-700 font-medium">NIC:</label>
            <input type='text' name='nic' onChange={handleChange} value={inputs.nic} required 
                className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
        </div>

        <div>
            <label className="block text-gray-700 font-medium">Gmail:</label>
            <input type='text' name='gmail' onChange={handleChange} value={inputs.gmail} required 
                className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
        </div>

        <div>
            <label className="block text-gray-700 font-medium">Pet ID:</label>
            <input type='text' name='petID' onChange={handleChange} value={inputs.petID} required 
                className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
        </div>

        <div className="mb-4">
  <label className="block text-gray-700 font-medium">Appointment Type:</label>
  <select
    name="appointmentType"
    onChange={handleChange}
    value={inputs.appointmentType}
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

        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
            Submit
        </button>
    </form>
</div>
  )
}

export default Addappointment
