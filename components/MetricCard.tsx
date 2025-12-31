
import React from 'react';

interface Props {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<Props> = ({ label, value, subtext, icon }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:bg-slate-800/80 transition-all cursor-default group shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{label}</span>
        <div className="text-slate-600 group-hover:text-blue-500 transition-colors">{icon}</div>
      </div>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-3xl font-black text-white">{value}</h3>
        {subtext && <span className="text-xs font-bold text-slate-500 uppercase">{subtext}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
