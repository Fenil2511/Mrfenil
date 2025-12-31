
export enum GoalStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  OFF_TRACK = 'OFF_TRACK'
}

export interface Metric {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  status: GoalStatus;
  trend: 'up' | 'down' | 'neutral';
}

export interface DailyTask {
  id: string;
  task: string;
  completed: boolean;
}

export interface DailyLog {
  date: string;
  deepWork: number; // blocks
  revenueActions: boolean;
  contentDone: boolean;
  cyberPractice: boolean;
  englishPractice: boolean;
  fitnessDone: boolean;
  networkingDone: boolean;
  proofLink: string;
  tasks?: DailyTask[];
}

export interface WeeklyPriority {
  id: string;
  task: string;
  completed: boolean;
}

export interface Quarter {
  id: string;
  label: string;
  revenueTarget: number;
  milestones: { id: string; text: string; completed: boolean }[];
  isCompleted: boolean;
}

export interface RevenueLog {
  id: string;
  date: string; // ISO date string
  amount: number;
  source: string; // Description of revenue source
  metricId: string; // Links to the metric (e.g., 'rev')
  timestamp: number; // Unix timestamp for sorting
}

export interface DashboardState {
  metrics: Metric[];
  dailyLogs: DailyLog[];
  weeklyPriorities: WeeklyPriority[];
  quarters: Quarter[];
  revenueLogs: RevenueLog[];
}
