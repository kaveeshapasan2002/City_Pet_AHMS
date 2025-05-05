
// import React, { useState } from 'react'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Addappointment() {
//     const history=useNavigate();
//     const [inputs,setInputs]=useState({
     
  
//       name:"",
//       contact:"",
//       nic:"",
//       gmail:"",
//       petID:"",
//       appointmentType:""
//     });

//     const handleChange=(e)=>{
//       setInputs((prevState)=>({
//         ...prevState,
//         [e.target.name]:e.target.value,
//       }));
//     };
//     const handleSubmit=(e)=>{
//       e.preventDefault();
//       console.log(inputs);
//       sendRequest().then(()=>history('/appointmentdetails'))
//     }
//     const sendRequest=async()=>{
//       await axios.post("http://localhost:5001/appointments",{
       
//         name:String(inputs.name),
//         contact:Number(inputs.contact),
//         nic:String(inputs.nic),
//         gmail:String(inputs.gmail),
//         petID:String(inputs.petID),
//         appointmentType:String(inputs.appointmentType),
    
//       }).then(res=>res.data);
//     }


//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
//     <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Add Appointment</h1>
//     <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//             <label className="block text-gray-700 font-medium">Name:</label>
//             <input type='text' name='name' onChange={handleChange} value={inputs.name} required 
//                 className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
//         </div>

//         <div>
//             <label className="block text-gray-700 font-medium">Contact:</label>
//             <input type='text' name='contact' onChange={handleChange} value={inputs.contact} required 
//                 className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
//         </div>

//         <div>
//             <label className="block text-gray-700 font-medium">NIC:</label>
//             <input type='text' name='nic' onChange={handleChange} value={inputs.nic} required 
//                 className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
//         </div>

//         <div>
//             <label className="block text-gray-700 font-medium">Gmail:</label>
//             <input type='text' name='gmail' onChange={handleChange} value={inputs.gmail} required 
//                 className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
//         </div>

//         <div>
//             <label className="block text-gray-700 font-medium">Pet ID:</label>
//             <input type='text' name='petID' onChange={handleChange} value={inputs.petID} required 
//                 className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
//         </div>

//         <div className="mb-4">
//   <label className="block text-gray-700 font-medium">Appointment Type:</label>
//   <select
//     name="appointmentType"
//     onChange={handleChange}
//     value={inputs.appointmentType}
//     required
//     className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
//   >
//     <option value="" disabled>Select Appointment Type</option>
//     <option value="Vaccination">Vaccination</option>
//     <option value="Emergency">Emergency</option>
//     <option value="General Checkup">General Checkup</option>
//     <option value="Surgery">Surgery</option>
//     <option value="Dental Care">Dental Care</option>
//   </select>
// </div>

//         <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
//             Submit
//         </button>
//     </form>
// </div>
//   )
// }














import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddAppointment() {

  const { user } = useAuth();
  const userContact = user?.phonenumber; // Use the correct property name

  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: user?.phonenumber || '',
    nic: '',
    gmail: '',
    appointmentType: ''
  });

  useEffect(() => {
    if (userContact) {
      console.log('Fetching pets for contact:', userContact);
      axios.get(`http://localhost:5001/pets/bycontact/${userContact}`)
        .then(res => {
          console.log('Pets fetched:', res.data.pets);
          setPets(res.data.pets);
          if (res.data.pets.length === 1) {
            setSelectedPetId(res.data.pets[0].petid);
            console.log('Auto-selected pet ID:', res.data.pets[0].petid);
          }
        })
        .catch(err => console.error('Error fetching pets:', err));
    }
  }, [userContact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/appointments', {
        ...formData,
        petID: selectedPetId
      });
      navigate('/appointmentdetails');
    } catch (err) {
      console.log("Error creating appointment:", err);
    }
  };

  

  return (
<div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100">
  <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
    <h2 className="text-3xl font-bold text-blue-700 mb-1 text-center">New Appointment</h2>
    <p className="text-center text-gray-500 mb-6">Book your pet's next visit with CityPet!</p>
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hidden contact field */}
      <input
        type="hidden"
        name="contact"
        value={formData.contact}
      />

      {/* Display contact (read-only) */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Contact Number</label>
        <div className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
          {formData.contact || "Not available"}
        </div>
      </div>

      {/* Pet Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Select Pet</label>
        <select 
          value={selectedPetId}
          onChange={e => setSelectedPetId(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
          required
        >
          <option value="">Select Pet</option>
          {pets.map(pet => (
            <option key={pet.petid} value={pet.petid}>
               {pet.name}
                {/* ({pet.petid}) */}
            </option>
          ))}
        </select>
      </div>

      {/* Full Name */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      {/* NIC */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">NIC</label>
        <input
          type="text"
          name="nic"
          value={formData.nic}
          onChange={e => setFormData({ ...formData, nic: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="gmail"
          value={formData.gmail}
          onChange={e => setFormData({ ...formData, gmail: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      {/* Appointment Type */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Appointment Type</label>
        <select
          name="appointmentType"
          value={formData.appointmentType}
          onChange={e => setFormData({ ...formData, appointmentType: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
          required
        >
          <option value="">Select Type</option>
          <option value="Checkup">General Checkup</option>
          <option value="Vaccination">Vaccination</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
      >
        Book Appointment
      </button>
    </form>
  </div>
</div>

  );
}

 export default AddAppointment;
