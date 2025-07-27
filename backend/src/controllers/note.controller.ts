import { Request, Response } from 'express';
import Note from '../models/note.model';

 const createNote = async (req: Request, res: Response) => {
  const { title,content } = req.body;
  const userId = (req as any).user.userId;

  const note = await Note.create({ title,content, userId });
  res.status(201).json(note);
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
  const { content } = req.body;
  const userId = (req as any).user.userId;

  const note = await Note.findOne({ _id: id, userId });
  if (!note) return res.status(404).json({ error: 'Note not found or unauthorized' });

  // Append new content to existing content
  note.content += content;
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