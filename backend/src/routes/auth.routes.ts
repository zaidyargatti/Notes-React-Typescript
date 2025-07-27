import { Router } from 'express';
import passport from 'passport';
import { signup, verifyOtp,login ,verifyLoginOtp} from '../controllers/auth.controller';
import generateToken from '../utils/jwt';

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
    res.redirect(`http://localhost:5000/welcome?token=${token}`);
  }
);

export default router;
