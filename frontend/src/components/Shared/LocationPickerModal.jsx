// src/components/Shared/LocationPickerModal.jsx
import React from 'react';
import LocationAutocomplete from './LocationAutocomplete';

const LocationPickerModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-[#ec5834]">Select Delivery Location</h2>
        <LocationAutocomplete
          onSelect={(place) => {
            onSelect(place.display_name);
            onClose();
          }}
        />
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-600 hover:text-red-500 w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LocationPickerModal;
