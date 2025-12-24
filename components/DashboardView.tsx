
import React, { useState } from 'react';
import { Course, AttendanceRecord, Schedule, SemesterConfig, AttendanceStatus, ApkFile, View } from '../types';
import { 
  X, 
  Check, 
  Calendar as CalendarIcon,
  History,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { parseISO, eachDayOfInterval, getDay, format, startOfToday, addDays } from 'date-fns';

interface Props {
  courses: Course[];
  attendance: AttendanceRecord[];
  schedules: Schedule[];
  semester: SemesterConfig;
  apks: ApkFile[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  setActiveView: (view: View) => void;
}

const DashboardView: React.FC<Props> = ({ courses, attendance, schedules, semester, setAttendance }) => {
  const [viewDate, setViewDate] = useState(startOfToday());
  
  const dateStr = format(viewDate, 'yyyy-MM-dd');
  const dayOfWeek = getDay(viewDate);
  const isToday = format(viewDate, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd');

  const getDaysInRange = (startStr: string, endStr: string, dayOfWeek: number) => {
    try {
      const interval = { start: parseISO(startStr), end: parseISO(endStr) };
      const days = eachDayOfInterval(interval);
      return days.filter(d => getDay(d) === dayOfWeek).length;
    } catch (e) {
      return 0;
    }
  };

  const calculateStats = (courseId: string) => {
    const courseRecords = attendance.filter(r => r.courseId === courseId);
    const attended = courseRecords.filter(r => r.status === 'YES').length;
    const missed = courseRecords.filter(r => r.status === 'NO').length;
    const noClassCount = courseRecords.filter(r => r.status === 'NONE').length;
    
    const totalHeld = attended + missed;
    
    const courseSchedules = schedules.filter(s => s.courseId === courseId);
    let totalPossibleInSemester = 0;
    courseSchedules.forEach(s => {
      totalPossibleInSemester += getDaysInRange(semester.startDate, semester.endDate, s.dayOfWeek);
    });

    const adjustedTotal = Math.max(0, totalPossibleInSemester - noClassCount);
    const percentage = adjustedTotal > 0 ? (attended / adjustedTotal) * 100 : 0;
    
    return { attended, missed, noClassCount, percentage, totalPossibleInSemester, adjustedTotal, totalHeld };
  };

  const handleStatusChange = (courseId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const filtered = prev.filter(r => !(r.courseId === courseId && r.date === dateStr));
      return [...filtered, { date: dateStr, courseId, status }];
    });
  };

  const getStatus = (courseId: string) => {
    return attendance.find(r => r.courseId === courseId && r.date === dateStr)?.status;
  };

  const navigateDate = (days: number) => {
    setViewDate(prev => addDays(prev, days));
  };

  const resetToToday = () => setViewDate(startOfToday());

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-slate-200">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Academic Hub • Term: {semester.startDate} to {semester.endDate}</p>
        </div>
      </header>

      <div className="space-y-8 animate-slideUp">
        {/* Daily Tracker Card */}
        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30">
                <CalendarIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {format(viewDate, 'EEEE, MMM do')}
                </h2>
                <p className="text-slate-400 text-sm">{isToday ? "Tracking today's schedule" : "Viewing past/future schedule"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#0f172a] p-1 rounded-xl border border-slate-700">
              <button 
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {!isToday && (
                <button 
                  onClick={resetToToday}
                  className="px-3 py-1 text-xs font-bold text-indigo-400 hover:bg-indigo-600/10 rounded-lg transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Today
                </button>
              )}
              <span className="w-px h-4 bg-slate-700 mx-1"></span>
              <button 
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {schedules.filter(s => s.dayOfWeek === dayOfWeek).length > 0 ? (
              schedules.filter(s => s.dayOfWeek === dayOfWeek).map(s => {
                const course = courses.find(c => c.id === s.courseId);
                const status = getStatus(s.courseId);
                return (
                  <div key={s.id} className="bg-[#0f172a] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700 hover:border-indigo-500/30 transition-all">
                    <div>
                      <h4 className="font-bold text-lg text-white">{course?.name}</h4>
                      <p className="text-slate-400 text-sm font-medium">{s.startTime} - {s.endTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(s.courseId, 'YES')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${status === 'YES' ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400'}`}
                      >
                        YES
                      </button>
                      <button 
                        onClick={() => handleStatusChange(s.courseId, 'NO')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${status === 'NO' ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/40' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400'}`}
                      >
                        NO
                      </button>
                      <button 
                        onClick={() => handleStatusChange(s.courseId, 'NONE')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${status === 'NONE' ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/40' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400'}`}
                      >
                        NO CLASS
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#0f172a]/50 rounded-2xl p-12 text-center text-slate-500 italic border border-slate-700/50 lg:col-span-2">
                <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 opacity-30">
                  <CalendarIcon className="w-8 h-8" />
                </div>
                No classes scheduled for this day.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Course Breakdown - Full Width */}
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Course Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => {
              const s = calculateStats(course.id);
              return (
                <div key={course.id} className="group p-5 rounded-2xl bg-[#0f172a] border border-slate-700 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg" style={{ backgroundColor: course.color }}>
                        {course.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{course.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" /> {s.attended} Attended
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <X className="w-3 h-3 text-rose-500" /> {s.missed} Missed
                            </span>
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              Total Held: {s.totalHeld}
                            </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black ${s.percentage < course.targetPercentage ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {s.percentage.toFixed(0)}%
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Target: {course.targetPercentage}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2 shadow-inner">
                    <div 
                      className="h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                      style={{ width: `${Math.min(s.percentage, 100)}%`, backgroundColor: course.color }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                      <span>{s.adjustedTotal} Total Scheduled in Semester</span>
                      <span>{s.noClassCount} "No Class" Deductions</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
