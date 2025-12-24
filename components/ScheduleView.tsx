
import React, { useState } from 'react';
import { Course, Schedule, SemesterConfig } from '../types';
import { Plus, Trash2, Clock, CalendarDays, CalendarRange, ArrowRight } from 'lucide-react';

interface Props {
  courses: Course[];
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  semester: SemesterConfig;
  setSemester: React.Dispatch<React.SetStateAction<SemesterConfig>>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleView: React.FC<Props> = ({ courses, schedules, setSchedules, semester, setSemester }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ 
    courseId: courses[0]?.id || '', 
    dayOfWeek: 1, 
    startTime: '09:00', 
    endTime: '10:30' 
  });

  const handleAdd = () => {
    if (!formData.courseId) return;
    setSchedules(prev => [...prev, { id: Date.now().toString(), ...formData }]);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleSemesterDateChange = (field: keyof SemesterConfig, value: string) => {
    setSemester(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Class Schedule</h1>
          <p className="text-slate-400">Define your recurring weekly classes</p>
        </div>
        
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/20">
            <CalendarRange className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-xs">
              <p className="text-slate-500 font-bold uppercase tracking-wider mb-1">Term Starts</p>
              <input 
                type="date"
                value={semester.startDate}
                onChange={(e) => handleSemesterDateChange('startDate', e.target.value)}
                className="bg-[#0f172a] text-indigo-400 border border-slate-700 rounded-lg px-2 py-1 outline-none font-black"
              />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-700 hidden md:block" />
            <div className="text-xs">
              <p className="text-slate-500 font-bold uppercase tracking-wider mb-1">Term Ends</p>
              <input 
                type="date"
                value={semester.endDate}
                onChange={(e) => handleSemesterDateChange('endDate', e.target.value)}
                className="bg-[#0f172a] text-indigo-400 border border-slate-700 rounded-lg px-2 py-1 outline-none font-black"
              />
            </div>
          </div>
        </div>

        <button 
          disabled={courses.length === 0}
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-indigo-500/20 shadow-2xl animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Subject</label>
              <select 
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.courseId}
                onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Day</label>
              <select 
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
              >
                {DAYS.map((day, idx) => (
                  <option key={day} value={idx}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Starts</label>
              <input 
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Ends</label>
              <input 
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-10">
            <button onClick={() => setIsAdding(false)} className="px-6 py-3 text-slate-400 font-bold hover:text-white hover:bg-slate-800 rounded-xl transition-all">Cancel</button>
            <button onClick={handleAdd} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-900/40">Add to Schedule</button>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f172a]/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Weekday</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Time Slot</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {schedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map(schedule => {
                const course = courses.find(c => c.id === schedule.courseId);
                return (
                  <tr key={schedule.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#0f172a] p-2 rounded-lg border border-slate-700 shadow-sm">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-200">{DAYS[schedule.dayOfWeek]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: course?.color || '#334155' }} />
                        <span className="font-bold text-white">{course?.name || 'Unknown Course'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 w-fit px-3 py-1.5 rounded-lg shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {schedule.startTime} — {schedule.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleDelete(schedule.id)}
                        className="p-2.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {schedules.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center text-slate-500">
                    <CalendarDays className="w-16 h-16 mx-auto mb-6 opacity-5" />
                    <p className="font-bold text-lg text-slate-400">Your schedule is clear.</p>
                    <p className="text-sm">Build your class calendar to start tracking.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
