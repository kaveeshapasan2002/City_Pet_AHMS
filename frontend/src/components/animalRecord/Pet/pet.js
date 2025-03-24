import React from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Pet(props) {
    const{id,name,age,breed,species,gender,bloodgroup,allergies,contact}=props.pet;
    const history = useNavigate();

const deleteHandler = async () => {
    await axios
        .delete(`http://localhost:5000/pets/${id}`)
        .then((res) => res.data)
        .then(() => {
            history("/petdetails"); // Navigate to the pet details page
            window.location.reload(); // Refresh the page to reflect changes
        })
        .catch((err) => console.log("Error deleting record:", err));
};



  return (
    <div  className="container1">
    <h1>Pet Details</h1>
    <table className="details-table">
        <tbody>
            <tr>
                <td>ID:</td>
                <td>{id}</td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>{name}</td>
            </tr>
            <tr>
                <td>Age:</td>
                <td>{age}</td>
            </tr>
            <tr>
                <td>Breed:</td>
                <td>{breed}</td>
            </tr>
            <tr>
                <td>Species:</td>
                <td>{species}</td>
            </tr>
            <tr>
                <td>Gender:</td>
                <td>{gender}</td>
            </tr>
            <tr>
                <td>Bloodgroup:</td>
                <td>{bloodgroup}</td>
            </tr>
            <tr>
    <td>Allergies:</td>
    <td>
        <textarea
            value={allergies}
            readOnly
            className="allergies-textarea"
        />
    </td>
</tr>            <tr>
                <td>Contact number of owner:</td>
                <td>{contact}</td>
            </tr>
        </tbody>
    </table>
    <div className="button-group">
        <Link to={`/petdetails/${id}`}>
            <button className="updatebtn">Update</button>
        </Link>
        <button 
  className="delete" 
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteHandler();
    }
  }}
>
  Delete
</button>
        <Link to={`/medicalrecords/${id}`}>
            <button className="record"> Records </button>
        </Link>
    </div>
   
</div>
  )
}

export default Pet;
