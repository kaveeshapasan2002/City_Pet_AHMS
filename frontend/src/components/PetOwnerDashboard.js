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
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PetOwnerDashboard = ({ contact }) => {
    const [pets, setPets] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch pets for the logged-in user
        const fetchPets = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/pets/bycontact/${contact}`);
                setPets(response.data.pets);
                
                // Fetch medical records for each pet
                for (const pet of response.data.pets || []) {
                    try {
                        const mediResponse = await axios.get(`http://localhost:5001/medies/${pet.petid}`);
                        setMedicalRecords(prev => ({
                            ...prev,
                            [pet.petid]: mediResponse.data.Medies
                        }));
                    } catch (err) {
                        console.error(`Error fetching records for pet ${pet.petid}:`, err);
                    }
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            } finally {
                setLoading(false);
            }
        };

        if (contact) {
            fetchPets();
        }
    }, [contact]);

    if (loading) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">My Pets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                    <div key={pet.petid} className="border rounded-lg p-4 shadow bg-white">
                        <h3 className="text-xl font-semibold">{pet.name}</h3>
                        <p>ID: {pet.petid}</p>
                        <p>Breed: {pet.breed}</p>
                        <p>Age: {pet.age}</p>
                        
                        <div className="mt-4">
                            <h4 className="font-semibold text-blue-600">Medical Records</h4>
                            {medicalRecords[pet.petid]?.length > 0 ? (
                                <div className="mt-2 overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-blue-500 text-white">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Index</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Reason</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Prescription</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {medicalRecords[pet.petid].map((record) => (
                                                <tr key={record.index}>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{record.index}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{new Date(record.visitDate).toLocaleDateString()}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm">{record.reason}</td>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                        {record.prescription}
                                                        {record.prescriptionFile && (
                                                            <a 
                                                                href={`http://localhost:5001${record.prescriptionFile}`}
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="ml-2 text-blue-600 hover:underline"
                                                            >
                                                                View File
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-2">No medical records found for this pet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetOwnerDashboard;
