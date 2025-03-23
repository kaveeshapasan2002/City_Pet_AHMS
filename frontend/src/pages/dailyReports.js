import React, { useState } from 'react';

const DailyReport = () => {

    console.log("daily report is rendering");
  const [formData, setFormData] = useState({
    mood: '',
    hydration: '',
    medicalRecords: '',
    specialNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    // Example API call:
    // api.postDailyReport(formData);
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Daily Report</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="mood" className="block text-gray-700 text-sm font-medium mb-2">
            Mood
          </label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>Select your mood</option>
            <option value="Energetic">Energetic</option>
            <option value="Happy">Happy</option>
            <option value="Normal">Normal</option>
            <option value="Not so active">Not so active</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="hydration" className="block text-gray-700 text-sm font-medium mb-2">
            Hydration (glasses of water)
          </label>
          <input
            type="number"
            id="hydration"
            name="hydration"
            min="0"
            value={formData.hydration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="medicalRecords" className="block text-gray-700 text-sm font-medium mb-2">
            Medical Records
          </label>
          <input
            type="text"
            id="medicalRecords"
            name="medicalRecords"
            value={formData.medicalRecords}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="specialNotes" className="block text-gray-700 text-sm font-medium mb-2">
            Special Notes
          </label>
          <textarea
            id="specialNotes"
            name="specialNotes"
            rows="3"
            value={formData.specialNotes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyReport;