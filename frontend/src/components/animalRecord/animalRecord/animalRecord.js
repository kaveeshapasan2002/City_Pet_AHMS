import React from 'react';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';


const URL = `http://localhost:5000/pets`;

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};



const AnimalRecord = (props) => {


  const [pets, setPets] = useState([]);

  const navigate = useNavigate();
  const history=useNavigate()
  const handleUpdateClick = () => {

    // Programmatically navigate to the pet details page
    navigate(`/${contact}`);
};
  const { contact } = useParams();
  // Sample pet data, replace this with props or fetched data
  const pet = {
    petid: '',
    name: '',
    age: '',
    breed: '',
    species: '',
    gender: '',
    bloodgroup: '',
    allergies: '',
    contact:''
  };
  const handleClick = () => {
    console.log("Navigating to medical records page...");
    navigate(`/medicalrecordsAsowner/${pet.petid}`);
};



  return (
    <div>
      <h1>Animal Record - Main Page</h1>

      {/* Pet Details View */}
      <h2>Pet Details</h2>
      
      <table>
        <tbody>
          <tr>
            <td>ID:</td>
            <td>{pet.petid}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{pet.name}</td>
          </tr>
          <tr>
            <td>Age:</td>
            <td>{pet.age}</td>
          </tr>
          <tr>
            <td>Breed:</td>
            <td>{pet.breed}</td>
          </tr>
          <tr>
            <td>Species:</td>
            <td>{pet.species}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{pet.gender}</td>
          </tr>
          <tr>
            <td>Bloodgroup:</td>
            <td>{pet.bloodgroup}</td>
          </tr>
          <tr>
            <td>Allergies:</td>
            <td>{pet.allergies}</td>
          </tr>
          <tr>
            <td>Contact number of ownner:</td>
            <td>{pet.contact}</td>
          </tr>
        
          <td>
    <button 
        className="record" 
        onClick={() => history(`/medicalrecordsAsowner/${pet.petid}`)}
    >
        Records
    </button>
</td>

       
<td>
        <div className="button-group">
              <Link to={`/petdetails/${pet.petid}`}>
              <button className="updatebtn" onClick={handleUpdateClick}>        Update
              </button>
              </Link>
              </div>

              </td>
        </tbody>
      </table> 

      {/* Navigation Links */}
      <div>
        <ul>
          <li>
            <Link to="/addpet">
              <button>Add Pet</button>
            </Link>
          </li>
          <li>
            <Link to={`/petdetails`}>
              <button>View Pet</button>
            </Link>
          </li>
   


          <li>
            <Link to="/addappointment">
              <button>Add Appointment</button>
            </Link>
          </li>
          <li>
            <Link to="/appointmentdetails">
              <button>View Appointment</button>
            </Link>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default AnimalRecord;
