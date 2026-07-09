import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../SocketContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Sparkles, UserCheck, Shield } from 'lucide-react';

export default function StudentLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [coreStudents, setCoreStudents] = useState<string[]>([]);
  const navigate = useNavigate();
  const { joinSession } = useSocket();

  useEffect(() => {
    fetch('/api/core-students')
      .then(res => res.json())
      .then(data => setCoreStudents(data))
      .catch(console.error);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    
    if (val.trim().length > 0) {
      // Find matches: strictly prefix based
      const filtered = coreStudents.filter(s => {
        return s.toLowerCase().startsWith(val.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (sug: string) => {
    setName(sug);
    setSuggestions([]);
  };

  const isTeacherLogin = name.trim().toLowerCase() === 'amir';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTeacherLogin) {
      if (password.toLowerCase() === 'amir') {
        joinSession('teacher', name.trim());
        navigate('/teacher');
      } else {
        alert('Incorrect password');
      }
    } else if (name.trim()) {
      joinSession('student', name.trim());
      navigate('/learn');
    }
  };

  // Determine if it's likely a guest
  const isGuest = !isTeacherLogin && name.trim().length > 0 && !coreStudents.some(s => s.toLowerCase() === name.trim().toLowerCase()) && suggestions.length === 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-rose-900/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-slate-900/80 p-8 rounded-3xl backdrop-blur-xl border border-slate-700/50 shadow-2xl z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-500/20 p-4 rounded-full text-indigo-400">
            <Sparkles size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome to Class!</h1>
        <p className="text-center text-slate-400 mb-8 text-lg">Enter your name to join the lesson.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-slate-300 font-medium mb-2 text-lg">Your Name</label>
            <input 
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Ali"
              className="w-full bg-slate-800 border-2 border-slate-600 text-white rounded-xl px-4 py-4 text-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
            
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl overflow-hidden z-20"
                >
                  {suggestions.map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => selectSuggestion(sug)}
                      className="w-full text-left px-4 py-3 text-lg text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors border-b border-slate-700/50 last:border-0 flex items-center gap-3 cursor-pointer"
                    >
                      <UserCheck size={18} className="text-indigo-400" />
                      {sug}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {isGuest && (
              <div className="mt-2 text-rose-400 text-sm">
                You will be joining as a Guest.
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {isTeacherLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <label className="block text-indigo-300 font-medium mb-2 text-lg flex items-center gap-2">
                    <Shield size={18} /> Teacher Password
                  </label>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-indigo-950/50 border-2 border-indigo-500/50 text-white rounded-xl px-4 py-4 text-xl focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={!name.trim() || (isTeacherLogin && !password.trim())}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-xl transition-colors flex items-center justify-center gap-3 cursor-pointer"
          >
            <LogIn size={24} />
            {isTeacherLogin ? 'Login as Teacher' : `Join Class ${isGuest ? '(Guest)' : ''}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
