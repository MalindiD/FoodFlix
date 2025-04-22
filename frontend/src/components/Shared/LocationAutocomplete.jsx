// src/components/Shared/LocationAutocomplete.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LocationAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get('https://api.locationiq.com/v1/autocomplete', {
        params: {
          key: process.env.REACT_APP_LOCATIONIQ_KEY,
          q: value,
          format: 'json',
        }
      });

      setResults(res.data);
    } catch (err) {
      console.error('Location search failed', err);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setResults([]);
    onSelect(place);
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Enter delivery address"
        className="w-full px-4 py-2 border rounded focus:outline-none"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-auto shadow-lg">
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(place)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
