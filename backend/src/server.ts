import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Connect_DB from './config/db.config';
import authRoutes from './routes/auth.routes'
import noteRouthes from './routes/note.routes'
import './config/passport.config'


dotenv.config();
Connect_DB()
const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', authRoutes);
app.use('/user/notes', noteRouthes);
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is listeing on http://localhost:${PORT}`)
})