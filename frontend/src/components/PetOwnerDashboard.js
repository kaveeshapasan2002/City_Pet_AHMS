// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PetOwnerDashboard = ({ userContact }) => {
//     const [pets, setPets] = useState([]);
//     const [medicalRecords, setMedicalRecords] = useState({});

//     useEffect(() => {
//         // Fetch pets for the logged-in user
//         const fetchPets = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/pets/bycontact/${userContact}`);
//                 setPets(response.data.pets);
                
//                 // Fetch medical records for each pet
//                 response.data.pets.forEach(async (pet) => {
//                     const mediResponse = await axios.get(`http://localhost:5000/api/medi/pet/${pet.id}`);
//                     setMedicalRecords(prev => ({
//                         ...prev,
//                         [pet.id]: mediResponse.data.Medies
//                     }));
//                 });
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         if (userContact) {
//             fetchPets();
//         }
//     }, [userContact]);

//     return (
//         <div className="container mx-auto p-4">
//             <h2 className="text-2xl font-bold mb-4">My Pets</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {pets.map((pet) => (
//                     <div key={pet.id} className="border rounded-lg p-4 shadow">
//                         <h3 className="text-xl font-semibold">{pet.name}</h3>
//                         <p>ID: {pet.id}</p>
//                         <p>Breed: {pet.breed}</p>
//                         <p>Age: {pet.age}</p>
                        
//                         <div className="mt-4">
//                             <h4 className="font-semibold">Medical Records</h4>
//                             {medicalRecords[pet.id]?.map((record, index) => (
//                                 <div key={index} className="mt-2 border-t pt-2">
//                                     <p>Visit Date: {new Date(record.visitDate).toLocaleDateString()}</p>
//                                     <p>Reason: {record.reason}</p>
//                                     <p>Prescription: {record.prescription}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PetOwnerDashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PetMedicalRecords = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [loading, setLoading] = useState(true);

 
  const userContact = user?.phonenumber;

  useEffect(() => {
    const fetchData = async () => {
      try {
    
        const petsResponse = await axios.get(`http://localhost:5001/pets/bycontact/${userContact}`);
        setPets(petsResponse.data.pets || []);

        
        const records = {};
        for (const pet of petsResponse.data.pets || []) {
          const petKey = pet.petid || pet.id; 
          if (!petKey) continue;
          try {
            const mediResponse = await axios.get(`http://localhost:5001/medies/${petKey}`);
            records[petKey] = mediResponse.data.Medies || [];
          } catch (err) {
            records[petKey] = [];
          }
        }
        setMedicalRecords(records);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userContact) {
      fetchData();
    }
  }, [userContact]);

  if (loading) return <div className="text-center p-4 text-blue-700 font-bold">Loading...</div>;

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow-lg">
        My Pets & Medical Records
      </h2>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {pets.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 text-xl font-semibold py-12 bg-white rounded-2xl shadow">
            No pets found for your account.
          </div>
        ) : (
          pets.map((pet) => {
            const petKey = pet.petid || pet.id;
            return (
              <div
                key={petKey}
                className="bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-blue-800 mb-0 capitalize">{pet.name}</h3>
                  <div className="text-md text-blue-600 font-mono mb-2">ID: {petKey}</div>
                  <div className="text-gray-700">Age: <span className="font-semibold">{pet.age}</span></div>
                  <div className="text-gray-700">Breed: <span className="font-semibold">{pet.breed}</span></div>
                </div>
                <div className="border-t border-blue-100 pt-4 mt-4">
                  <h4 className="font-semibold text-lg text-blue-700 mb-4">Medical Records</h4>
                  {medicalRecords[petKey]?.length > 0 ? (
                    medicalRecords[petKey].map((record) => (
                      <div
                        key={`${petKey}-${record.index}`}
                        className="mb-4 p-4 bg-blue-100 rounded-xl shadow hover:bg-blue-200 transition-colors duration-200"
                      >
                        <p className="text-sm text-blue-900 mb-1">
                          <span className="font-semibold">Date:</span> {new Date(record.visitDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-900 mb-1">
                          <span className="font-semibold">Reason:</span> {record.reason}
                        </p>
                        <p className="text-sm text-blue-900 mb-1">
                          <span className="font-semibold">Prescription:</span> {record.prescription}
                        </p>
                        {record.prescriptionFile && (
                          <a
                            href={`http://localhost:5001${record.prescriptionFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 text-xs hover:underline"
                          >
                            View Prescription File
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No medical records found</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PetMedicalRecords;
