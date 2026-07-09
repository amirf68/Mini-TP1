import { CheckCircle2, MessageSquare, Play, HelpCircle, Clock, Users, Trophy } from 'lucide-react';
import { TeacherNotes } from '../types';
import { useSocket } from '../SocketContext';

interface TeacherPanelProps {
  notes: TeacherNotes;
  isOpen: boolean;
  onToggle: () => void;
}

export default function TeacherPanel({ notes, isOpen, onToggle }: TeacherPanelProps) {
  const { state } = useSocket();
  const { students } = state;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium border-2 border-indigo-400"
      >
        <CheckCircle2 size={18} />
        CELTA Assessor View
      </button>
    );
  }

  // Filter and sort students
  const coreStudentsList = students.filter(s => !s.isGuest);
  const guestStudentsList = students.filter(s => s.isGuest);

  const presentCoreStudents = coreStudentsList.filter(s => s.isOnline);
  const absentCoreStudents = coreStudentsList.filter(s => !s.isOnline);

  // Sort students for leaderboard (by score) - include guests but clearly mark them
  const sortedLiveStudents = [...presentCoreStudents, ...guestStudentsList.filter(s => s.isOnline)].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-slate-900 text-slate-100 shadow-2xl z-50 overflow-y-auto border-l border-slate-700 flex flex-col">
      <div className="p-4 bg-slate-800 flex justify-between items-center sticky top-0 border-b border-slate-700 z-10">
        <h2 className="font-bold text-lg text-indigo-400">Teacher Notes</h2>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors text-sm underline"
        >
          Close
        </button>
      </div>

      <div className="p-5 flex-1 space-y-6">
        
        {/* Student Tracker Module */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 shadow-inner">
          <h4 className="flex items-center gap-2 text-indigo-300 font-bold mb-3 border-b border-slate-700 pb-2">
            <Users size={18} /> Live Students
          </h4>
          
          <div className="space-y-2 mb-4">
            {sortedLiveStudents.length === 0 && (
              <p className="text-sm text-slate-500 italic">No one has joined yet.</p>
            )}
            {sortedLiveStudents.map((student, idx) => (
              <div key={student.name} className={`flex items-center justify-between p-2 rounded-lg text-sm ${student.isGuest ? 'bg-slate-800 border border-slate-700/50' : 'bg-slate-900'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${student.isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                  <span className={`font-semibold flex items-center gap-1 ${student.isOnline ? 'text-slate-200' : 'text-slate-500'}`}>
                    {student.name} {student.isGuest && <span className="text-[10px] text-slate-500 uppercase">(Guest)</span>}
                  </span>
                  {idx < 3 && student.score > 0 && (
                    <Trophy size={14} className={idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600'} />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-indigo-300">{student.score} pts</span>
                  {student.hasAnsweredCurrent && (
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Answered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {absentCoreStudents.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-700/50">
              <span className="text-xs font-bold text-rose-400 mb-2 block tracking-wider">ABSENT (Core)</span>
              <div className="flex flex-wrap gap-1.5">
                {absentCoreStudents.map(student => (
                  <span key={student.name} className="text-xs bg-rose-950 text-rose-300 px-2 py-1 rounded-md border border-rose-900/50">
                    {student.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stage</span>
          <h3 className="text-xl font-semibold text-white">{notes.phase}</h3>
          <div className="flex items-center gap-2 mt-2 text-rose-400 bg-rose-900/30 w-fit px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20">
            <Clock size={14} /> Time: {notes.timeAllocation}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-indigo-400 font-medium">
            <MessageSquare size={16} /> Script (TTT Minimal)
          </h4>
          <p className="bg-slate-800 p-3 rounded-lg text-sm border-l-2 border-indigo-500 italic text-slate-300 leading-relaxed">
            "{notes.script}"
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-emerald-400 font-medium">
            <Play size={16} /> Teacher Action
          </h4>
          <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700 leading-relaxed">
            {notes.action}
          </p>
        </div>

        {notes.icqs && notes.icqs.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-amber-400 font-medium">
              <HelpCircle size={16} /> ICQs
            </h4>
            <ul className="space-y-2">
              {notes.icqs.map((icq, idx) => (
                <li key={idx} className="text-sm bg-amber-500/10 text-amber-200 p-2 rounded border border-amber-500/20">
                  {icq}
                </li>
              ))}
            </ul>
          </div>
        )}

        {notes.ccqs && notes.ccqs.length > 0 && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-pink-400 font-medium">
              <HelpCircle size={16} /> CCQs (Target Vocab)
            </h4>
            {notes.ccqs.map((ccq, idx) => (
              <div key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="font-bold text-pink-300 mb-1">{ccq.word}</div>
                <ul className="space-y-1 list-disc list-inside text-sm text-slate-300">
                  {ccq.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
