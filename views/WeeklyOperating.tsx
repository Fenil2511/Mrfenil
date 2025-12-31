
import React, { useState } from 'react';
import { WeeklyPriority } from '../types';

interface Props {
  priorities: WeeklyPriority[];
  setPriorities: React.Dispatch<React.SetStateAction<WeeklyPriority[]>>;
}

const WeeklyOperating: React.FC<Props> = ({ priorities, setPriorities }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id: string) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
  };

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const task = newTaskText.trim();
    if (!task) return;
    
    const newTask: WeeklyPriority = {
      id: Date.now().toString(),
      task: task,
      completed: false
    };
    
    setPriorities(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const removeTask = (id: string) => {
    setPriorities(prev => prev.filter(p => p.id !== id));
  };

  const completionRate = priorities.length > 0 
    ? Math.round((priorities.filter(p => p.completed).length / priorities.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Weekly Operating System</h2>
          <p className="text-slate-400 mt-1">High-impact tasks that move the needle. Performance synchronization active.</p>
        </div>
        <div className="text-right bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Weekly Velocity</p>
          <p className={`text-2xl font-black ${completionRate > 70 ? 'text-green-500' : completionRate > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
            {completionRate}%
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center uppercase tracking-tighter">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-4 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              Execution Priorities
            </h3>
            <form onSubmit={addTask} className="mb-8 flex space-x-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="What must happen this week to win?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 px-6 focus:outline-none focus:border-blue-500 transition-all text-sm shadow-inner text-white placeholder-slate-600"
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-black text-xs transition-all uppercase tracking-widest shadow-lg shadow-blue-900/40 active:scale-95 whitespace-nowrap"
              >
                ADD TASK
              </button>
            </form>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {priorities.map((p) => (
                <div 
                  key={p.id} 
                  className={`flex items-center group space-x-4 p-4 rounded-xl transition-all border ${p.completed ? 'bg-blue-600/5 border-blue-500/20 opacity-60' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'}`}
                >
                  <div 
                    onClick={() => toggleTask(p.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${p.completed ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'border-slate-600 hover:border-blue-400'}`}
                  >
                    {p.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`flex-1 text-sm font-semibold transition-all cursor-pointer ${p.completed ? 'line-through text-slate-500' : 'text-slate-200'}`} onClick={() => toggleTask(p.id)}>
                    {p.task}
                  </span>
                  <button 
                    onClick={() => removeTask(p.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {priorities.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500 italic text-sm">No priorities set. Your focus is blank.</p>
                  <p className="text-xs text-slate-600 mt-1 uppercase font-bold">Define your wins above.</p>
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-red-500 uppercase mb-4 tracking-widest">Zero Value / Stop</h3>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-center space-x-3 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Non-CXO low-tier inbound leads</span>
                </li>
                <li className="flex items-center space-x-3 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Social media doomscrolling</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-blue-500 uppercase mb-4 tracking-widest">Evidence of Work</h3>
              <div className="space-y-4">
                <div className="text-[10px] text-slate-500 font-bold uppercase border-b border-slate-800 pb-2">Active Artifacts</div>
                <div className="text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700 italic leading-relaxed">
                  "Founder Dashboard v2.1 Performance Sync Engine deployed."
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-8 tracking-widest text-center">Velocity Indicators</h3>
            <div className="space-y-8">
              <MetricGrowth label="Revenue Growth" current="+2.4%" target="+5%" status="risk" />
              <MetricGrowth label="Compliance Reps" current="12/10" target="10/10" status="on" />
              <MetricGrowth label="YT Watch Time" current="+18%" target="+15%" status="on" />
              <MetricGrowth label="Physicality" current="Locked" target="10% BF" status="on" />
            </div>
          </section>

          <section className="bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/20 rounded-2xl p-8 shadow-lg">
            <h3 className="text-[10px] font-black text-blue-400 uppercase mb-4 tracking-widest">Architect's Directive</h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium italic border-l-2 border-blue-500 pl-4">
              "System synchronization is active. Your progress here now feeds directly into your Founder Health Score. Speed is irrelevant without direction."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const MetricGrowth: React.FC<{ label: string, current: string, target: string, status: 'on' | 'risk' | 'off' }> = ({ label, current, target, status }) => {
  return (
    <div className="flex justify-between items-center group border-b border-slate-800/30 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="text-[10px] text-slate-500 font-black uppercase mb-1">{label}</p>
        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{current}</p>
      </div>
      <div className="text-right">
        <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">GOAL</p>
        <p className={`text-xs font-black ${status === 'on' ? 'text-green-500' : 'text-yellow-500'}`}>{target}</p>
      </div>
    </div>
  );
};

export default WeeklyOperating;
