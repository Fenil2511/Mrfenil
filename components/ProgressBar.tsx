
import React from 'react';
import { GoalStatus } from '../types';

interface Props {
  current: number;
  target: number;
  status: GoalStatus;
}

const ProgressBar: React.FC<Props> = ({ current, target, status }) => {
  const percentage = Math.min(Math.max((current / target) * 100, 0), 100);
  
  const colors = {
    [GoalStatus.ON_TRACK]: 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]',
    [GoalStatus.AT_RISK]: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    [GoalStatus.OFF_TRACK]: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
  };

  return (
    <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ease-out rounded-full ${colors[status]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
