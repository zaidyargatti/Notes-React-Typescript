import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import right from '../assets/right.png';
import Axios from '../services/Axios';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/user/google';
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!otpSent) {
        // Step 1: Send OTP
        await Axios.post('/user/signup', {
          name,
          dob,
          email,
        });
        setOtpSent(true);
      } else {
        // Step 2: Verify OTP
        const res = await Axios.post('/user/verify-otp', { email, otp });
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl flex overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Sign up</h2>
          <p className="text-sm text-gray-500">Sign up to enjoy the feature of Notes</p>

          <div className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 border border-gray-500 rounded-lg focus:outline-none"
              />
              <label
                htmlFor="name"
                className="absolute text-sm text-gray-500 left-4 top-2 transition-all
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
              >
                Your Name
              </label>
            </div>

            {/* DOB */}
            <div className="relative">
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="dd MMMM yyyy"
                placeholderText=" "
                id="dob"
                className="peer w-full px-4 pt-5 pb-2 border border-gray-500 rounded-lg focus:outline-none"
              />
              <label
                htmlFor="dob"
                className="absolute text-sm text-gray-500 left-4 top-2 transition-all
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
              >
                Date of Birth
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 border border-gray-500 rounded-lg focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 left-4 top-2 transition-all
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
              >
                Email
              </label>
            </div>

            {/* OTP */}
            {otpSent && (
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 border border-gray-500 rounded-lg focus:outline-none"
                />
                <label
                  htmlFor="otp"
                  className="absolute text-sm text-gray-500 left-4 top-2 transition-all
                  peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
                >
                  Enter OTP
                </label>
              </div>
            )}
          </div>

          {/* Get OTP / Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 mt-4"
          >
            {loading ? 'Loading...' : otpSent ? 'Submit' : 'Get OTP'}
          </button>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>

          {/* Sign in Link */}
          <p className="text-sm text-gray-500 text-center mt-2">
            Already have an account??{' '}
            <a href="/signin" className="text-blue-600 font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>

        {/* Right Side Image */}
        <div className="w-1/2">
          <img
            src={right}
            alt="Signup Visual"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
}
