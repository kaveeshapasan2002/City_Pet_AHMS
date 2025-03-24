import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
function PetProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState({});

    const handleUpdate = () => {
        navigate(`/petdetails/${id}`);
    };


    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/pets/${id}`);
                setPet(res.data.Pet);
            } catch (err) {
                console.log("Error fetching pet details:", err);
            }
        };
        fetchPetDetails();
    }, [id]);

    return (
        
        <div className="pet-profile">
        <h1>Pet Profile</h1>
        <table className="details-table">
            <tbody>
                <tr>
                    <td>ID:</td>
                    <td>{pet.id}</td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{pet.name}</td>
                </tr>
                <tr>
                    <td>Age:</td>
                    <td>{pet.age}</td>
                </tr>
                <tr>
                    <td>Breed:</td>
                    <td>{pet.breed}</td>
                </tr>
                <tr>
                    <td>Species:</td>
                    <td>{pet.species}</td>
                </tr>
                <tr>
                    <td>Gender:</td>
                    <td>{pet.gender}</td>
                </tr>
                <tr>
                    <td>Blood Group:</td>
                    <td>{pet.bloodgroup}</td>
                </tr>
                <tr>
                    <td>Allergies:</td>
                    <td>
                        <textarea
                            value={pet.allergies}
                            readOnly
                            className="allergies-textarea"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
        <div style={{ textAlign: "center", margin: "20px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <button onClick={handleUpdate}>Update Pet Details</button>

            </div>
        </div>
    </div>

    );
}

export default PetProfile;
