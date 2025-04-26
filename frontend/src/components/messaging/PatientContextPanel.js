// src/components/messaging/PatientContextPanel.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaPaw, FaCalendarAlt, FaFileAlt, FaInfoCircle, FaClipboard } from 'react-icons/fa';

const PatientContextPanel = ({ petOwnerId, onInsertTemplate }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [messageTemplates] = useState([
    {
      id: 1,
      title: 'Appointment Reminder',
      text: 'Hi, this is a friendly reminder about your upcoming appointment for [pet_name] on [date]. Please let us know if you need to reschedule.'
    },
    {
      id: 2,
      title: 'Medication Reminder',
      text: "Just checking in about [pet_name]'s medication. Have you been administering it as prescribed? Any side effects to report?"
    },
    {
      id: 3,
      title: 'Follow-up',
      text: "How is [pet_name] doing after the recent visit? Has there been any improvement in the symptoms we discussed?"
    },
    {
      id: 4,
      title: 'Test Results',
      text: "Good news! [pet_name]'s test results have come back and everything looks normal. Let me know if you have any questions."
    }
  ]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Handle pet selection
  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
  };

  // Handle template insertion
  const handleInsertTemplate = (template) => {
    if (!onInsertTemplate || !selectedPet) return;
    
    // Replace placeholders with actual values
    let text = template.text;
    text = text.replace('[pet_name]', selectedPet.name);
    
    // If there's an upcoming appointment, use its date
    if (appointments.length > 0) {
      const upcomingAppointment = appointments.find(
        apt => new Date(apt.date) > new Date()
      );
      
      if (upcomingAppointment) {
        text = text.replace('[date]', formatDate(upcomingAppointment.date));
      }
    }
    
    onInsertTemplate(text);
  };

  // Load pets for the pet owner
  useEffect(() => {
    if (!petOwnerId) return;
    
    const loadPets = async () => {
      setLoading(true);
      try {
        // You'll need to implement this API endpoint
        const response = await axios.get(`/api/users/${petOwnerId}/pets`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setPets(response.data);
        if (response.data.length > 0) {
          setSelectedPet(response.data[0]);
        }
      } catch (err) {
        setError('Failed to load pets');
      } finally {
        setLoading(false);
      }
    };
    
    loadPets();
  }, [petOwnerId]);

  // Load appointments and medical records when a pet is selected
  useEffect(() => {
    if (!selectedPet) return;
    
    const loadPetDetails = async () => {
      setLoading(true);
      try {
        // Load appointments
        const appointmentsResponse = await axios.get(`/api/pets/${selectedPet._id}/appointments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setAppointments(appointmentsResponse.data);
        
        // Load medical records
        const recordsResponse = await axios.get(`/api/pets/${selectedPet._id}/medical-records`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setMedicalRecords(recordsResponse.data);
      } catch (err) {
        setError('Failed to load pet details');
      } finally {
        setLoading(false);
      }
    };
    
    loadPetDetails();
  }, [selectedPet]);

  // Only render if user is a veterinarian
  if (user.role !== 'Veterinarian') {
    return null;
  }

  if (loading && !selectedPet) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !selectedPet) {
    return (
      <div className="p-4 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        <p>No pets found for this owner</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Panel header */}
      <div className="bg-blue-600 text-white p-3">
        <h3 className="font-semibold">Patient Context</h3>
      </div>
      
      {/* Pet selector */}
      {pets.length > 0 && (
        <div className="p-3 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Pet:
          </label>
          <select
            value={selectedPet?._id || ''}
            onChange={(e) => {
              const selected = pets.find(p => p._id === e.target.value);
              if (selected) handlePetSelect(selected);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pets.map(pet => (
              <option key={pet._id} value={pet._id}>
                {pet.name} ({pet.species} - {pet.breed})
              </option>
            ))}
          </select>
        </div>
      )}
      
      {selectedPet && (
        <>
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('info')}
            >
              <FaInfoCircle className="inline mr-1" /> Info
            </button>
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium ${
                activeTab === 'appointments'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              <FaCalendarAlt className="inline mr-1" /> Appointments
            </button>
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium ${
                activeTab === 'records'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('records')}
            >
              <FaFileAlt className="inline mr-1" /> Records
            </button>
            <button
              className={`flex-1 py-2 px-3 text-sm font-medium ${
                activeTab === 'templates'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              <FaClipboard className="inline mr-1" /> Templates
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-3 max-h-[300px] overflow-y-auto">
            {/* Info tab */}
            {activeTab === 'info' && (
              <div>
                <div className="mb-3">
                  <div className="flex items-center">
                    <FaPaw className="text-blue-600 mr-2" />
                    <h4 className="font-semibold text-lg">{selectedPet.name}</h4>
                  </div>
                  <div className="ml-6 text-sm text-gray-600">
                    <p><span className="font-medium">Species:</span> {selectedPet.species}</p>
                    <p><span className="font-medium">Breed:</span> {selectedPet.breed}</p>
                    <p><span className="font-medium">Age:</span> {selectedPet.age} years</p>
                  </div>
                </div>
                
                {selectedPet.medicalHistory && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-700 mb-1">Medical History Summary:</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {selectedPet.medicalHistory}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Appointments tab */}
            {activeTab === 'appointments' && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Appointments</h4>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-gray-500">No appointments found</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {appointments.map(apt => (
                      <li key={apt._id} className="py-2">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">{formatDate(apt.date)}</div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            new Date(apt.date) > new Date()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {new Date(apt.date) > new Date() ? 'Upcoming' : 'Past'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{apt.reason || 'General checkup'}</p>
                        {apt.notes && (
                          <p className="text-xs text-gray-500 mt-1">{apt.notes}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* Medical records tab */}
            {activeTab === 'records' && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Medical Records</h4>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : medicalRecords.length === 0 ? (
                  <p className="text-sm text-gray-500">No medical records found</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {medicalRecords.map(record => (
                      <li key={record._id} className="py-2">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">{formatDate(record.date)}</div>
                          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {record.type || 'Examination'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{record.diagnosis}</p>
                        {record.treatment && (
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Treatment:</span> {record.treatment}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {/* Message templates tab */}
            {activeTab === 'templates' && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Message Templates</h4>
                <ul className="divide-y divide-gray-200">
                  {messageTemplates.map(template => (
                    <li key={template.id} className="py-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">{template.title}</div>
                        <button
                          onClick={() => handleInsertTemplate(template)}
                          className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          Insert
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">{template.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientContextPanel;