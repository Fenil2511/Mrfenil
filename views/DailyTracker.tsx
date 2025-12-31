
import React, { useState } from 'react';
import { DailyLog, DailyTask } from '../types';

interface Props {
  logs: DailyLog[];
  setLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
}

const DailyTracker: React.FC<Props> = ({ logs, setLogs }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [todayLog, setTodayLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    deepWork: 0,
    revenueActions: false,
    contentDone: false,
    cyberPractice: false,
    englishPractice: false,
    fitnessDone: false,
    networkingDone: false,
    proofLink: '',
    tasks: [],
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: DailyTask = {
      id: Date.now().toString(),
      task: newTaskText,
      completed: false,
    };
    setTodayLog(prev => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask]
    }));
    setNewTaskText('');
  };

  const toggleManualTask = (taskId: string) => {
    setTodayLog(prev => ({
      ...prev,
      tasks: (prev.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogs(prev => [todayLog, ...prev.filter(l => l.date !== todayLog.date)]);
    alert('Daily Dossier Secured.');
  };

  const toggleAction = (key: keyof DailyLog) => {
    if (typeof todayLog[key] === 'boolean') {
      setTodayLog(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-tight">Daily Execution Tracker</h2>
        <p className="text-slate-400 mt-1">Brutal accountability. Proof only.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                Today's Core Checklist
              </h3>
              <span className="mono text-slate-500 text-sm font-bold">{todayLog.date}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckItem active={todayLog.revenueActions} onClick={() => toggleAction('revenueActions')} label="Revenue / Sales Actions" />
              <CheckItem active={todayLog.contentDone} onClick={() => toggleAction('contentDone')} label="Content Published/Ready" />
              <CheckItem active={todayLog.cyberPractice} onClick={() => toggleAction('cyberPractice')} label="Cyber Mastery Reps" />
              <CheckItem active={todayLog.englishPractice} onClick={() => toggleAction('englishPractice')} label="Executive Comm Practice" />
              <CheckItem active={todayLog.fitnessDone} onClick={() => toggleAction('fitnessDone')} label="Fitness Training Completed" />
              <CheckItem active={todayLog.networkingDone} onClick={() => toggleAction('networkingDone')} label="CXO Touchpoints Made" />
            </div>

            <div className="space-y-6 pt-4">
              <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-xl">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Manual Daily Missions</h4>
                <div className="space-y-3 mb-4">
                  {(todayLog.tasks || []).map((t) => (
                    <div 
                      key={t.id} 
                      onClick={() => toggleManualTask(t.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${t.completed ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${t.completed ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                        {t.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-xs font-medium ${t.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{t.task}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a specific manual task for today..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white focus:border-blue-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask(e as any))}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTask}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all"
                  >
                    ADD
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Deep Work Blocks (90m each)</label>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTodayLog(prev => ({ ...prev, deepWork: num }))}
                      className={`w-12 h-12 rounded-lg font-bold border transition-all ${todayLog.deepWork >= num ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Proof of Work (Link/Metrics)</label>
                <input 
                  type="text" 
                  value={todayLog.proofLink}
                  onChange={(e) => setTodayLog(prev => ({ ...prev, proofLink: e.target.value }))}
                  placeholder="Google Drive, YT Link, or Commit Hash"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors text-sm text-blue-400 font-mono"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all uppercase tracking-widest">
              Submit Daily Dossier
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white px-2 uppercase tracking-widest text-slate-500">History (Last 7 Days)</h3>
          <div className="space-y-4">
            {logs.slice(0, 7).map((log, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:bg-slate-900 transition-colors">
                <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                  <div className="text-center w-12 border-r border-slate-800 pr-4 shrink-0">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{log.date.split('-')[1]}/{log.date.split('-')[2]}</p>
                    <p className={`text-xs font-bold ${log.fitnessDone ? 'text-green-500' : 'text-slate-500'}`}>FIT</p>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center space-x-1 mb-1">
                      {Array.from({ length: log.deepWork }).map((_, j) => (
                        <div key={j} className="w-2 h-2 rounded-full bg-blue-500"></div>
                      ))}
                      {log.tasks && log.tasks.length > 0 && (
                        <span className="text-[10px] text-slate-500 ml-2">
                          ({log.tasks.filter(t => t.completed).length}/{log.tasks.length} tasks)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate font-mono">{log.proofLink || 'No link provided'}</p>
                  </div>
                </div>
                <div className="flex space-x-1 shrink-0">
                  <Indicator active={log.revenueActions} color="bg-blue-500" label="R" />
                  <Indicator active={log.contentDone} color="bg-purple-500" label="C" />
                  <Indicator active={log.cyberPractice} color="bg-red-500" label="S" />
                  <Indicator active={log.networkingDone} color="bg-green-500" label="N" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all text-left ${active ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
  >
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${active ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
      {active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
    </div>
    <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
  </button>
);

const Indicator: React.FC<{ active: boolean, color: string, label: string }> = ({ active, color, label }) => (
  <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${active ? `${color} text-white` : 'bg-slate-800 text-slate-600'}`}>
    {label}
  </div>
);

export default DailyTracker;
