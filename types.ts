
export type AttendanceStatus = 'YES' | 'NO' | 'NONE';

export interface Course {
  id: string;
  name: string;
  targetPercentage: number;
  color: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface AttendanceRecord {
  date: string; // ISO string (YYYY-MM-DD)
  courseId: string;
  status: AttendanceStatus;
}

export interface SemesterConfig {
  startDate: string;
  endDate: string;
}

// Added ApkFile interface to fix the missing export error in ApkView and SettingsView
export interface ApkFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  type: string;
  content: string;
}

// Expanded View type to include all available application views
export type View = 'dashboard' | 'courses' | 'schedule' | 'apks' | 'settings' | 'semester' | 'attendance' | 'lectures';
