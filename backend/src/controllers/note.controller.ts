import { Request, Response } from 'express';
import Note from '../models/note.model';

 const createNote = async (req: Request, res: Response) => {
 try {
   const { title,content } = req.body;
   const userId = (req as any).user.userId;
 
   const note = await Note.create({ title,content, userId });
   res.status(201).json(note);
 } catch (error) {
  res.status(500).json({
    message:'server error',error
  })
 }
};

 const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  const note = await Note.findOneAndDelete({ _id: id, userId });
  if (!note) return res.status(404).json({ error: 'Note not found' });

  res.json({ message: 'Note deleted' });
};

const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, title } = req.body;
  const userId = (req as any).user.userId;

  const note = await Note.findOne({ _id: id, userId });
  if (!note) return res.status(404).json({ error: 'Note not found or unauthorized' });

  // Only append if content is provided and not empty
  if (content !== undefined && content !== '') {
    note.content += '\n' + content; // append with a newline
  }

  // If title changed, update it
  if (title !== undefined && title !== '') {
    note.title = title;
  }

  await note.save();
  res.json(note);
};

 const getAllNotes = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const notes = await Note.find({ userId }).sort({ createdAt: -1 }); // newest first
  res.json(notes);
};


export {
    createNote,
    deleteNote,
    updateNote,
    getAllNotes
}