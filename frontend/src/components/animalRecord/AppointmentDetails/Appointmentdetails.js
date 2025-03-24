import React from 'react'
import axios from "axios";
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate,useParams } from 'react-router-dom';




function Appointmentdetails() {
  const history = useNavigate();
  const {nic} = useParams();
  const [appoinment, setAppoinment] = useState([]);

    
      useEffect(() => {
        const fetchRecords = async () => {
            await axios
                .get(`http://localhost:5001/appointments`)
                .then((res) => setAppoinment(res.data.Appointments))  // Updated to match backend response
                .catch((err) => console.log("Error fetching records:", err));
        };
        fetchRecords();
    }, []);

    const deleteHandler = async (nic) => {
        await axios
            .delete(`http://localhost:5001/appointments/${nic}`)
            .then((res) => res.data)
            .then(() => {
                setAppoinment((prevAppointments) => prevAppointments.filter((appointment) => appointment.nic !== nic));
            })
            .catch((err) => console.log("Error deleting record:", err));
    };

    return(
      <div>
      <h1>Appointments</h1>

      <div>
 
   
      </div>

     <table style={{ width: "100%", border: "1px solid #ddd", borderCollapse: "collapse", marginTop: "20px" }}>
<thead>
  <tr>
      <th>Name</th>
      <th>Contact</th>
      <th>NIC</th>
      <th>Gmail</th>
      <th>Pet ID </th>
      <th>Appointment type</th>
      <th>Actions</th>
  </tr>
</thead>
<tbody>
  {Array.isArray(appoinment) && appoinment.length >  0 ? (
      appoinment.map((Appointment) => (
          <tr key={Appointment.nic}>

             <td>{Appointment.name}</td> 
              <td>{Appointment.contact}</td>
              <td>{Appointment.nic}</td>
              <td>{Appointment.gmail}</td>
              <td>{Appointment.petID}</td>
              <td>{Appointment.appointmentType}</td>
             
              <td>
              <Link to={`/appointmentdetails/${Appointment.nic}`}>
<button className='updatebtn'>Update</button>
</Link>
<button className="delete"   onClick={() => deleteHandler(Appointment.nic)}>Delete</button>

              </td>
          </tr>
      ))
  ) : (
      <tr>
          <td colSpan="7">No medical records available.</td>
      </tr>
  )}
</tbody>
</table>
    </div>
);
}

export default Appointmentdetails;
