import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AuthContext from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
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
      // ✅ Send email and password to your backend
      const res = await api.post('/auth/login', formData, {
        withCredentials: true
      });

      const { user, token, message } = res.data;

      if (message) {
        setError(message);
        setLoading(false);
        return;
      }

      login(user, token);

      // ✅ Redirect based on role
      if (user.role === 'customer') {
        navigate('/dashboard');
      } else if (user.role === 'delivery') {
        navigate('/delivery-dashboard');
      } else if (user.role === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Unauthorized role');
      }

    } catch (err) {
      console.error('❌ Login Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
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
        <h2 className="text-2xl font-bold text-center text-[#ec5834] mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        {/* Button for logging in as Delivery Partner */}
        <button
          type="button"
          onClick={() => navigate('/login-partner')}
          className="w-full mt-4 bg-gray-100 text-[#ec5834] py-2 rounded hover:bg-orange-600 transition"
        >
          Login as Delivery Partner
        </button>
      </form>
    </div>
  );
}
