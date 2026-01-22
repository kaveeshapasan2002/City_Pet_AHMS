import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import jsPDF from 'jspdf'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';




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
                const res = await axios.get(`${API_BASE_URL}/medies/${petid}`);
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
            .delete(`${API_BASE_URL}/medies/${deleteIndex}`)
            .then((res) => res.data)
            .then(() => {
                setMedies((prevMedies) => prevMedies.filter((medi) => medi.index !== deleteIndex));
                history(`/medicalrecords/${index}`); 
            })
            .catch((err) => console.log("Error deleting record:", err));
    };

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
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Medical Records of Pet ID: {petid}
        </h1>

        <div className="flex justify-center space-x-4 mb-4">
            <Link to={`/addmedi/${petid}`}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add New Record
                </button>
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
