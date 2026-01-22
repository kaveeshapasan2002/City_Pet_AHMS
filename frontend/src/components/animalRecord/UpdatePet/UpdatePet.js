import React ,{useEffect,useState }from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function UpdatePet() {
const [inputs,setInputs]=useState ({
  id: "", 
  name:"",
  age:"",
  breed:"",
  species:"",
  gender:"",
  bloodgroup:"",
  allergies:"",
  contact:""
});
const history=useNavigate();
const {id} = useParams();

useEffect(()=>{
    const fetchHandler=async()=>{
        await axios
        .get(`${API_BASE_URL}/pets/${id}`)
        .then((res)=>res.data)
        .then((data)=>setInputs(data.pet));
       
    };
    fetchHandler();
},[id]);

const sendRequest=async()=>{
    await axios.put(`${API_BASE_URL}/pets/${id}`,{
      name:String(inputs.name),
      age:Number(inputs.age),
      breed:String(inputs.breed),
      species:String(inputs.species),
      gender:String(inputs.gender),
      bloodgroup:String(inputs.bloodgroup),
      allergies:String(inputs.allergies),
      contact:Number(inputs.contact)
  
    })
    .then((res)=>res.data);
};
const handleChange=(e)=>{
    setInputs((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value,
    }));
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>history("/petdetails"))
  }


  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Pet</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
    
      <div>
        <label className="block font-medium text-gray-700">Pet ID:</label>
        <input
          type="text"
          name="id"
          value={inputs.id}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
        />
      </div>


      <div>
        <label className="block font-medium text-gray-700">Pet Name:</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={inputs.name}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

  
      <div>
        <label className="block font-medium text-gray-700">Age:</label>
        <input
          type="number"
          name="age"
          onChange={handleChange}
          value={inputs.age}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

     
      <div>
        <label className="block font-medium text-gray-700">Breed:</label>
        <input
          type="text"
          name="breed"
          onChange={handleChange}
          value={inputs.breed}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>


      <div>
        <label className="block font-medium text-gray-700">Species:</label>
        <input
          type="text"
          name="species"
          onChange={handleChange}
          value={inputs.species}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

    
      <div>
        <label className="block font-medium text-gray-700">Gender:</label>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              checked={inputs.gender === 'Male'}
              required
              className="accent-blue-500"
            />
            Male
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
              checked={inputs.gender === 'Female'}
              required
              className="accent-pink-500"
            />
            Female
          </label>
        </div>
      </div>

    
      <div>
        <label className="block font-medium text-gray-700">Blood Group:</label>
        <select
          name="bloodgroup"
          onChange={handleChange}
          value={inputs.bloodgroup}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

     
      <div>
        <label className="block font-medium text-gray-700">Allergies:</label>
        <input
          type="text"
          name="allergies"
          onChange={handleChange}
          value={inputs.allergies}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

    
      <div>
        <label className="block font-medium text-gray-700">Contact Number:</label>
        <input
          type="text"
          name="contact"
          onChange={handleChange}
          value={inputs.contact}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

     
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Update Pet
      </button>
    </form>
  </div>
  )
}

export default UpdatePet;
