import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, } from 'react-router-dom';


function AddMedi() {
  const navigate=useNavigate();

 
 

  const [inputs,setInputs]=useState({
   
    petid:"",
    vaccinationState:"",
    vaccinationDate:"",
    visitDate:"",
    reason:"",
    prescription:"",
    mediHistory:""

  }); 
  const handleChange=(e)=>{
    setInputs((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value,
    }));
  };
 

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
     
        await sendRequest();
  
        navigate(`/medicalrecords/${inputs.petid}`);
      } catch (error) {
        console.log('Error submitting form:', error);
      }
    };
  

  const sendRequest=async()=>{
    await axios.post("http://localhost:5000/medies",{
      petid:String(inputs.petid),
      vaccinationState:String(inputs.vaccinationState),
      vaccinationDate: inputs.vaccinationState === "Yes" ? String(inputs.vaccinationDate) : null, 
      visitDate:String(inputs.visitDate),
      reason:String(inputs.reason),
      prescription:String(inputs.prescription),
      mediHistory:String(inputs.mediHistory),
     
  
    }).then(res=>res.data.Medi);
  }
  return (
    <div>
    <h1>Add medical record</h1>
    <form onSubmit={handleSubmit}>
    <label for="id">Pet ID:</label>
  <input type='text' name='petid' onChange={handleChange} value={inputs.petid} required></input> <br></br>

  <label htmlFor="vaccinationState">Vaccination State:</label>
<label>
  <input type="radio" name="vaccinationState" value="Yes" onChange={handleChange} checked={inputs.vaccinationState === 'Yes'}  required /> Yes </label>
<label>
  <input  type="radio"   name="vaccinationState"   value="No"   onChange={handleChange}   checked={inputs.vaccinationState === 'No'}  required  /> No  </label>
<br />
<br/>
{inputs.vaccinationState === 'Yes' && (
  <>
    <label htmlFor="vaccinationDate">Last Vaccination Date  : </label>
    <input 
      type='date' 
      name='vaccinationDate' 
      onChange={handleChange}  
      value={inputs.vaccinationDate} 
      max={new Date().toISOString().split('T')[0]} 
      required 
    />
    <br />
    <br/>
  </>
)}
    <label htmlFor="visitDate">Visit Date  :       </label>
    <input 
      type='date' 
      name='visitDate' 
      onChange={handleChange}  
      value={inputs.visitDate} 
      max={new Date().toISOString().split('T')[0]} 
      required 
    />
    <br />
    <br/>

  <label for="reason">Reason for visit :</label>
  <input type='text' name='reason' onChange={handleChange} value={inputs.reason} required></input> <br></br>

  <label for="prescription">Prescription :</label>
  <input type='text' name='prescription' onChange={handleChange} value={inputs.prescription} required></input> <br></br>

  <label htmlFor="mediHistory">Medical History :</label>
<textarea 
    name="mediHistory"  onChange={handleChange} value={inputs.mediHistory}  required  rows="4" cols="50" placeholder="Enter medical history here..."
></textarea>
<br></br>


<button onClick={handleSubmit}>Submit</button>
    </form>
  </div>
  )
}

export default AddMedi;
