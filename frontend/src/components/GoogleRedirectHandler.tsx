import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Axios from '../services/Axios';

export default function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
      // Store token
      localStorage.setItem('token', token);

      // Fetch user with token
      Axios.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          login(res.data, token);
          navigate('/dashboard');
        })
        .catch(() => {
          alert('Google auth failed');
          navigate('/');
        });
    } else {
      alert('No token received');
      navigate('/');
    }
  }, []);

  return <div className="text-center mt-10 text-lg text-gray-600">Signing you in via Google...</div>;
}
