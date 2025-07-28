import { Router } from 'express';
import passport from 'passport';
import { signup, verifyOtp,login ,verifyLoginOtp,getProfile} from '../controllers/auth.controller';
import generateToken from '../utils/jwt';
import protect from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOtp);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = (req as any).user;
    const token = generateToken(user._id.toString());
    res.redirect(`http://localhost:5173/google-auth-success?token=${token}`);
  }
);
router.get('/profile',protect , getProfile);

export default router;
