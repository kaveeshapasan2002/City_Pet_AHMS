import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';




function Addpet() {
  const history=useNavigate();
  const [inputs,setInputs]=useState({
   
    id:"",
    name:"",
    age:"",
    breed:"",
    species:"",
    gender:"",
    bloodgroup:"",
    allergies:"",
    contact:""



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
  sendRequest().then(()=>history('/petdetails'))
}
const sendRequest=async()=>{
  await axios.post("http://Localhost:5001/pets",{
    id:String(inputs.id),
    name:String(inputs.name),
    age:Number(inputs.age),
    breed:String(inputs.breed),
    species:String(inputs.species),
    gender:String(inputs.gender),
    bloodgroup:String(inputs.bloodgroup),
    allergies:String(inputs.allergies),
    contact:Number(inputs.contact)

  }).then(res=>res.data);
}



  return ( /*
    <div>
      <h1>Add pet details</h1>
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
<label for="contact">Allergies :</label>
    <input type='text' name='allergies' onChange={handleChange} value={inputs.allergies} required></input> <br></br>
    
    <label for="contact">Contact number of owner :</label>
    <input type='text' name='contact' onChange={handleChange} value={inputs.contact} required></input> <br></br>

    <button>submit</button>
      </form>
    </div>

  )
};

export default Addpet;*/
<div style={styles.container}>
<h1 style={styles.heading}>Add Pet Details</h1>
<form onSubmit={handleSubmit} style={styles.form}>
  <label htmlFor="id" style={styles.label}>Pet ID:</label>
  <input type='text' name='id' onChange={handleChange} value={inputs.id} required style={styles.input} />

  <label htmlFor="name" style={styles.label}>Pet Name:</label>
  <input type='text' name='name' onChange={handleChange} value={inputs.name} required style={styles.input} />

  <label htmlFor="age" style={styles.label}>Age:</label>
  <input type='text' name='age' onChange={handleChange} value={inputs.age} required style={styles.input} />

  <label htmlFor="breed" style={styles.label}>Breed:</label>
  <input type='text' name='breed' onChange={handleChange} value={inputs.breed} required style={styles.input} />

  <label htmlFor="species" style={styles.label}>Species:</label>
  <input type='text' name='species' onChange={handleChange} value={inputs.species} required style={styles.input} />

  <label htmlFor="gender" style={styles.label}>Gender:</label>
  <div style={styles.radioContainer}>
    <label>
      <input type="radio" name="gender" value="Male" onChange={handleChange} checked={inputs.gender === 'Male'} required />
      Male
    </label>
    <label>
      <input type="radio" name="gender" value="Female" onChange={handleChange} checked={inputs.gender === 'Female'} required />
      Female
    </label>
  </div>

  <label htmlFor="bloodgroup" style={styles.label}>Blood Group:</label>
  <select name="bloodgroup" onChange={handleChange} value={inputs.bloodgroup} required style={styles.input}>
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

  <label htmlFor="allergies" style={styles.label}>Allergies:</label>
  <input type='text' name='allergies' onChange={handleChange} value={inputs.allergies} required style={styles.input} />

  <label htmlFor="contact" style={styles.label}>Contact Number:</label>
  <input type='text' name='contact' onChange={handleChange} value={inputs.contact} required style={styles.input} />

  <button style={styles.button}>Submit</button>
</form>
</div>
)
};

const styles = {
container: {
width: '50%',
margin: '20px auto',
padding: '20px',
borderRadius: '8px',
boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
backgroundColor: '#f7f7f7',
},
heading: {
textAlign: 'center',
marginBottom: '20px',
fontSize: '28px',
color: '#333',
},
form: {
display: 'flex',
flexDirection: 'column',
gap: '12px',
},
label: {
fontWeight: 'bold',
marginBottom: '5px',
color: '#555',
},
input: {
padding: '8px',
borderRadius: '4px',
border: '1px solid #ccc',
marginBottom: '10px',
outline: 'none',
},
radioContainer: {
display: 'flex',
gap: '20px',
marginBottom: '10px',
},
button: {
padding: '10px',
borderRadius: '4px',
backgroundColor: '#007bff',
color: '#fff',
border: 'none',
cursor: 'pointer',
marginTop: '10px',
}
};

export default Addpet;
