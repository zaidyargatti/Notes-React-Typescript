import { Request, Response } from 'express';
import User from '../models/user.model';
import generateToken from '../utils/jwt';
import sendOTP from '../utils/mailer';
import crypto from 'crypto';

/**
 * SIGNUP CONTROLLER
 */
 const signup = async (req: Request, res: Response) => {
  const { email, name, dob } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, dob });
  }

  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  await sendOTP(email, otp);
  res.json({ message: 'OTP sent to email' });
};

/**
 * VERIFY SIGNUP OTP
 */
 const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry!) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id.toString());
  res.json({ token, user });
};

/**
 * LOGIN CONTROLLER - Send OTP
 */
 const login = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found. Please sign up first.' });

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOTP(email, otp);
  res.json({ message: 'OTP sent to email' });
};

/**
 * VERIFY LOGIN OTP
 */
 const verifyLoginOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry!) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id.toString());
  res.json({ token, user });
};
export {
    signup,
    verifyOtp,
    login,
    verifyLoginOtp
}
