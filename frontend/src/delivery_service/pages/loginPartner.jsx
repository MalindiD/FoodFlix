import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import AuthContext from '../../context/AuthContext';  // ✅

export default function LoginPartner() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // ✅ use login() now

  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/partners/login', formData);
      const { user, token } = res.data;

      if (user) {
        sessionStorage.setItem('token', token);
        login(user, token); // ✅ call login() to save and set user

        navigate('/partner-dashboard');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('❌ Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f1f5]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-[#ec5834] mb-6">Login as Delivery Partner</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ec5834] text-white py-2 rounded hover:bg-orange-600 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
