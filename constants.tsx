
import React from 'react';
import { GoalStatus, Metric, Quarter } from './types';

export const REVENUE_TARGET_INR = 450000000;
export const BUG_BOUNTY_TARGET_USD = 10000;
export const YT_SUBS_TARGET = 500000;

export const INITIAL_METRICS: Metric[] = [
  { id: 'rev', label: 'Revenue (INR)', target: REVENUE_TARGET_INR, current: 0, unit: '₹', status: GoalStatus.ON_TRACK, trend: 'neutral' },
  { id: 'aei', label: 'CompliYUG Customers', target: 1000, current: 0, unit: '', status: GoalStatus.ON_TRACK, trend: 'neutral' },
  { id: 'bb', label: 'Bug Bounty', target: BUG_BOUNTY_TARGET_USD, current: 0, unit: '$', status: GoalStatus.ON_TRACK, trend: 'neutral' },
  { id: 'yt', label: 'YT Subscribers', target: YT_SUBS_TARGET, current: 0, unit: '', status: GoalStatus.ON_TRACK, trend: 'neutral' },
  { id: 'certs', label: 'Certs Completed', target: 3, current: 0, unit: '', status: GoalStatus.ON_TRACK, trend: 'neutral' },
  { id: 'weight', label: 'Body Fat %', target: 10, current: 20, unit: '%', status: GoalStatus.AT_RISK, trend: 'neutral' },
];

export const INITIAL_QUARTERS: Quarter[] = [
  { 
    id: 'Q1', 
    label: 'Q1 2026', 
    revenueTarget: 75000000, 
    isCompleted: false,
    milestones: [
      { id: 'm1', text: 'DPDP Beta Release', completed: false },
      { id: 'm2', text: 'CISA Exam', completed: false },
      { id: 'm3', text: 'YT 150k Subs', completed: false }
    ] 
  },
  { 
    id: 'Q2', 
    label: 'Q2 2026', 
    revenueTarget: 100000000, 
    isCompleted: false,
    milestones: [
      { id: 'm4', text: 'SSP Prep Start', completed: false },
      { id: 'm5', text: '10 Major CXO Interviews', completed: false },
      { id: 'm6', text: 'Fitness Peak Phase 1', completed: false }
    ] 
  },
  { 
    id: 'Q3', 
    label: 'Q3 2026', 
    revenueTarget: 125000000, 
    isCompleted: false,
    milestones: [
      { id: 'm7', text: 'CompliYUG V2 Global', completed: false },
      { id: 'm8', text: 'YT 300k Subs', completed: false },
      { id: 'm9', text: 'SSP Certification', completed: false }
    ] 
  },
  { 
    id: 'Q4', 
    label: 'Q4 2026', 
    revenueTarget: 150000000, 
    isCompleted: false,
    milestones: [
      { id: 'm10', text: 'Exit Prep / Scale-up', completed: false },
      { id: 'm11', text: 'YT 500k Subs', completed: false },
      { id: 'm12', text: '6-Pack Confirmation', completed: false }
    ] 
  },
];

export const ICONS = {
  Revenue: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Security: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Fitness: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  Communication: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Content: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
};
