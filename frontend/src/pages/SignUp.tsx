import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import Axios from '../services/Axios';
import { useAuth } from '../context/AuthContext';
import { MdOutlineNoteAlt } from 'react-icons/md';
import right from '../assets/right.png';

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
          window.open('https://notes-react-typescript.vercel.app/user/google', '_self');
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!otpSent) {
                await Axios.post('/user/signup', { name, dob, email });
                setOtpSent(true);
            } else {
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 relative">
            {/* 📝 Notes Header */}
            <div className="w-full flex justify-center md:justify-start md:absolute md:top-6 md:left-10 mb-6 md:mb-0">
                <div className="flex items-center gap-2 text-xl font-bold italic text-gray-800 md:text-3xl">
                    <MdOutlineNoteAlt className="text-blue-600" size={28} />
                    Notes
                </div>
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-stretch md:shadow-xl md:bg-white md:rounded-2xl overflow-hidden mt-10 md:mt-0">
                {/* Left Form Panel */}
                <div className="w-full md:w-1/2 p-6 md:p-10 space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 text-center md:text-left">Sign up</h2>
                    <p className="text-sm text-gray-500 text-center md:text-left">Sign up to enjoy the feature of Notes</p>

                    <div className="space-y-4">
                        {/* Name Input */}
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder=" "
                                className="peer w-full h-14 px-4 pt-4 border border-gray-500 rounded-lg focus:outline-none"
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

                        {/* DOB Input */}
                        <div className="relative">
                            <DatePicker
                                selected={dob}
                                onChange={(date) => setDob(date)}
                                dateFormat="dd MMMM yyyy"
                                placeholderText=" "
                                id="dob"
                                className="peer w-full h-14 px-4 pt-4 pb-2 border border-gray-500 rounded-lg focus:outline-none"
                                wrapperClassName="w-full" // Ensures full width
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


                        {/* Email Input */}
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

                        {/* OTP Input */}
                        {otpSent && (
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
                                    Enter OTP
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 mt-2"
                    >
                        {loading ? 'Loading...' : otpSent ? 'Submit' : 'Get OTP'}
                    </button>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                        <FcGoogle size={20} />
                        <span>Sign up with Google</span>
                    </button>

                    {/* Sign In Link */}
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Already have an account?{' '}
                        <a href="/signin" className="text-blue-600 font-medium hover:underline">
                            Sign in
                        </a>
                    </p>
                </div>

                {/* Right Panel (Image) */}
                <div className="hidden md:block md:w-1/2">
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
