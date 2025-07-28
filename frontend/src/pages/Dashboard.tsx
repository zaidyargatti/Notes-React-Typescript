import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Axios from '../services/Axios';
import { FaTrash } from 'react-icons/fa';
import { MdOutlineNoteAlt } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showEditorMobile, setShowEditorMobile] = useState(false);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const triggerSave = () => {
    if (!noteId) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        await Axios.put(
          `/user/notes/update-note/${noteId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes((prev) =>
          prev.map((note) =>
            note._id === noteId ? { ...note, title, content } : note
          )
        );
      } catch (err: any) {
        console.error('Auto-save failed:', err.response?.data || err.message);
      }
    }, 1000);
  };

  const fetchNotes = async () => {
    try {
      setNotes([]);
      const res = await Axios.get('/user/notes/all-note', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setNotes(data);

      if (!noteId && data.length > 0) {
        const first = data[0];
        setNoteId(first._id);
        setTitle(first.title || '');
        setContent(first.content || '');
      }
    } catch (err: any) {
      console.error('Error fetching notes:', err.response?.data || err.message);
    }
  };

  const createNoteIfNeeded = async () => {
    if (notes.length === 0) {
      try {
        const res = await Axios.post(
          '/user/notes/write-note',
          { title: 'Untitled', content: '' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newNote = res.data;
        setNotes([newNote]);
        setNoteId(newNote._id);
        setTitle(newNote.title);
        setContent(newNote.content);
      } catch (err: any) {
        console.error('Failed to create initial note:', err.response?.data || err.message);
      }
    }
  };

  const createNote = async () => {
    try {
      const res = await Axios.post(
        '/user/notes/write-note',
        { title: 'Untitled', content: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newNote = res.data;
      setNotes((prev) => [newNote, ...prev]);
      setNoteId(newNote._id);
      setTitle(newNote.title);
      setContent(newNote.content);
      setShowEditorMobile(true);
    } catch (err: any) {
      console.error('Failed to create note:', err.response?.data || err.message);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await Axios.delete(`/user/notes/delete-note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes);

      if (noteId === id) {
        if (updatedNotes.length > 0) {
          const first = updatedNotes[0];
          setNoteId(first._id);
          setTitle(first.title);
          setContent(first.content);
        } else {
          setNoteId(null);
          setTitle('');
          setContent('');
        }
      }
    } catch (err: any) {
      console.error('Delete failed:', err.response?.data || err.message);
    }
  };

  const handleSelectNote = (note: Note) => {
    if (noteId !== note._id) {
      setNoteId(note._id);
      setTitle(note.title);
      setContent(note.content);
    }
    setShowEditorMobile(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const load = async () => {
      await fetchNotes();
      await createNoteIfNeeded();
    };

    if (token) load();
    else navigate('/');
  }, [token]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    triggerSave();
  }, [title, content]);


  return (
    <>
      {/* Mobile Fullscreen Editor */}
      {showEditorMobile && (
        <div className="md:hidden fixed inset-0 bg-gray-50 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center">
              <button onClick={() => setShowEditorMobile(false)} className="text-xl text-gray-700 mr-3">
                <IoArrowBack />
              </button>
              <div className="flex items-center gap-2">
                <MdOutlineNoteAlt className="text-blue-600" size={24} />
                <span className="text-lg font-semibold text-gray-800">Notice</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-medium bg-transparent border-none outline-none mb-4 placeholder-gray-400"
            />
            <textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full text-gray-700 bg-transparent border-none outline-none resize-none placeholder-gray-400"
              style={{ minHeight: 'calc(100vh - 120px)' }}
            />
          </div>
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MdOutlineNoteAlt className="text-blue-600" size={24} />
              <span className="text-lg font-semibold text-gray-800">Notice</span>
            </div>
            <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline">
              Sign Out
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-1">
              Welcome, {user?.name || 'User'}!
            </h1>
            <p className="text-sm text-gray-500 mb-3">Email: {user?.email}</p>
            <button
              onClick={createNote}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
            >
              Create Note
            </button>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-base font-semibold mb-3 text-gray-800">Notes</h2>
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note._id}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                onClick={() => handleSelectNote(note)}
              >
                <span className="text-gray-700 font-medium truncate flex-1">
                  {note.title?.trim() || note.content?.trim() || 'Untitled'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note._id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No notes yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block min-h-screen bg-gray-50 flex flex-col px-4 py-6">
        <div className="flex items-center gap-2 text-3xl italic font-semibold text-gray-800 mb-6 ml-2">
          <MdOutlineNoteAlt className="text-blue-600" size={32} />
          Notes
        </div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    Hello, {user?.name?.split(' ')[0] || 'User'} 👋
                  </h1>
                  <p className="text-sm text-gray-500">"Write what should not be forgotten."</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1 text-sm border border-gray-400 rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-medium border-b border-gray-300 outline-none focus:border-blue-500"
              />

              <textarea
                placeholder="Start writing your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full mt-2 text-gray-700 border-none outline-none resize-none"
              />

              <div className="flex justify-start">
                <button
                  onClick={createNote}
                  className="px-4 py-1 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  New
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">Your Notes</h2>
            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${
                    note._id === noteId ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectNote(note)}
                >
                  <span className="truncate w-4/5 text-gray-700 font-medium">
                    {note.title?.trim() || note.content?.trim() || 'Untitled'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note._id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-sm text-gray-400 text-center">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
