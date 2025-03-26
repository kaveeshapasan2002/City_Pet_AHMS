// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuth, user } = useAuth();

  const [selectedPet, setSelectedPet] = useState(null);
  // Dummy medical history data
  const dummyMedicalHistory = {
    'Rex': [
      { date: '2025-02-15', type: 'Vaccination', description: 'Annual rabies vaccination', vet: 'Dr. Smith' },
      { date: '2025-01-03', type: 'Check-up', description: 'Routine health checkup, all vitals normal', vet: 'Dr. Johnson' },
      { date: '2024-11-20', type: 'Treatment', description: 'Ear infection treatment, prescribed antibiotics', vet: 'Dr. Smith' }
    ],
    'Bella': [
      { date: '2025-03-05', type: 'Surgery', description: 'Dental cleaning and extraction of two teeth', vet: 'Dr. Wilson' },
      { date: '2025-02-10', type: 'Vaccination', description: 'Distemper and parvo boosters', vet: 'Dr. Johnson' },
      { date: '2024-12-12', type: 'Emergency', description: 'Ingestion of foreign object, monitoring recommended', vet: 'Dr. Martinez' }
    ],
    'Max': [
      { date: '2025-03-10', type: 'Check-up', description: 'Weight management consultation, diet plan provided', vet: 'Dr. Garcia' },
      { date: '2025-01-25', type: 'Treatment', description: 'Skin allergy treatment, prescribed medicated shampoo', vet: 'Dr. Wilson' }
    ]
  };

  // Create dummy pets data if user doesn't have pets info
  const dummyPets = [
    { name: 'Rex', species: 'Dog', breed: 'Golden Retriever', age: 5 },
    { name: 'Bella', species: 'Cat', breed: 'Maine Coon', age: 3 },
    { name: 'Max', species: 'Dog', breed: 'Beagle', age: 2 }
  ];

  // Set first pet as selected on initial load
  useEffect(() => {
    if (user?.role === "Pet Owner") {
      const pets = user.pets && user.pets.length > 0 ? user.pets : dummyPets;
      setSelectedPet(pets[0]?.name || null);
    }
  }, [user]);


  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  const displayPets = user?.pets && user.pets.length > 0 ? user.pets : dummyPets;


  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
            <p className="text-gray-700">
              You are now logged in as a {user?.role}.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Account Information</h3>
            <ul className="space-y-2">
              <li><strong>Name:</strong> {user?.name}</li>
              <li><strong>Email:</strong> {user?.email}</li>
              <li><strong>Phone:</strong> {user?.phonenumber}</li>
              <li><strong>Role:</strong> {user?.role}</li>
            </ul>
          </div>
          
          {/* Veterinarian Buttons Section */}
          {user?.role === "Veterinarian" && (
            <div className="mt-6 flex flex-wrap gap-4">
              <Link 
                to="/addpet"
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Pet
              </Link>
              <Link 
                to="/petdetails"
                className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                View Pets
              </Link>
            </div>
          )}
        </div>
      
        {user?.role === "Pet Owner" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pet Medical History</h2>

            {/* Pet selector */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select Pet:</label>
              <div className="flex flex-wrap gap-2">
                {displayPets.map((pet, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPet(pet.name)}
                    className={`px-4 py-2 rounded-full ${
                      selectedPet === pet.name 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {pet.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Pet details */}
            {selectedPet && (
              <div className="mb-6">
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Pet Information</h3>
                  {displayPets.map((pet, index) => (
                    pet.name === selectedPet && (
                      <ul key={index} className="space-y-1">
                        <li><strong>Name:</strong> {pet.name}</li>
                        <li><strong>Species:</strong> {pet.species}</li>
                        <li><strong>Breed:</strong> {pet.breed}</li>
                        <li><strong>Age:</strong> {pet.age} years</li>
                      </ul>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {/* Medical history table */}
            {selectedPet && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Medical Records</h3>
                {dummyMedicalHistory[selectedPet] && dummyMedicalHistory[selectedPet].length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Date</th>
                          <th className="py-2 px-4 border-b text-left">Type</th>
                          <th className="py-2 px-4 border-b text-left">Description</th>
                          <th className="py-2 px-4 border-b text-left">Veterinarian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummyMedicalHistory[selectedPet].map((record, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="py-2 px-4 border-b">{record.date}</td>
                            <td className="py-2 px-4 border-b">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                record.type === 'Emergency' ? 'bg-red-100 text-red-800' :
                                record.type === 'Surgery' ? 'bg-purple-100 text-purple-800' :
                                record.type === 'Vaccination' ? 'bg-green-100 text-green-800' :
                                record.type === 'Treatment' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {record.type}
                              </span>
                            </td>
                            <td className="py-2 px-4 border-b">{record.description}</td>
                            <td className="py-2 px-4 border-b">{record.vet}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No medical records found for this pet.</p>
                )}
                
                <div className="mt-4 flex justify-end space-x-4">
                <Link 
  to="/addappointment" 
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
>
  Schedule Appointment
</Link>
                  
                  <Link 
                    to="/pet-boarding"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Pet Boarding Service
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;