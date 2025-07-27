import { Router } from 'express';
import protect from '../middleware/auth.middleware';
import { createNote,deleteNote,updateNote,getAllNotes } from '../controllers/note.controller';

const router = Router();

router.get('/all-note', protect, getAllNotes); 
router.post('/write-note', protect, createNote);
router.put('/update-note/:id', protect, updateNote);
router.delete('/delete-note/:id', protect, deleteNote);

export default router;
