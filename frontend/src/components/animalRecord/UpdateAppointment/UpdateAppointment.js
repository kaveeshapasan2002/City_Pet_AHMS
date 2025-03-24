import React ,{useEffect,useState }from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function UpdateAppointment() {
    const [inputs,setInputs]=useState({
        name:"",
        contact:"",
        nic:"",
        gmail:"",
        petID:"",
        appointmentType:""
    });
    const history=useNavigate();
    const { nic  } = useParams();

    useEffect(()=>{
        const fetchHandler=async()=>{
            await axios
            .get(`http://localhost:5001/appointments/${nic}`)
            .then((res)=>res.data)
            .then((data)=>setInputs(data.Appointments));
           
        };
        fetchHandler();
    },[nic]);  

    const sendRequest=async()=>{
        await axios.put(`http://localhost:5001/appointments/${nic}`,{ 
        name:String(inputs.name),
        contact:Number(inputs.contact),
        gmail:String(inputs.gmail),
        petID:String(inputs.petID),
        appointmentType:String(inputs.appointmentType),
    
      }).then(res=>res.data);
    }  
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
    history("/appointmentdetails"); // Navigate after successful form submission
  };
  return (
    <div>
        
        <h1>this is appoinment add form</h1>
            <form onSubmit={handleSubmit}>

            <label for="name"> Name:</label>
    <input type='text' name='name' onChange={handleChange} value={inputs.name}  required></input> <br></br>

    <label for="contact">contact:</label>
    <input type='text' name='contact' onChange={handleChange} value={inputs.contact}  required></input> <br></br>
    
    <label for="gmail">Gmail:</label>
    <input type='text' name='gmail' onChange={handleChange} value={inputs.gmail}  required></input> <br></br>
    
    <label for="petID">Pet ID:</label>
    <input type='text' name='petID' onChange={handleChange} value={inputs.petID}  required></input> <br></br>
    
    <label htmlFor="appointmentType">Appointment Type:</label>
  <label>
    <input type="radio" name="appointmentType" value="Vaccination" onChange={handleChange} checked={inputs.appointmentType === 'Vaccination'}  required /> Vaccination </label>
  <label>
    <input  type="radio"   name="appointmentType"   value="Emergency"   onChange={handleChange}   checked={inputs.appointmentType === 'Emergency'}  required  /> Emergency  </label>
<br />
<button>submit</button>

              </form>
      
    </div>
  )
}

export default UpdateAppointment
