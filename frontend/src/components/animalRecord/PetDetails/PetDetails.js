import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pet from '../Pet/pet';



const URL="http://Localhost:5000/pets";

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
    <div>
     <input onChange={(e)=>setSearchQuery(e.target.value)}
     type="text"
     name="search"
     placeholder='Search Pets by ID'>
     </input>
     <button onClick={handleSearch}>Search</button> 
     {noResult ?(
      <div>
        <p>No pets found</p>
        </div>
     ):(
      <div>
        {pets&& pets.map((pets,i)=>(
          <div key={i}>
            <Pet pet={pets}/>
            </div>
        ))}


      </div>
      )}
    </div>
  )
}

export default PetDetails;
