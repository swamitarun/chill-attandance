
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Bell,
  Heart
} from 'lucide-react';
import { View, Course, Schedule, AttendanceRecord, SemesterConfig } from './types';
import DashboardView from './components/DashboardView';
import CoursesView from './components/CoursesView';
import ScheduleView from './components/ScheduleView';
import { startOfToday, addMonths, format } from 'date-fns';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Economics', targetPercentage: 80, color: '#3b82f6' },
      { id: '2', name: 'Biology', targetPercentage: 80, color: '#10b981' }
    ];
  });

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : [];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [semester, setSemester] = useState<SemesterConfig>(() => {
    const saved = localStorage.getItem('semester');
    return saved ? JSON.parse(saved) : {
      startDate: format(startOfToday(), 'yyyy-MM-dd'),
      endDate: format(addMonths(startOfToday(), 4), 'yyyy-MM-dd')
    };
  });

  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('schedules', JSON.stringify(schedules)); }, [schedules]);
  useEffect(() => { localStorage.setItem('attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('semester', JSON.stringify(semester)); }, [semester]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            courses={courses} 
            attendance={attendance} 
            schedules={schedules} 
            semester={semester} 
            setAttendance={setAttendance}
            setActiveView={setActiveView}
          />
        );
      case 'courses':
        return <CoursesView courses={courses} setCourses={setCourses} attendance={attendance} schedules={schedules} semester={semester} />;
      case 'schedule':
        return <ScheduleView courses={courses} schedules={schedules} setSchedules={setSchedules} semester={semester} setSemester={setSemester} />;
      default:
        return <DashboardView 
            courses={courses} 
            attendance={attendance} 
            schedules={schedules} 
            semester={semester} 
            setAttendance={setAttendance}
            setActiveView={setActiveView}
          />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-[#1e293b] border-b border-slate-700 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-black text-xl tracking-tighter text-white uppercase italic ml-1">chill</span>
        </div>
        <button className="p-2 text-slate-400"><Bell className="w-5 h-5" /></button>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-[#1e293b] border-r border-slate-700 h-screen sticky top-0">
        <div className="p-6 flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">chill</span>
          </div>

          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id 
                    ? 'bg-indigo-600/10 text-indigo-400 font-semibold border border-indigo-500/20 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-indigo-400' : ''}`} />
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Footer Section */}
          <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/10 rounded-2xl border border-slate-700/30 w-full justify-center group hover:bg-slate-800/30 transition-all">
              <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 group-hover:text-slate-300 transition-colors uppercase tracking-widest">
                Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" /> by TSP
              </p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto dark-scrollbar">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-around bg-[#1e293b] border-t border-slate-700 px-2 py-2 sticky bottom-0 z-50 shadow-2xl">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
              activeView === item.id ? 'text-indigo-400' : 'text-slate-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
