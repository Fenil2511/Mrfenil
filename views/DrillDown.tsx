
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Metric, RevenueLog } from '../types';
import * as XLSX from 'xlsx';

interface Props {
  metrics: Metric[];
  updateMetric: (id: string, value: number) => void;
  revenueLogs: RevenueLog[];
  setRevenueLogs: React.Dispatch<React.SetStateAction<RevenueLog[]>>;
}

const DrillDown: React.FC<Props> = ({ metrics, updateMetric, revenueLogs, setRevenueLogs }) => {
  const { goalId } = useParams<{ goalId: string }>();
  const metric = metrics.find(m => m.id === goalId) || metrics[0];
  const [editValue, setEditValue] = useState(metric.current.toString());

  // Revenue log form state
  const [incrementAmount, setIncrementAmount] = useState('');
  const [revenueDate, setRevenueDate] = useState(new Date().toISOString().split('T')[0]);
  const [revenueSource, setRevenueSource] = useState('');

  // Edit mode state
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editSource, setEditSource] = useState('');

  // Filter logs for current metric
  const metricLogs = revenueLogs
    .filter(log => log.metricId === metric.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Calculate total from logs
  const calculateTotalFromLogs = () => {
    return metricLogs.reduce((sum, log) => sum + log.amount, 0);
  };

  const handleUpdate = () => {
    const val = parseFloat(editValue);
    if (!isNaN(val)) {
      updateMetric(metric.id, val);
      alert('Metric Updated Successfully.');
    }
  };

  const handleAddRevenue = () => {
    const amount = parseFloat(incrementAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    if (!revenueSource.trim()) {
      alert('Please enter a revenue source/description');
      return;
    }

    // Create new log entry
    const newLog: RevenueLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: revenueDate,
      amount: amount,
      source: revenueSource.trim(),
      metricId: metric.id,
      timestamp: new Date(revenueDate).getTime()
    };

    // Add log and update metric
    setRevenueLogs(prev => [...prev, newLog]);
    updateMetric(metric.id, metric.current + amount);

    // Reset form
    setIncrementAmount('');
    setRevenueSource('');
    setRevenueDate(new Date().toISOString().split('T')[0]);

    alert(`Successfully added ${metric.unit}${amount.toLocaleString()} to ${metric.label}!`);
  };

  const handleStartEdit = (log: RevenueLog) => {
    setEditingLogId(log.id);
    setEditAmount(log.amount.toString());
    setEditDate(log.date);
    setEditSource(log.source);
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditAmount('');
    setEditDate('');
    setEditSource('');
  };

  const handleSaveEdit = () => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    if (!editSource.trim()) {
      alert('Please enter a revenue source/description');
      return;
    }

    setRevenueLogs(prev => {
      const updatedLogs = prev.map(log => {
        if (log.id === editingLogId) {
          return {
            ...log,
            amount: amount,
            date: editDate,
            source: editSource.trim(),
            timestamp: new Date(editDate).getTime()
          };
        }
        return log;
      });

      // Recalculate total from all logs for this metric
      const newTotal = updatedLogs
        .filter(log => log.metricId === metric.id)
        .reduce((sum, log) => sum + log.amount, 0);

      updateMetric(metric.id, newTotal);
      return updatedLogs;
    });

    setEditingLogId(null);
    alert('Entry updated successfully!');
  };

  const handleDeleteEntry = (logId: string) => {
    const logToDelete = revenueLogs.find(log => log.id === logId);
    if (!logToDelete) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this entry?\n\nAmount: ${metric.unit}${logToDelete.amount.toLocaleString()}\nSource: ${logToDelete.source}\n\nThis will reduce your total revenue by ${metric.unit}${logToDelete.amount.toLocaleString()}.`
    );

    if (confirmDelete) {
      setRevenueLogs(prev => {
        const updatedLogs = prev.filter(log => log.id !== logId);

        // Recalculate total from remaining logs for this metric
        const newTotal = updatedLogs
          .filter(log => log.metricId === metric.id)
          .reduce((sum, log) => sum + log.amount, 0);

        updateMetric(metric.id, newTotal);
        return updatedLogs;
      });

      alert('Entry deleted successfully!');
    }
  };

  const handleExportToExcel = () => {
    if (metricLogs.length === 0) {
      alert('No activity logs to export');
      return;
    }

    // Prepare data for Excel
    const excelData = metricLogs.map((log, index) => ({
      'Sr. No.': metricLogs.length - index,
      'Date': new Date(log.date).toLocaleDateString('en-IN'),
      'Amount': `${metric.unit}${log.amount.toLocaleString()}`,
      'Source': log.source,
      'Running Total': `${metric.unit}${calculateRunningTotal(log).toLocaleString()}`
    }));

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Revenue Activity Log');

    // Auto-size columns
    const maxWidth = 50;
    const wscols = [
      { wch: 8 },  // Sr. No.
      { wch: 15 }, // Date
      { wch: 15 }, // Amount
      { wch: maxWidth }, // Source
      { wch: 18 }  // Running Total
    ];
    ws['!cols'] = wscols;

    // Generate filename with current date
    const filename = `${metric.label.replace(/\s+/g, '_')}_Activity_Log_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  const calculateRunningTotal = (currentLog: RevenueLog): number => {
    // Calculate running total up to and including this log
    return metricLogs
      .filter(log => log.timestamp <= currentLog.timestamp)
      .reduce((sum, log) => sum + log.amount, 0);
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
            <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold block uppercase mb-1">Total Entries</span>
              <span className="text-xl font-bold text-purple-500">{metricLogs.length}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-end">
          <label className="text-xs font-bold text-slate-500 uppercase mb-2">Manual Progress Update (Absolute)</label>
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

      {/* Incremental Revenue Addition Section */}
      <section className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/30 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-green-400 flex items-center">
              <span className="w-2 h-8 bg-green-500 mr-4 rounded-full"></span>
              Add Revenue Entry
            </h3>
            <p className="text-sm text-slate-400 mt-2 ml-6">Incrementally add revenue with date and source tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Amount to Add</label>
            <input
              type="number"
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(e.target.value)}
              placeholder="e.g., 1000"
              className="bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none font-mono text-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Date</label>
            <input
              type="date"
              value={revenueDate}
              onChange={(e) => setRevenueDate(e.target.value)}
              className="bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Revenue Source / Description</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={revenueSource}
                onChange={(e) => setRevenueSource(e.target.value)}
                placeholder="e.g., Client A - Consulting Services"
                className="flex-1 bg-slate-950 border-2 border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none"
              />
              <button
                onClick={handleAddRevenue}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-green-500/20 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>ADD</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Log Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <span className="w-1.5 h-6 bg-purple-500 mr-4 rounded-full"></span>
            Revenue Activity Log
          </h3>
          <button
            onClick={handleExportToExcel}
            disabled={metricLogs.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${metricLogs.length === 0
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export to Excel</span>
          </button>
        </div>

        {metricLogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800">
            <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-500 font-semibold">No revenue entries yet</p>
            <p className="text-slate-600 text-sm mt-2">Add your first revenue entry above to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {metricLogs.map((log, index) => (
              <div
                key={log.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-purple-500/30 transition-all group"
              >
                {editingLogId === log.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-yellow-500/10 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border border-yellow-500/20">
                        EDITING #{metricLogs.length - index}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Amount</label>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Date</label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase block mb-1">Source</label>
                        <input
                          type="text"
                          value={editSource}
                          onChange={(e) => setEditSource(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-yellow-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-bold transition-all flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="bg-purple-500/10 text-purple-400 text-xs font-black px-3 py-1 rounded-full border border-purple-500/20">
                          #{metricLogs.length - index}
                        </span>
                        <span className="text-slate-400 text-sm font-semibold">
                          {new Date(log.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-green-400 font-bold text-lg">
                          +{metric.unit}{log.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium ml-1">{log.source}</p>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Running Total</span>
                        <span className="text-blue-400 font-bold text-lg">
                          {metric.unit}{calculateRunningTotal(log).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(log)}
                          className="p-2 bg-yellow-600/10 hover:bg-yellow-600/20 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg transition-all"
                          title="Edit entry"
                        >
                          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(log.id)}
                          className="p-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all"
                          title="Delete entry"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

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
