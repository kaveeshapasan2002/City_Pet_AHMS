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
    <div>
      <h1>this is Medi Update form</h1>
      <form onSubmit={handleSubmit}>

  <label htmlFor="vaccinationState">Vaccination State:</label>
<label>
  <input type="radio" name="vaccinationState" value="Yes" onChange={handleChange} checked={inputs.vaccinationState === 'Yes'}  required /> Yes </label>
<label>
  <input  type="radio"   name="vaccinationState"   value="No"   onChange={handleChange}   checked={inputs.vaccinationState === 'No'}  required  /> No  </label>
<br />
{inputs.vaccinationState === 'Yes' && (
  <>
    <label htmlFor="vaccinationDate">Last Vaccination Date:</label>
    <input 
      type='date' 
      name='vaccinationDate' 
      onChange={handleChange}  
      value={inputs.vaccinationDate} 
      max={new Date().toISOString().split('T')[0]} 
      required 
    />
    <br />
  </>
)}
    <label htmlFor="visitDate">Visit Date </label>
    <input 
      type='date' 
      name='visitDate' 
      onChange={handleChange}  
      value={inputs.visitDate} 
      max={new Date().toISOString().split('T')[0]} 
      required 
    />
    <br />

  <label for="reason">Reason :</label>
  <input type='text' name='reason' onChange={handleChange} value={inputs.reason} required></input> <br></br>

  <label for="prescription">Prescription :</label>
  <input type='text' name='prescription' onChange={handleChange} value={inputs.prescription} required></input> <br></br>

  <label htmlFor="mediHistory">Medical History :</label>
<textarea 
    name="mediHistory"  onChange={handleChange} value={inputs.mediHistory}  required  rows="4" cols="50" placeholder="Enter reason here..."
></textarea>
<br></br>


<button>Submit</button>
    </form>
    </div>
  )
}

export default UpdateMedi ;
