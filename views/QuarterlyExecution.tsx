
import React, { useState } from 'react';
import { Quarter } from '../types';

interface Props {
  quarters: Quarter[];
  setQuarters: React.Dispatch<React.SetStateAction<Quarter[]>>;
}

const QuarterlyExecution: React.FC<Props> = ({ quarters, setQuarters }) => {
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [editingMId, setEditingMId] = useState<string | null>(null);
  const [editingMText, setEditingMText] = useState('');

  const toggleQuarterComplete = (id: string) => {
    setQuarters(prev => prev.map(q => q.id === id ? { ...q, isCompleted: !q.isCompleted } : q));
  };

  const toggleMilestone = (qId: string, mId: string) => {
    setQuarters(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          milestones: q.milestones.map(m => m.id === mId ? { ...m, completed: !m.completed } : m)
        };
      }
      return q;
    }));
  };

  const addMilestone = (qId: string) => {
    const text = newMilestoneText.trim();
    if (!text) return;
    setQuarters(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          milestones: [...q.milestones, { id: Date.now().toString(), text, completed: false }]
        };
      }
      return q;
    }));
    setNewMilestoneText('');
  };

  const removeMilestone = (qId: string, mId: string) => {
    setQuarters(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          milestones: q.milestones.filter(m => m.id !== mId)
        };
      }
      return q;
    }));
  };

  const startEditMilestone = (mId: string, text: string) => {
    setEditingMId(mId);
    setEditingMText(text);
  };

  const saveEditMilestone = (qId: string) => {
    const text = editingMText.trim();
    if (!editingMId || !text) return;
    setQuarters(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          milestones: q.milestones.map(m => m.id === editingMId ? { ...m, text } : m)
        };
      }
      return q;
    }));
    setEditingMId(null);
    setEditingMText('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-tight">Quarterly Execution Plan</h2>
        <p className="text-slate-400 mt-1">Operational milestones for 2026. Precision tracking enabled.</p>
      </header>

      <div className="space-y-6">
        {quarters.map((q) => (
          <div key={q.id} className={`bg-slate-900 border transition-all duration-300 rounded-xl overflow-hidden ${q.isCompleted ? 'border-green-500/50 ring-1 ring-green-500/20' : 'border-slate-800 shadow-2xl'}`}>
            <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-colors ${q.isCompleted ? 'bg-green-600/20 border-green-500/50 text-green-500' : 'bg-blue-600/20 border-blue-500/30 text-blue-500 shadow-lg shadow-blue-900/10'}`}>
                  <span className="font-bold text-lg">{q.id}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{q.label}</h3>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Target: ₹{(q.revenueTarget / 10000000).toFixed(1)} Cr</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setEditingQId(editingQId === q.id ? null : q.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${editingQId === q.id ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                >
                  {editingQId === q.id ? 'FINISH EDIT' : 'MANAGE PLAN'}
                </button>
                <button 
                  onClick={() => toggleQuarterComplete(q.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${q.isCompleted ? 'bg-green-600 text-white shadow-lg shadow-green-900/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                >
                  {q.isCompleted ? 'DELIVERED ✓' : 'MARK COMPLETE'}
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Quarterly Milestones</h4>
                <div className="space-y-2">
                  {q.milestones.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex items-center group space-x-3 p-2 rounded-lg transition-colors ${m.completed ? 'bg-blue-600/5' : 'hover:bg-slate-800/50'}`}
                    >
                      <div 
                        onClick={() => toggleMilestone(q.id, m.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${m.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-700 group-hover:border-blue-500'}`}
                      >
                        {m.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      
                      {editingMId === m.id ? (
                        <div className="flex-1 flex space-x-2">
                          <input 
                            autoFocus
                            type="text" 
                            value={editingMText}
                            onChange={(e) => setEditingMText(e.target.value)}
                            className="flex-1 bg-slate-950 border border-blue-500 rounded px-2 py-1 text-xs outline-none text-white"
                            onKeyDown={(e) => e.key === 'Enter' && saveEditMilestone(q.id)}
                          />
                          <button onClick={() => saveEditMilestone(q.id)} className="text-green-500 hover:text-green-400">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </button>
                        </div>
                      ) : (
                        <span className={`flex-1 text-sm transition-all cursor-pointer ${m.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`} onClick={() => toggleMilestone(q.id, m.id)}>
                          {m.text}
                        </span>
                      )}

                      {editingQId === q.id && !editingMId && (
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditMilestone(m.id, m.text)} className="p-1 text-slate-500 hover:text-blue-400">
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => removeMilestone(q.id, m.id)} className="p-1 text-slate-500 hover:text-red-400">
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {editingQId === q.id && !editingMId && (
                    <div className="pt-2 flex space-x-2">
                      <input 
                        type="text" 
                        value={newMilestoneText}
                        onChange={(e) => setNewMilestoneText(e.target.value)}
                        placeholder="Add new milestone..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs outline-none focus:border-blue-500 transition-all text-white"
                        onKeyDown={(e) => e.key === 'Enter' && addMilestone(q.id)}
                      />
                      <button onClick={() => addMilestone(q.id)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg shadow-blue-900/20 active:scale-95 text-white">ADD</button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Strategic Risks</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-red-200">
                    <span className="font-bold text-red-500 uppercase mr-2 text-[10px]">Hiring:</span>
                    Founder time dilution due to recruiting delay.
                  </div>
                  <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-xs text-yellow-200">
                    <span className="font-bold text-yellow-500 uppercase mr-2 text-[10px]">Compliance:</span>
                    DPDP act interpretation variance in global markets.
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Performance Stats</h4>
                <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/50 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Progress</span>
                    <span className="text-sm font-bold text-blue-400">
                      {Math.round((q.milestones.filter(m => m.completed).length / (q.milestones.length || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                      style={{ width: `${(q.milestones.filter(m => m.completed).length / (q.milestones.length || 1)) * 100}%` }} 
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 pt-2 border-t border-slate-700/30">
                    <span>Status</span>
                    <span className={q.isCompleted ? 'text-green-500' : 'text-blue-500'}>{q.isCompleted ? '✓ DELIVERED' : '⟳ EXECUTING'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuarterlyExecution;
