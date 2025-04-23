import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import LocationPickerModal from '../../components/Shared/LocationPickerModal';
import { MapPin, User, CreditCard } from 'lucide-react';

const DeliveryDetailsPage = () => {
  const navigate = useNavigate();
  const { subtotal } = useCart();
  
  // State management
  const [location, setLocation] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [showInstructionsInput, setShowInstructionsInput] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  
  // Calculate delivery fee based on location (simplified example)
  // In a real app, this would be calculated based on distance
  const [deliveryFee, setDeliveryFee] = useState(39.00);
  const fees = 33.40; // Example service fee
  const total = subtotal + deliveryFee + fees;
  
  useEffect(() => {
    // Load location from localStorage (set by Navbar component)
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) setLocation(savedLocation);
    
    // Load any previously saved delivery instructions
    const savedInstructions = localStorage.getItem('deliveryInstructions');
    if (savedInstructions) setDeliveryInstructions(savedInstructions);
  }, []);
  
  // Calculate delivery fee based on location (simplified)
  const calculateDeliveryFee = (loc) => {
    // This is where you would implement your distance-based calculation
    // For example, using a Google Maps Distance Matrix API
    // For now, returning a fixed fee
    return 39.00;
  };
  
  const handleSaveInstructions = () => {
    setShowInstructionsInput(false);
    localStorage.setItem('deliveryInstructions', deliveryInstructions);
  };
  
  const handlePayNow = () => {
    // Save all details to localStorage for the checkout page
    localStorage.setItem('orderTotal', total.toString());
    localStorage.setItem('deliveryFee', deliveryFee.toString());
    localStorage.setItem('fees', fees.toString());
    localStorage.setItem('deliveryInstructions', deliveryInstructions);
    localStorage.setItem('cartSubtotal', total); // This is what checkout uses
    
    // Navigate to checkout
    navigate('/checkout');
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Delivery details</h2>
      
      {/* Location Section */}
      <div className="mb-4 p-4 border rounded flex justify-between items-center">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-4 text-pink-600" />
          <div>
            <p className="font-medium">{location}</p>
            <p className="text-gray-500">Colombo</p>
          </div>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="text-orange-500"
        >
          Edit
        </button>
      </div>
      
      {/* Delivery Instructions */}
      <div className="mb-4 p-4 border rounded flex justify-between items-center">
        <div className="flex items-center flex-grow">
          <User className="h-5 w-5 mr-4 text-indigo-700" />
          <div className="w-full">
            <p className="font-medium">Meet at my door</p>
            {!showInstructionsInput ? (
              <button 
                onClick={() => setShowInstructionsInput(true)} 
                className="text-orange-500"
              >
                Add delivery instructions
              </button>
            ) : (
              <div className="mt-2">
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Add landmarks or special instructions"
                  className="w-full p-2 border rounded text-sm"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handleSaveInstructions} 
                    className="text-sm text-orange-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Payment</h2>
      <div  className="mb-4 p-4 border rounded flex justify-between items-center">
      <div className="flex items-center">
        <CreditCard className="h-5 w-5 mr-4 text-blue-500" />
        <div>
        <p>Card Payment</p>
        </div>
      </div>
      <button 
          className="text-orange-500"
        >
          Edit
        </button>
      </div>
      
      {/* Order Summary */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Order total</h3>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Fee</span>
          <span>LKR {deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 pb-4 border-b">
          <span>Fees</span>
          <span>LKR {fees.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>LKR {total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Pay Now Button */}
      <button 
        onClick={handlePayNow}
        className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold"
      >
        Pay Now
      </button>
      
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(newLoc) => {
          setLocation(newLoc);
          localStorage.setItem('userLocation', newLoc);
          // Recalculate delivery fee based on new location
          const newFee = calculateDeliveryFee(newLoc);
          setDeliveryFee(newFee);
        }}
      />
    </div>
  );
};

export default DeliveryDetailsPage;
