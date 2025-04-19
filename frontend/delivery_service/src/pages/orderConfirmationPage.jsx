import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({ deliveryId }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(`/details/${deliveryId}`); // ✅ Pass the MongoDB _id here
  };

  return (
    <button onClick={handleConfirm}>
      Confirm Order
    </button>
  );
};

export default OrderConfirmation;
