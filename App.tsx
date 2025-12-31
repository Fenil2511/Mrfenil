
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_METRICS, INITIAL_QUARTERS, ICONS } from './constants';
import { GoalStatus, Metric, DailyLog, WeeklyPriority, Quarter } from './types';

// Views
import YearlyCommand from './views/YearlyCommand';
import QuarterlyExecution from './views/QuarterlyExecution';
import WeeklyOperating from './views/WeeklyOperating';
import DailyTracker from './views/DailyTracker';
import DrillDown from './views/DrillDown';
import DriftDetector from './views/DriftDetector';

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    const saved = localStorage.getItem('linef_metrics');
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });
  
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('linef_daily_logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [weeklyPriorities, setWeeklyPriorities] = useState<WeeklyPriority[]>(() => {
    const saved = localStorage.getItem('linef_weekly_priorities');
    return saved ? JSON.parse(saved) : [
      { id: '1', task: 'Review DPDP compliance gap analysis for 5 clients', completed: false },
      { id: '2', task: 'Complete 3 mock tests for CISA', completed: false },
      { id: '3', task: 'Finalize CXO interview script for YT', completed: false },
    ];
  });

  const [quarters, setQuarters] = useState<Quarter[]>(() => {
    const saved = localStorage.getItem('linef_quarters');
    return saved ? JSON.parse(saved) : INITIAL_QUARTERS;
  });

  useEffect(() => {
    localStorage.setItem('linef_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('linef_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('linef_weekly_priorities', JSON.stringify(weeklyPriorities));
  }, [weeklyPriorities]);

  useEffect(() => {
    localStorage.setItem('linef_quarters', JSON.stringify(quarters));
  }, [quarters]);

  const updateMetric = (id: string, value: number) => {
    setMetrics(prev => prev.map(m => {
      if (m.id === id) {
        const trend = value > m.current ? 'up' : value < m.current ? 'down' : 'neutral';
        return { ...m, current: value, trend };
      }
      return m;
    }));
  };

  const healthScore = useMemo(() => {
    // 1. Metric Progress (30%)
    const metricProgress = metrics.reduce((acc, m) => {
      const p = m.current / m.target;
      return acc + (m.id === 'weight' ? (m.current <= m.target ? 1 : (20 - m.current) / (20 - m.target)) : Math.min(p, 1));
    }, 0) / metrics.length;
    
    // 2. Weekly Consistency (25%)
    const weeklyRate = weeklyPriorities.length > 0 
      ? weeklyPriorities.filter(p => p.completed).length / weeklyPriorities.length 
      : 0;

    // 3. Daily Consistency (Last 7 Days) (25%)
    const recentLogs = dailyLogs.slice(0, 7);
    const dailyConsistency = recentLogs.length > 0 
      ? (recentLogs.filter(l => l.fitnessDone && l.deepWork >= 2).length / recentLogs.length) 
      : 0;

    // 4. Quarterly Milestones (20%)
    const allMilestones = quarters.flatMap(q => q.milestones);
    const quarterlyRate = allMilestones.length > 0
      ? allMilestones.filter(m => m.completed).length / allMilestones.length
      : 0;

    const rawScore = (metricProgress * 0.3) + (weeklyRate * 0.25) + (dailyConsistency * 0.25) + (quarterlyRate * 0.2);
    return Math.min(Math.round(rawScore * 100), 100);
  }, [metrics, weeklyPriorities, dailyLogs, quarters]);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-200">
        <aside className="w-64 border-r border-slate-800 flex flex-col fixed h-full bg-slate-900 z-10 shadow-2xl">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-bold tracking-tighter text-white">LineF <span className="text-blue-500">2026</span></h1>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Founder Command</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <SidebarLink to="/" label="Yearly Command" icon={ICONS.Revenue} />
            <SidebarLink to="/quarterly" label="Quarterly Execution" icon={ICONS.Security} />
            <SidebarLink to="/weekly" label="Weekly Operating" icon={ICONS.Content} />
            <SidebarLink to="/daily" label="Daily Tracker" icon={ICONS.Fitness} />
            <div className="pt-4 mt-4 border-t border-slate-800">
              <p className="px-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Goal Focus</p>
              <SidebarLink to="/drill/rev" label="Revenue & Scale" icon={ICONS.Revenue} />
              <SidebarLink to="/drill/cyber" label="Cyber Mastery" icon={ICONS.Security} />
              <SidebarLink to="/drill/yt" label="Brand Authority" icon={ICONS.Content} />
              <SidebarLink to="/drift" label="Drift Detection" icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
            </div>
          </nav>
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Founder Score</span>
              <span className={`text-lg font-bold ${healthScore > 80 ? 'text-green-500' : healthScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}>{healthScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${healthScore > 80 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : healthScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<YearlyCommand metrics={metrics} updateMetric={updateMetric} />} />
            <Route path="/quarterly" element={<QuarterlyExecution quarters={quarters} setQuarters={setQuarters} />} />
            <Route path="/weekly" element={<WeeklyOperating priorities={weeklyPriorities} setPriorities={setWeeklyPriorities} />} />
            <Route path="/daily" element={<DailyTracker logs={dailyLogs} setLogs={setDailyLogs} />} />
            <Route path="/drill/:goalId" element={<DrillDown metrics={metrics} updateMetric={updateMetric} />} />
            <Route path="/drift" element={<DriftDetector metrics={metrics} logs={dailyLogs} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string, label: string, icon: React.ReactNode }> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 text-slate-400'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default App;
