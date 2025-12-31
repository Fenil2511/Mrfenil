
import React, { useState, useMemo } from 'react';
import { Metric, GoalStatus, Quarter, DailyLog, WeeklyPriority } from '../types';
import ProgressBar from '../components/ProgressBar';

interface Props {
  metrics: Metric[];
  updateMetric: (id: string, value: number) => void;
  // These would typically be passed from App.tsx via props or a shared hook
  // For the sake of the request to "fetch details", we assume they are injected or calculated
}

const YearlyCommand: React.FC<Props> = ({ metrics, updateMetric }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Fetch context from localStorage to show global sync on the dashboard
  const globalSync = useMemo(() => {
    const quarters: Quarter[] = JSON.parse(localStorage.getItem('linef_quarters') || '[]');
    const weeklies: WeeklyPriority[] = JSON.parse(localStorage.getItem('linef_weekly_priorities') || '[]');
    const dailies: DailyLog[] = JSON.parse(localStorage.getItem('linef_daily_logs') || '[]');

    const qMilestones = quarters.flatMap(q => q.milestones);
    const mTotal = qMilestones.length;
    const mDone = qMilestones.filter(m => m.completed).length;
    const mRate = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;

    const wDone = weeklies.filter(w => w.completed).length;
    const wRate = weeklies.length > 0 ? Math.round((wDone / weeklies.length) * 100) : 0;

    return { mRate, wRate, mDone, mTotal, weeklies: weeklies.length, dailiesCount: dailies.length };
  }, [metrics]); // Re-calculate when metrics change as a proxy for any state change

  const calculateCountdown = () => {
    const start2026 = new Date('2026-01-01T00:00:00');
    const end2026 = new Date('2026-12-31T23:59:59');
    const now = new Date();
    const effectiveNow = now < start2026 ? start2026 : now;
    if (effectiveNow > end2026) return 0;
    const diff = end2026.getTime() - effectiveNow.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateCountdown();

  const handleEdit = (id: string, current: number) => {
    setEditingId(id);
    setEditValue(current.toString());
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      updateMetric(id, val);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">2026 Yearly Command</h2>
          <p className="text-slate-400 mt-1">Strategic performance summary. Integrated sync active.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center space-x-3 shadow-xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Year Start: Jan 1st</span>
          <div className="h-6 w-px bg-slate-800"></div>
          <span className="mono font-bold text-blue-400">{daysRemaining} Days Remaining</span>
        </div>
      </header>

      {/* Global Sync Overview - This is where we "fetch" and show details from other views */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SyncCard label="Execution Velocity" value={`${globalSync.wRate}%`} subtext="Weekly Priorities" color="text-purple-400" />
        <SyncCard label="Milestone Completion" value={`${globalSync.mRate}%`} subtext={`${globalSync.mDone}/${globalSync.mTotal} Master Tasks`} color="text-green-400" />
        <SyncCard label="Data Integrity" value={`${globalSync.dailiesCount} Days`} subtext="Logged Dossiers" color="text-blue-400" />
        <SyncCard label="Focus Depth" value={`${globalSync.weeklies} Wins`} subtext="Weekly Defined" color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all shadow-xl group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</p>
                {editingId === metric.id ? (
                  <div className="flex mt-1 space-x-2">
                    <input 
                      autoFocus
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-slate-950 border border-blue-500 rounded px-2 py-1 text-sm text-white w-full outline-none font-mono"
                    />
                    <button onClick={() => saveEdit(metric.id)} className="bg-blue-600 px-3 py-1 rounded text-xs text-white font-bold">SAVE</button>
                  </div>
                ) : (
                  <h3 className="text-2xl font-bold mt-1 flex items-center group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => handleEdit(metric.id, metric.current)}>
                    <span className="text-slate-500 text-lg mr-1 font-normal">{metric.unit}</span>
                    {metric.current.toLocaleString()}
                    <svg className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-50 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                  </h3>
                )}
              </div>
              <StatusBadge status={metric.status} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400 uppercase tracking-tighter">Yearly Completion</span>
                <span className="text-white font-mono">{Math.round((metric.current / metric.target) * 100)}%</span>
              </div>
              <ProgressBar current={metric.current} target={metric.target} status={metric.status} />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>START: 0</span>
                <span>TARGET: {metric.unit}{metric.target.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Strategic Execution Roadmap 2026</h3>
          <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded font-bold uppercase tracking-widest">Global Lock Active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-800">
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
            <div key={q} className="bg-slate-900 p-6">
              <span className="text-blue-500 font-bold text-sm block mb-4 underline decoration-blue-500/30 underline-offset-4 tracking-widest uppercase">{q} 2026</span>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <span className="text-slate-300">Revenue Milestones: Scaling to reach target</span>
                </li>
                <li className="flex items-start space-x-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></span>
                  <span className="text-slate-300">Quarterly Certification Review Cycles</span>
                </li>
                <li className="flex items-start space-x-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1 shrink-0"></span>
                  <span className="text-slate-300">Content Scale & Authority Tier Growth</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SyncCard: React.FC<{ label: string, value: string, subtext: string, color: string }> = ({ label, value, subtext, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg border-l-4 border-l-slate-700">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
    <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">{subtext}</p>
  </div>
);

const StatusBadge: React.FC<{ status: GoalStatus }> = ({ status }) => {
  const styles = {
    [GoalStatus.ON_TRACK]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [GoalStatus.AT_RISK]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [GoalStatus.OFF_TRACK]: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default YearlyCommand;
