import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';




function Addpet() {
  const history=useNavigate();
  const [inputs,setInputs]=useState({
   
    id:"",
    name:"",
    age:"",
    breed:"",
    species:"",
    gender:"",
    bloodgroup:"",
    allergies:"",
    contact:""



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
  sendRequest().then(()=>history('/petdetails'))
}
const sendRequest=async()=>{
  await axios.post(`${API_BASE_URL}/pets`,{
    id:String(inputs.id),
    name:String(inputs.name),
    age:Number(inputs.age),
    breed:String(inputs.breed),
    species:String(inputs.species),
    gender:String(inputs.gender),
    bloodgroup:String(inputs.bloodgroup),
    allergies:String(inputs.allergies),
    contact:Number(inputs.contact)

  }).then(res=>res.data);
}



  return  (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Add Pet Details
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-semibold text-gray-700">Pet ID:</label>
        <input
          type="text"
          name="id"
          onChange={handleChange}
          value={inputs.id}
          required
          className="p-2 border rounded-md"
        />

        <label className="font-semibold text-gray-700">Pet Name:</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={inputs.name}
          required
          className="p-2 border rounded-md"
        />

        <label className="font-semibold text-gray-700">Age:</label>
        <input
          type="text"
          name="age"
          onChange={handleChange}
          value={inputs.age}
          required
          className="p-2 border rounded-md"
        />

        <label className="font-semibold text-gray-700">Breed:</label>
        <input
          type="text"
          name="breed"
          onChange={handleChange}
          value={inputs.breed}
          required
          className="p-2 border rounded-md"
        />

        <label className="font-semibold text-gray-700">Species:</label>
        <input
          type="text"
          name="species"
          onChange={handleChange}
          value={inputs.species}
          required
          className="p-2 border rounded-md"
        />

        <label className="font-semibold text-gray-700">Gender:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              checked={inputs.gender === 'Male'}
              required
              className="mr-2"
            />
            Male
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
              checked={inputs.gender === 'Female'}
              required
              className="mr-2"
            />
            Female
          </label>
        </div>

        <label className="font-semibold text-gray-700">Blood Group:</label>
        <select
          name="bloodgroup"
          onChange={handleChange}
          value={inputs.bloodgroup}
          required
          className="p-2 border rounded-md"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <label className="font-semibold text-gray-700">Allergies:</label>
        <input
          type="text"
          name="allergies"
          onChange={handleChange}
          value={inputs.allergies}
          required
          className="p-2 border rounded-md"
        />
<label className="font-semibold text-gray-700">Contact Number of Owner:</label>
<input
  type="text"
  name="contact"
  onChange={handleChange}
  value={inputs.contact}
  required
  pattern="\d{10}"  // Ensures exactly 10 digits
  maxLength="10"  // Prevents input beyond 10 digits
  title="Please enter a 10-digit contact number" // Shows tooltip on invalid input
  className="p-2 border rounded-md"
  placeholder="Enter 10-digit contact number"
/>

        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
)
};

export default Addpet;
