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




    useEffect(() => {
        if (!petid) {
            console.log("petid is undefined");
            return;
        }
    
        const fetchRecords = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/medies/${petid}`);
                console.log("Fetched Medies:", res.data); 
                setMedies(res.data.Medies || res.data); 
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
              
            })
            .catch((err) => console.log("Error deleting record:", err));
    };
    

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: '2-digit',
    minute: '2-digit'
  });
}


const downloadPDF = () => {
  const doc = new jsPDF();


  const primaryBlue = [10, 70, 160];
  const lightBlue = [220, 230, 250];

 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...primaryBlue);
  doc.text("City Pet Care", 105, 18, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(...primaryBlue);
  doc.text("Medical Report", 105, 28, { align: "center" });


  doc.setDrawColor(...primaryBlue);
  doc.setLineWidth(0.8);
  doc.line(30, 32, 180, 32);


  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(0);
  doc.text(`Pet ID: ${petid}`, 30, 40);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryBlue);
  doc.text("Medical Records:", 30, 50);

  let yPosition = 58;

  Medies.forEach((medi, idx) => {
    
    const historyLabel = "• Medical History:";
    const historyText = medi.mediHistory || "";
    const wrappedHistory = doc.splitTextToSize(historyText, 135); 

    
    const baseBoxHeight = 50; 
    const lineHeight = 6;
    const historyHeight = wrappedHistory.length * lineHeight;
    const boxHeight = baseBoxHeight + historyHeight;

    
    doc.setFillColor(...lightBlue);
    doc.roundedRect(25, yPosition - 5, 160, boxHeight, 4, 4, 'F');

 
    doc.setTextColor(...primaryBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Record #${idx + 1}`, 30, yPosition + 3);

  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0);
    let textY = yPosition + 10;
    doc.text(`• Visit Date: ${formatDate(medi.visitDate)}`, 35, textY);
    textY += lineHeight;
    doc.text(`• Reason: ${medi.reason}`, 35, textY);
    textY += lineHeight;
    doc.text(`• Prescription: ${medi.prescription}`, 35, textY);
    textY += lineHeight;

   
    doc.text(historyLabel, 35, textY);
    textY += lineHeight;
    doc.text(wrappedHistory, 40, textY);

    yPosition += boxHeight + 8; 

    
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
  });

  
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for choosing City Pet Care!", 105, 285, { align: "center" });

  doc.save("Medical_Report.pdf");
};









    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Medical Records of Pet ID: {petid}
        </h1>

        <div className="flex justify-center space-x-4 mb-4">
            <Link to={`/addmedi/${petid}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
               
                    Add New Record
               
            </Link>
            <button 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={downloadPDF}
            >
                Download PDF Report
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-3 border border-gray-300">Index</th>
                        <th className="p-3 border border-gray-300">Pet ID</th>
                        <th className="p-3 border border-gray-300">Vaccination State</th>
                        <th className="p-3 border border-gray-300">Vaccination Date</th>
                        <th className="p-3 border border-gray-300">Visit Date</th>
                        <th className="p-3 border border-gray-300">Reason</th>
                        <th className="p-3 border border-gray-300">Prescription</th>
                        <th className="p-3 border border-gray-300">Medical History</th>
                        <th className="p-3 border border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(Medies) && Medies.length > 0 ? (
                        Medies.map((Medi) => (
                            <tr key={Medi.index} className="odd:bg-gray-100">
                                <td className="p-3 border border-gray-300">{Medi.index}</td>
                                <td className="p-3 border border-gray-300">{Medi.petid}</td>
                                <td className="p-3 border border-gray-300">{Medi.vaccinationState}</td>
                                <td className="p-3 border border-gray-300">{Medi.vaccinationDate}</td>
                                <td className="p-3 border border-gray-300">{Medi.visitDate}</td>
                                <td className="p-3 border border-gray-300">{Medi.reason}</td>
                                 <td className="p-3 border border-gray-300">{Medi.prescription}</td>
                             {/* <td>
                                {Medi.prescriptionFile ? (
                                    <a
                                    href={`http://localhost:5001/uploads/${Medi.prescriptionFile}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                    >
                                    View PDF
                                    </a>
                                ) : (
                                    <span className="text-gray-400">No PDF</span>
                                )}
                                </td> */} 




                                <td className="p-3 border border-gray-300">{Medi.mediHistory}</td>
                                <td className="p-3 border border-gray-300 flex space-x-2">
                                    <Link to={`/updatemedi/${petid}/${Medi.index}`}>
                                        <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                            Update
                                        </button>
                                    </Link>
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
                            <td colSpan="9" className="text-center p-4">
                                No medical records available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>


      
    );
}

export default MedicalRecord;
