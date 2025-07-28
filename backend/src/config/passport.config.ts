import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!
      
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0].value;
      const name = profile.displayName;

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          name,
          googleId: profile.id
        });
      }
console.log('GOOGLE CALLBACK URL:', process.env.GOOGLE_CALLBACK_URL);

      return done(null, user);
    }
  )
);
