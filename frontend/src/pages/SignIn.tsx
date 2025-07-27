import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../services/Axios';
import { useAuth } from '../context/AuthContext';
import right from '../assets/right.png';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer <= 0) {
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const formatTimer = () => {
    const m = Math.floor(timer / 60)
      .toString()
      .padStart(2, '0');
    const s = (timer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleGetOtp = async () => {
    try {
      setLoading(true);
      await Axios.post('/user/login', { email });
      setOtpSent(true);
      setTimer(600);
      setResendEnabled(false);
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const res = await Axios.post('/user/verify-login-otp', { email, otp });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendEnabled) return;
    handleGetOtp(); // same function as original OTP
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl flex overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Sign in</h2>
          <p className="text-sm text-gray-500">Please login to continue to your account.</p>

          <div className="space-y-6">
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
              <>
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
                    OTP
                  </label>
                </div>

                {/* Timer & Resend */}
                <div className="flex items-center justify-between text-sm">
                  <span
                    onClick={handleResend}
                    className={`text-blue-600 font-medium cursor-pointer ${
                      !resendEnabled ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    Resend OTP
                  </span>
                  {!resendEnabled && <span className="text-gray-400">{formatTimer()}</span>}
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={otpSent ? handleVerifyOtp : handleGetOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 mt-4"
          >
            {loading ? 'Loading...' : otpSent ? 'Sign in' : 'Get OTP'}
          </button>

          {/* Extra */}
          <div className="flex items-center gap-2 text-sm mt-2">
            <input type="checkbox" />
            <label className="text-gray-500">Keep me logged in</label>
          </div>

          <p className="text-sm text-gray-500 text-center mt-2">
            Need an account?{' '}
            <a href="/signup" className="text-blue-600 font-medium hover:underline">
              Create one
            </a>
          </p>
        </div>

        {/* Right Side Image */}
        <div className="w-1/2">
          <img
            src={right}
            alt="Sign In"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
}
