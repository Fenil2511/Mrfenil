
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Metric } from '../types';

interface Props {
  metrics: Metric[];
  updateMetric: (id: string, value: number) => void;
}

const DrillDown: React.FC<Props> = ({ metrics, updateMetric }) => {
  const { goalId } = useParams<{ goalId: string }>();
  const metric = metrics.find(m => m.id === goalId) || metrics[0];
  const [editValue, setEditValue] = useState(metric.current.toString());

  const handleUpdate = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      updateMetric(metric.id, val);
      alert('Metric Updated Successfully.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="border-b border-slate-800 pb-8 flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">{metric.label}</h2>
          <div className="mt-4 flex items-center space-x-6">
            <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold block uppercase mb-1">Current Progress</span>
              <span className="text-xl font-bold text-green-500">{metric.unit}{metric.current.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold block uppercase mb-1">Target</span>
              <span className="text-xl font-bold text-blue-500">{metric.unit}{metric.target.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-end">
          <label className="text-xs font-bold text-slate-500 uppercase mb-2">Manual Progress Update</label>
          <div className="flex space-x-2">
            <input 
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none w-32 font-mono"
            />
            <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">UPDATE</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 mr-4 rounded-full"></span>
              Execution Strategy
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-slate-800/50 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-400 mb-2">Primary Objective</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Establish performance benchmarks starting January 1st. Maintain linear progression to ensure the {metric.label} outcome is secured by year-end with CompliYUG excellence.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Daily Habit</h4>
                  <p className="text-sm font-semibold">Standard execution blocks tied to {metric.id}</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Weekly Action</h4>
                  <p className="text-sm font-semibold">Scaling outcomes by weekly 2% increments</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Yearly Milestones (2026)</h3>
            <div className="relative border-l-2 border-slate-800 ml-4 space-y-12">
              <MilestonePoint quarter="Q1" title="Phase 1: Zero to One" text="Establishing the baseline and first 16% progress." active={metric.current > 0} />
              <MilestonePoint quarter="Q2" title="Phase 2: Acceleration" text="Compounding growth and crossing 40% threshold." active={metric.current > metric.target * 0.4} />
              <MilestonePoint quarter="Q3" title="Phase 3: Optimization" text="Iterating for efficiency. Target: 75% completion." active={metric.current > metric.target * 0.7} />
              <MilestonePoint quarter="Q4" title="Phase 4: Completion" text="Final surge to 100% and post-2026 planning." active={metric.current >= metric.target} />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-sm font-bold text-red-500 uppercase mb-6 tracking-widest">Active Blockers</h3>
            <div className="space-y-4">
              <BlockerItem severity="high" text="Inertia: Need to break initial 0-baseline plateau" />
              <BlockerItem severity="med" text="External Market Variance" />
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl border-t-4 border-t-green-500">
            <h3 className="text-sm font-bold text-green-500 uppercase mb-6 tracking-widest">Next Corrective Action</h3>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-sm font-bold text-green-400 mb-2">Mission: Consistency Reset</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log today's contribution in the Daily Tracker to ensure today is not a zero day for this goal.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const MilestonePoint: React.FC<{ quarter: string, title: string, text: string, active?: boolean }> = ({ quarter, title, text, active }) => (
  <div className="relative pl-8">
    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-slate-950 ${active ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-slate-800'}`}></div>
    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${active ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>{quarter}</span>
    <h4 className={`text-lg font-bold mt-2 ${active ? 'text-white' : 'text-slate-500'}`}>{title}</h4>
    <p className="text-sm text-slate-400 mt-1">{text}</p>
  </div>
);

const BlockerItem: React.FC<{ severity: 'high' | 'med', text: string }> = ({ severity, text }) => (
  <div className={`p-4 rounded-xl border ${severity === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
    <div className="flex items-center space-x-2 mb-2">
      <div className={`w-2 h-2 rounded-full ${severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
      <span className={`text-[10px] font-black uppercase ${severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>{severity} priority</span>
    </div>
    <p className="text-xs text-slate-300 font-medium">{text}</p>
  </div>
);

export default DrillDown;
