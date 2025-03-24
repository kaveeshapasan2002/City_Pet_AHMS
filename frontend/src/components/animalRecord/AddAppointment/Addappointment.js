
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Addappointment() {
    const history=useNavigate();
    const [inputs,setInputs]=useState({
     
  
      name:"",
      contact:"",
      nic:"",
      gmail:"",
      petID:"",
      appointmentType:""
    });

    const handleChange=(e)=>{
      setInputs((prevState)=>({
        ...prevState,
        [e.target.name]:e.target.value,
      }));
    };
    const handleSubmit=(e)=>{
      e.preventDefault();
      console.log(inputs);
      sendRequest().then(()=>history('/appointmentdetails'))
    }
    const sendRequest=async()=>{
      await axios.post("http://localhost:5000/appointments",{
       
        name:String(inputs.name),
        contact:Number(inputs.contact),
        nic:String(inputs.nic),
        gmail:String(inputs.gmail),
        petID:String(inputs.petID),
        appointmentType:String(inputs.appointmentType),
    
      }).then(res=>res.data);
    }


  return (
    <div>
            <h1>this is appoinment add form</h1>
            <form onSubmit={handleSubmit}>

            <label for="name"> Name:</label>
    <input type='text' name='name' onChange={handleChange} value={inputs.name}  required></input> <br></br>

    <label for="contact">contact:</label>
    <input type='text' name='contact' onChange={handleChange} value={inputs.contact}  required></input> <br></br>
    
    <label for="nic">nic:</label>
    <input type='text' name='nic' onChange={handleChange} value={inputs.nic}  required></input> <br></br>
    
    <label for="gmail">Gmail:</label>
    <input type='text' name='gmail' onChange={handleChange} value={inputs.gmail}  required></input> <br></br>
    
    <label for="petID">Pet ID:</label>
    <input type='text' name='petID' onChange={handleChange} value={inputs.petID}  required></input> <br></br>
    
    <label htmlFor="appointmentType">Appointment Type:</label>
  <label>
    <input type="radio" name="appointmentType" value="Vaccination" onChange={handleChange} checked={inputs.appointmentType === 'Vaccination'}  required /> Vaccination </label>
  <label>
    <input  type="radio"   name="appointmentType"   value="Emergency"   onChange={handleChange}   checked={inputs.appointmentType === 'Emergency'}  required  /> Emergency  </label>
<br /><br/>
<button>submit</button>

              </form>
              
    </div>
  )
}

export default Addappointment
