// src/components/common/PhoneSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PhoneSearch = ({ onClientFound, onPetsFound, petOptions }) => {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handlePhoneSearch = async () => {
    if (!phoneSearch.trim()) {
      toast.warning('Please enter a phone number to search');
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Step 1: Find client by phone number
      const clientResponse = await axios.get('http://localhost:5001/api/invoice-users/petowners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          phonenumber: phoneSearch
        }
      });
      
      console.log('Client search response:', clientResponse.data);
      
      // Check if we found a client
      const foundClient = clientResponse.data.users && clientResponse.data.users.length > 0 
        ? clientResponse.data.users[0] 
        : null;
      
      // Step 2: Filter the already loaded petOptions
      const matchingPets = petOptions.filter(pet => {
        // Convert both to strings for comparison
        const petContact = pet.contact.toString();
        const searchPhone = phoneSearch.toString();
        
        // Try multiple phone formats
        const searchWithoutLeadingZero = searchPhone.replace(/^0+/, '');
        const searchWithLeadingZero = '0' + searchWithoutLeadingZero;
        const petWithoutLeadingZero = petContact.replace(/^0+/, '');
        
        // Check all variations
        return petContact === searchPhone || 
               petContact === searchWithLeadingZero ||
               petWithoutLeadingZero === searchWithoutLeadingZero;
      });
      
      console.log('Matching pets from existing data:', matchingPets);
      
      // Handle the client data if found
      if (foundClient) {
        // Call callback with found client
        onClientFound(foundClient);
        toast.success(`Found client: ${foundClient.name}`);
        
        // If we found matching pets, handle them
        if (matchingPets.length > 0) {
          // Call callback with found pets
          onPetsFound(matchingPets);
          
          toast.info(`Found ${matchingPets.length} pet(s) associated with this number`);
        } else {
          toast.info('No pets found for this client. Please select a pet from the dropdown.');
          // Still call the callback with empty array so parent component can handle this case
          onPetsFound([]);
        }
      } else {
        // No client found
        toast.info('No client found with this phone number. Please enter client details manually.');
        onClientFound(null);
        
        // If we found pets but no client, that's unusual but possible
        if (matchingPets.length > 0) {
          toast.info(`Found ${matchingPets.length} pet(s) with this contact number, but no matching client.`);
          onPetsFound(matchingPets);
        } else {
          onPetsFound([]);
        }
      }
    } catch (error) {
      console.error('Phone search failed:', error);
      toast.error('Search failed. Please try again.');
      onClientFound(null);
      onPetsFound([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Quick Search</h2>
      
      <div className="flex">
        <input
          type="text"
          value={phoneSearch}
          onChange={(e) => setPhoneSearch(e.target.value)}
          placeholder="Enter client phone number"
          className="flex-grow p-2 border rounded-l"
        />
        <button
          type="button"
          onClick={handlePhoneSearch}
          disabled={isSearching}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r ${isSearching ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSearching ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Find'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Search for client and their pets by phone number
      </p>
    </div>
  );
};

export default PhoneSearch;