import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import jsPDF from 'jspdf'




function MedicalRecord() {
    const history = useNavigate();
    const {id} = useParams();
    const {index} = useParams();
    const [Medies, setMedies] = useState([]);
    const{petid}=useParams();


    // Fetch medical records when the component mounts
  /* useEffect(() => {
        const fetchRecords = async () => {
            await axios
                .get(`http://localhost:5000/medies/${petid}`)
                .then((res) => setMedies(res.data.medies))  // Updated to match backend response
                .catch((err) => console.log("Error fetching records:", err));
        };
        fetchRecords();
    }, [petid]);
   */

    useEffect(() => {
        if (!petid) {
            console.log("petid is undefined");
            return;
        }
    
        const fetchRecords = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/medies/${petid}`);
                console.log("Fetched Medies:", res.data); // Log the full response to see the structure
                setMedies(res.data.Medies || res.data); // Adjust if needed
            } catch (err) {
                console.log("Error fetching records:", err);
            }
        };
        fetchRecords();
    }, [petid]);
    
    const deleteHandler = async (deleteIndex) => {
        await axios
            .delete(`http://localhost:5001/medies/${deleteIndex}`)
            .then((res) => res.data)
            .then(() => {
                setMedies((prevMedies) => prevMedies.filter((medi) => medi.index !== deleteIndex));
                history(`/medicalrecords/${index}`); // Navigate to the main medical records page
            })
            .catch((err) => console.log("Error deleting record:", err));
    };
/*
const ComponentsRef = useRef();

const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current, // Correctly return the ref
    documentTitle: "Medical Report",
    onAfterPrint: () => alert("Medical report successfully downloaded!")
});
*/


const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("Medical Report", 10, 10);
    
    doc.setFontSize(12);
    doc.text(`Pet ID: ${petid}`, 10, 20);

    let yPosition = 30;
    doc.text("Medical Records:", 10, yPosition);
    
    Medies.forEach((medi, index) => {
        yPosition += 10;
        doc.text(`Index: ${medi.index}`, 10, yPosition);
        yPosition += 5;
        doc.text(`Visit Date: ${medi.visitDate}`, 10, yPosition);
        yPosition += 5;
        doc.text(`Reason: ${medi.reason}`, 10, yPosition);
        yPosition += 5;
        doc.text(`Prescription: ${medi.prescription}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Medical History: ${medi.mediHistory}`, 10, yPosition);  
        yPosition += 10;
    });

    doc.save("Medical_Report.pdf");
};




    return (
        <div className="container">
            <h1>Medical Records Of Pet ID: {petid}</h1>
     
            <div>
            <Link to={`/addmedi/${petid}`} >
            <button>Add new record</button>
          </Link>
          <button onClick={downloadPDF}>Download PDF Report</button>
        
            </div>
         
           <table style={{ width: "100%", border: "1px solid #ddd", borderCollapse: "collapse", marginTop: "20px" }}>
    <thead>    
        <tr>
       
            <th>Index</th>
            <th>pet Id</th>
            <th>Vaccination State</th>
            <th>Vaccination Date</th>
            <th>Visit Date</th>
            <th>Reason</th>
            <th>Prescription</th>
            <th>Medical History</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>  
        {Array.isArray(Medies) && Medies.length >  0 ? (
            Medies.map((Medi) => (
                <tr key={Medi.index}>

                   <td>{Medi.index}</td> 
                   <td>{Medi.petid}</td>
                    <td>{Medi.vaccinationState}</td>
                    <td>{Medi.vaccinationDate}</td>
                    <td>{Medi.visitDate}</td>
                    <td>{Medi.reason}</td>
                    <td>{Medi.prescription}</td>
                    <td>{Medi.mediHistory}</td>
                    <td>
                    <Link to={`/updatemedi/${petid}/${Medi.index}`}>
    <button>Update</button>
</Link>
<button 
  className="delete" 
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteHandler(Medi.index);
    }
  }}
>
  Delete
</button>

                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7">No medical records available.</td>
            </tr>
        )}
    </tbody>
</table></div>


      
    );
}

export default MedicalRecord;
