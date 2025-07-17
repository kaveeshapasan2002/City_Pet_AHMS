import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pet from '../Pet/pet';



const URL="http://Localhost:5001/pets";

const fetchHandler=async ()=>{
  return await axios.get(URL).then((res)=>res.data);
}

function PetDetails() {


const[pets,setPets]=useState();
useEffect(()=>{
  fetchHandler().then((data)=>setPets(data.pets));
},[])

 const[searchQuery,setSearchQuery]=useState("");
 const[noResult,setNoResult]=useState(false);

const handleSearch=()=>{
  setNoResult(false);
  fetchHandler().then((data)=>{
    const filteredUsers=data.pets.filter((pet)=>
    Object.values(pet).some((field)=>
    field.toString().toLowerCase().includes(searchQuery.toLowerCase())
  ))
  setPets(filteredUsers);
  setNoResult(filteredUsers.length===0);
  if (filteredUsers.length === 0) {
    alert("No pets found!");
  }
  });
}
 
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Pet Records</h1>

    {/* Searchbar */}
    <div className="flex items-center gap-2 mb-6">
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search Pets by Name, ID, Breed..."
        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Search
      </button>
    </div>

    
    {noResult && (
      <p className="text-red-500 text-center font-semibold">No pets found.</p>
    )}

   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pets && pets.map((pet, i) => (
        <div key={i} className="p-4 border rounded-lg shadow-md bg-gray-100">
          <Pet pet={pet} />
        </div>
      ))}
    </div>
  </div>
  )
}

export default PetDetails;
