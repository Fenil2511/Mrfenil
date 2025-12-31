
import React, { useMemo } from 'react';
import { Metric, DailyLog, GoalStatus } from '../types';

interface Props {
  metrics: Metric[];
  logs: DailyLog[];
}

const DriftDetector: React.FC<Props> = ({ metrics, logs }) => {
  const drifts = useMemo(() => {
    const findings: { type: 'stagnation' | 'drift' | 'overcommitment', message: string, severity: 'high' | 'low' }[] = [];
    
    // Revenue Drift
    const revMetric = metrics.find(m => m.id === 'rev');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const progressExpected = dayOfYear / 365;
    if (revMetric && (revMetric.current / revMetric.target) < progressExpected * 0.8) {
      findings.push({ type: 'drift', message: 'Annual revenue is lagging significantly behind linear expectation.', severity: 'high' });
    }

    // Habit Stagnation (last 7 days)
    const recentLogs = logs.slice(0, 7);
    const deepWorkAvg = recentLogs.reduce((acc, log) => acc + log.deepWork, 0) / (recentLogs.length || 1);
    if (deepWorkAvg < 2) {
      findings.push({ type: 'stagnation', message: `Deep work density is low (${deepWorkAvg.toFixed(1)} blocks avg). High risk of goal dilution.`, severity: 'high' });
    }

    // Overcommitment Check
    const atRiskMetrics = metrics.filter(m => m.status === GoalStatus.AT_RISK).length;
    if (atRiskMetrics >= 3) {
      findings.push({ type: 'overcommitment', message: `${atRiskMetrics} core goals are "At Risk". Critical overcommitment detected. Prune non-core activities.`, severity: 'high' });
    }

    return findings;
  }, [metrics, logs]);

  return (
    <div className="space-y-8 animate-in slide-in-from-top-10 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-tight">Gap & Drift Detection</h2>
        <p className="text-slate-400 mt-1">Automated algorithmic integrity check.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Active Findings</h3>
          {drifts.length === 0 ? (
            <div className="bg-green-500/5 border border-green-500/20 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-green-400 font-bold text-lg">System Integrity Optimized</p>
              <p className="text-slate-400 text-sm mt-2">No significant drift detected in current trajectory.</p>
            </div>
          ) : (
            drifts.map((finding, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${finding.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${finding.type === 'drift' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {finding.type}
                  </span>
                  <span className={`text-[10px] font-bold ${finding.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>CRITICAL ALERT</span>
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">{finding.message}</p>
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">ACKNOWLEDGE</button>
                  <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors">PLAN CORRECTION</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Suggested Correction Focus</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20 shrink-0">
                <span className="text-blue-500 font-bold">01</span>
              </div>
              <div>
                <h4 className="font-bold text-white">Aggressive Deep Work Reset</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Cancel all non-essential meetings for next Tuesday. Reset baseline to 3 deep work blocks.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-500/20 shrink-0">
                <span className="text-purple-500 font-bold">02</span>
              </div>
              <div>
                <h4 className="font-bold text-white">Prune Communication Channels</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ignore Slack and generic LinkedIn. Only focus on direct CXO emails and networking touchpoints.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center border border-green-500/20 shrink-0">
                <span className="text-green-500 font-bold">03</span>
              </div>
              <div>
                <h4 className="font-bold text-white">Cyber Mastery Lab Sprints</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Allocate 1 hour daily specifically for Offensive Security labs before checking revenue metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriftDetector;
