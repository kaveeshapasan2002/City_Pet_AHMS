import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PetOwnerDashboard = ({ userContact }) => {
    const [pets, setPets] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState({});

    useEffect(() => {
        // Fetch pets for the logged-in user
        const fetchPets = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/pets/bycontact/${userContact}`);
                setPets(response.data.pets);
                
                // Fetch medical records for each pet
                response.data.pets.forEach(async (pet) => {
                    const mediResponse = await axios.get(`http://localhost:5000/api/medi/pet/${pet.id}`);
                    setMedicalRecords(prev => ({
                        ...prev,
                        [pet.id]: mediResponse.data.Medies
                    }));
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userContact) {
            fetchPets();
        }
    }, [userContact]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Pets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                    <div key={pet.id} className="border rounded-lg p-4 shadow">
                        <h3 className="text-xl font-semibold">{pet.name}</h3>
                        <p>ID: {pet.id}</p>
                        <p>Breed: {pet.breed}</p>
                        <p>Age: {pet.age}</p>
                        
                        <div className="mt-4">
                            <h4 className="font-semibold">Medical Records</h4>
                            {medicalRecords[pet.id]?.map((record, index) => (
                                <div key={index} className="mt-2 border-t pt-2">
                                    <p>Visit Date: {new Date(record.visitDate).toLocaleDateString()}</p>
                                    <p>Reason: {record.reason}</p>
                                    <p>Prescription: {record.prescription}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetOwnerDashboard;