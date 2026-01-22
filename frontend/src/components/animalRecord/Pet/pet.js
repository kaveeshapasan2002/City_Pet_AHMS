import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';



function Pet(props) {
    const{id,name,age,breed,species,gender,bloodgroup,allergies,contact}=props.pet;
    const history = useNavigate();
/*
const deleteHandler = async () => {
    await axios
        .delete(`/pets/${id}`)
        .then((res) => res.data)
        .then(() => {
            history("/petdetails"); // Navigate to the pet details page
            window.location.reload(); // Refresh the page to reflect changes
        })
        .catch((err) => console.log("Error deleting record:", err));
};*/

const deleteHandler = async () => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/pets/${id}`);
        
        if (response.status === 200) {
            console.log("Pet deleted successfully!");
            history("/petdetails"); 
            window.location.reload(); 
        } else {
            console.error("Failed to delete pet.");
        }
    } catch (error) {
        console.error("Error deleting record:", error);
    }
};




  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pet Details</h1>
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr className="border-b">
            <td className="p-2 font-semibold">ID:</td>
            <td className="p-2">{id}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Name:</td>
            <td className="p-2">{name}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Age:</td>
            <td className="p-2">{age}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Breed:</td>
            <td className="p-2">{breed}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Species:</td>
            <td className="p-2">{species}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Gender:</td>
            <td className="p-2">{gender}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Bloodgroup:</td>
            <td className="p-2">{bloodgroup}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Allergies:</td>
            <td className="p-2">
              <textarea value={allergies} readOnly className="w-full p-2 border rounded-md" />
            </td>
          </tr>
          <tr>
            <td className="p-2 font-semibold">Owner Contact:</td>
            <td className="p-2">{contact}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-4 mt-4">
        <Link to={`/petdetails/${id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Update
        </Link>
        <button
  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteHandler();
    }
  }}
>
  Delete
</button>
        <Link to={`/medicalrecords/${id}`} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Records
        </Link>
      </div>
    </div>
  )
}

export default Pet;
