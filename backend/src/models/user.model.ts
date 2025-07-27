import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
otp:{ 
    type: String},
  otpExpiry:{
    type: Date
    },
  googleId:{
    type:String}
    ,
  name: {
    type:String
},
dob:{
    type :Date
}
});

const User =mongoose.model('User', userSchema);
export default User
