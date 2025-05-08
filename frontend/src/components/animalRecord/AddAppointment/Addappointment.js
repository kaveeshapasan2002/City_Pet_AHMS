
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AddAppointment() {

  const { user } = useAuth();
  const userContact = user?.phonenumber;

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
   
      <input
        type="hidden"
        name="contact"
        value={formData.contact}
      />

     
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Contact Number</label>
        <div className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700">
          {formData.contact || "Not available"}
        </div>
      </div>

     
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
               
            </option>
          ))}
        </select>
      </div>

  
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
      <input
            type="text"
            name="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            minLength={3}
            maxLength={20}
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
            required
          />
     </div>

    
      <div>
        <label className="block font-semibold text-gray-700 mb-1">NIC</label>
        <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={e => setFormData({ ...formData, nic: e.target.value })}
              pattern="\d{9}[v]|[V]|\d{12}"
              title="NIC must be 9 digits followed by 'V' or 12 digits"
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
              required
            />
      </div>

  
      <div>
        <label className="block font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="gmail"
          value={formData.gmail}
          onChange={e => setFormData({ ...formData, gmail: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300"
           pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
           title="Enter a valid email (e.g., example@email.com)"
          required
        />
      </div>

     
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
