import React ,{useEffect,useState }from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
        .get(`http://Localhost:5001/pets/${id}`)
        .then((res)=>res.data)
        .then((data)=>setInputs(data.pet));
       
    };
    fetchHandler();
},[id]);

const sendRequest=async()=>{
    await axios.put(`http://Localhost:5001/pets/${id}`,{
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
    <div>
      <h1>Update user</h1>
      <form onSubmit={handleSubmit}>
      <label for="id">Pet ID:</label>
    <input type='text' name='id' onChange={handleChange} value={inputs.id} required></input> <br></br>
   
    <label for="name">Pet Name:</label>
    <input type='text' name='name' onChange={handleChange} value={inputs.name}  required></input> <br></br>
    
    <label for="age">Age:</label>
    <input type='text' name='age' onChange={handleChange}  value={inputs.age} required></input> <br></br>
    
    <label for="breed">Breed:</label>
    <input type='text' name='breed' onChange={handleChange}  value={inputs.breed} required></input> <br></br>

    <label for="species">Species :</label>
    <input type='text' name='species' onChange={handleChange} value={inputs.species} required></input> <br></br>

    <label htmlFor="gender">Gender:</label>
  <label>
    <input type="radio" name="gender" value="Male" onChange={handleChange} checked={inputs.gender === 'Male'}  required /> Male </label>
  <label>
    <input  type="radio"   name="gender"   value="Female"   onChange={handleChange}   checked={inputs.gender === 'Female'}  required  /> Femal  </label>
<br />

    <label htmlFor="bloodgroup">Blood Group: </label>
<select   name="bloodgroup"   onChange={handleChange}   value={inputs.bloodgroup}   required
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
<br />
<label for="allergies">Allergies :</label>
    <input type='text' name='allergies' onChange={handleChange} value={inputs.allergies} required></input> <br></br>

    <label for="contact">Contact number of owner :</label>
    <input type='text' name='contact' onChange={handleChange} value={inputs.contact} required></input> <br></br>

    <button>submit</button>
      </form>
    </div>
  )
}

export default UpdatePet;
