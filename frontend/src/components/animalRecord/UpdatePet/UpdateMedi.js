import React ,{useEffect,useState }from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function UpdateMedi() {
  
  
    
  const [inputs,setInputs]=useState({

    petid:"",
    vaccinationState:"",
    vaccinationDate:"",
    visitDate:"",
    reason:"",
    prescription:"",
    mediHistory:""

});
const navigate=useNavigate();
const { index  } = useParams();
const{petid}=useParams()

  useEffect(()=>{
    const fetchHandler=async()=>{
        await axios
        .get(`http://localhost:5001/medies/index/${index}`)
        .then((res)=>res.data)
        .then((data)=>setInputs(data.Medies));
       
    };
    fetchHandler();
},[index]);

const sendRequest=async()=>{
    await axios.put(`http://localhost:5001/medies/${index}`,{
      index: Number(inputs.index),
      vaccinationState:String(inputs.vaccinationState),
      vaccinationDate: inputs.vaccinationState === "Yes" ? Date(inputs.vaccinationDate) : null, 
      visitDate:Date(inputs.visitDate),
      reason:String(inputs.reason),
      prescription:String(inputs.prescription),
      mediHistory:String(inputs.mediHistory),
     
  
    }).then(res=>res.data.Medi);
  };
  const handleChange=(e)=>{
    setInputs((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value,
    }));
  };
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest(); // Wait for the request to complete
    navigate(`/medicalrecords/${inputs.petid}`) // Navigate after successful form submission
  };



  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Update Medical Record</h1>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div>
        <label className="block text-gray-700 font-medium">Vaccination State:</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="vaccinationState" value="Yes" onChange={handleChange} checked={inputs.vaccinationState === 'Yes'} required className="h-4 w-4 text-blue-600" />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="vaccinationState" value="No" onChange={handleChange} checked={inputs.vaccinationState === 'No'} required className="h-4 w-4 text-blue-600" />
            <span>No</span>
          </label>
        </div>
      </div>

      {inputs.vaccinationState === 'Yes' && (
        <div>
          <label className="block text-gray-700 font-medium">Last Vaccination Date:</label>
          <input type='date' name='vaccinationDate' onChange={handleChange} value={inputs.vaccinationDate} max={new Date().toISOString().split('T')[0]} required className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
        </div>
      )}
      
      
      <div>
        <label className="block text-gray-700 font-medium">Visit Date:</label>
        <input type='date' name='visitDate' onChange={handleChange} value={inputs.visitDate} max={new Date().toISOString().split('T')[0]} required className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
      </div>
      
      
      <div className="mb-4">
  <label className="block text-gray-700 font-medium">Reason for Visit:</label>
  <select
    name="reason"
    onChange={handleChange}
    value={inputs.reason}
    required
    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
  >
    <option value="" disabled>Select a reason</option>
    <option value="Vaccination">Vaccination</option>
    <option value="General Checkup">General Checkup</option>
    <option value="Emergency Visit">Emergency Visit</option>
    <option value="Dental Care">Dental Care</option>
    <option value="Surgery">Surgery</option>
    <option value="Deworming">Deworming</option>
    <option value="Grooming">Grooming</option>
  </select>
</div>

      
      
      <div>
        <label className="block text-gray-700 font-medium">Prescription:</label>
        <input type='text' name='prescription' onChange={handleChange} value={inputs.prescription} required className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300" />
      </div>
      
     
      <div>
        <label className="block text-gray-700 font-medium">Medical History:</label>
        <textarea name="mediHistory" onChange={handleChange} value={inputs.mediHistory} required rows="4" placeholder="Enter medical history here..." className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"></textarea>
      </div>

     
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
        Update Record
      </button>
    </form>
  </div>
  )
}

export default UpdateMedi ;
