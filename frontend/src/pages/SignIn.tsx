import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../services/Axios';
import { useAuth } from '../context/AuthContext';
import { MdOutlineNoteAlt } from 'react-icons/md';
import right from '../assets/right.png'

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(600);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    const m = Math.floor(timer / 60).toString().padStart(2, '0');
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
      login(res.data.user, res.data.token, rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!resendEnabled) return;
    handleGetOtp();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 relative">
      {/* Notes Header */}
      <div className="w-full flex justify-center md:justify-start md:absolute md:top-6 md:left-10 mb-6 md:mb-0">
        <div className="flex items-center gap-2 text-xl font-bold italic text-gray-800 md:text-3xl">
          <MdOutlineNoteAlt className="text-blue-600" size={28} />
          Notes
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-stretch md:shadow-xl md:bg-white md:rounded-2xl overflow-hidden mt-10 md:mt-0">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
            <p className="text-sm text-gray-500">Please login to continue to your account.</p>
          </div>

          <div className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 px-4 pt-4 border border-gray-500 rounded-lg focus:outline-none"
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
                    className="peer w-full h-14 px-4 pt-4 border border-gray-500 rounded-lg focus:outline-none"
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
                  {!resendEnabled && (
                    <span className="text-gray-400">{formatTimer()}</span>
                  )}
                </div>
              </>
            )}

            {/* Remember me */}
            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-gray-500">Keep me logged in</label>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={otpSent ? handleVerifyOtp : handleGetOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            {loading ? 'Loading...' : otpSent ? 'Sign In' : 'Get OTP'}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Need an account?{' '}
            <a href="/signup" className="text-blue-600 font-medium hover:underline">
              Create one
            </a>
          </p>
        </div>

        {/* Image Side */}
        <div className="hidden md:block w-1/2">
          <img
            src={right}
            alt="Sign In Visual"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
}
