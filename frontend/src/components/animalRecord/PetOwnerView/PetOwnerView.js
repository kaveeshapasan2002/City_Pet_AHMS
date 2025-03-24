import React from 'react';
import { Link } from 'react-router-dom';


function PetOwnerView(props) {
    const { id, name, age, breed, species, gender, bloodgroup, allergies,contact } = props.pet;

    return (
        <div className="container1">
            <h1>Pet Details for Owner</h1>
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
                    </tr>
                    <tr>
                        <td>Contact number of owner:</td>
                        <td>{contact}</td>
                    </tr>
                </tbody>
            </table>
            <div className="button-group">
                <Link to={`/medicalrecords/${id}`}>
                    <button className="record"> Records </button>
                </Link>
            </div>
        </div>
    );
}

export default PetOwnerView;