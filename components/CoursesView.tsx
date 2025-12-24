
import React, { useState } from 'react';
import { Course, AttendanceRecord, Schedule, SemesterConfig } from '../types';
import { Plus, Trash2, Edit3, Save, Eye, Calendar, ArrowLeft, History, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format, parseISO, eachDayOfInterval, getDay } from 'date-fns';

interface Props {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  attendance: AttendanceRecord[];
  schedules: Schedule[];
  semester: SemesterConfig;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const CoursesView: React.FC<Props> = ({ courses, setCourses, attendance, schedules, semester }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', targetPercentage: 80, color: COLORS[0] });

  const handleSave = () => {
    if (!formData.name) return;
    
    if (editingId) {
      setCourses(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c));
      setEditingId(null);
    } else {
      setCourses(prev => [...prev, { id: Date.now().toString(), ...formData }]);
      setIsAdding(false);
    }
    setFormData({ name: '', targetPercentage: 80, color: COLORS[0] });
  };

  const getDaysInRange = (startStr: string, endStr: string, dayOfWeek: number) => {
    try {
      const interval = { start: parseISO(startStr), end: parseISO(endStr) };
      const days = eachDayOfInterval(interval);
      return days.filter(d => getDay(d) === dayOfWeek).length;
    } catch (e) {
      return 0;
    }
  };

  const calculateCourseStatus = (course: Course) => {
    const records = attendance.filter(r => r.courseId === course.id);
    const attended = records.filter(r => r.status === 'YES').length;
    const missed = records.filter(r => r.status === 'NO').length;
    const cancelled = records.filter(r => r.status === 'NONE').length;
    
    const courseSchedules = schedules.filter(s => s.courseId === course.id);
    let totalPossibleInSemester = 0;
    courseSchedules.forEach(s => {
      totalPossibleInSemester += getDaysInRange(semester.startDate, semester.endDate, s.dayOfWeek);
    });

    const netTotalClasses = Math.max(0, totalPossibleInSemester - cancelled);
    const heldClasses = attended + missed;
    const remainingClasses = Math.max(0, netTotalClasses - heldClasses);
    const maxPossiblePercentage = netTotalClasses > 0 ? ((attended + remainingClasses) / netTotalClasses) * 100 : 0;
    const currentHeldPercentage = heldClasses > 0 ? (attended / heldClasses) * 100 : 100;

    let statusType: 'success' | 'warning' | 'danger' = 'success';
    let message = "Target currently met";

    if (maxPossiblePercentage < course.targetPercentage) {
      statusType = 'danger';
      message = "You are not covered all classes";
    } else if (currentHeldPercentage < course.targetPercentage) {
      statusType = 'warning';
      message = "You can cover classes";
    }

    return { 
      attended, 
      missed, 
      cancelled, 
      netTotalClasses, 
      heldClasses, 
      remainingClasses, 
      currentHeldPercentage,
      maxPossiblePercentage,
      statusType,
      message
    };
  };

  if (detailId) {
    const course = courses.find(c => c.id === detailId);
    const records = attendance
      .filter(r => r.courseId === detailId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="space-y-6 animate-fadeIn">
        <button onClick={() => setDetailId(null)} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: course?.color }}>
              {course?.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{course?.name}</h1>
              <p className="text-slate-400">Attendance Log</p>
            </div>
          </div>
        </header>

        <div className="bg-[#1e293b] rounded-3xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0f172a]/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map((record, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-5">
                    <span className="font-bold text-white">{format(parseISO(record.date), 'PPPP')}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {record.status === 'YES' && <span className="text-emerald-400 font-black">YES</span>}
                    {record.status === 'NO' && <span className="text-rose-400 font-black">NO</span>}
                    {record.status === 'NONE' && <span className="text-amber-400 font-black">CANCELLED</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <p className="text-slate-400">Check coverage feasibility</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-indigo-500/20 shadow-2xl animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input 
              type="text" value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Course Name"
              className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 outline-none"
            />
            <input 
              type="number" value={formData.targetPercentage} 
              onChange={(e) => setFormData(prev => ({ ...prev, targetPercentage: parseInt(e.target.value) || 0 }))}
              className="bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 outline-none"
            />
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} onClick={() => setFormData(prev => ({ ...prev, color: c }))} className={`w-10 h-10 rounded-xl border-2 ${formData.color === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => {setIsAdding(false); setEditingId(null)}} className="text-slate-400 font-bold">Cancel</button>
            <button onClick={handleSave} className="bg-indigo-600 px-6 py-2 rounded-xl font-black text-white">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const stats = calculateCourseStatus(course);
          return (
            <div key={course.id} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700 hover:border-indigo-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: course.color }}>
                  {course.name.charAt(0)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {setEditingId(course.id); setFormData({name: course.name, targetPercentage: course.targetPercentage, color: course.color})}} className="p-2 text-slate-400 hover:text-white"><Edit3 className="w-4 h-4"/></button>
                  <button onClick={() => setCourses(prev => prev.filter(c => c.id !== course.id))} className="p-2 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white">{course.name}</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Goal: {course.targetPercentage}% • Current: {stats.currentHeldPercentage.toFixed(0)}%</p>
              </div>

              <div className={`mt-6 p-4 rounded-2xl border ${
                stats.statusType === 'danger' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                stats.statusType === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {stats.statusType === 'danger' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-xs font-black uppercase tracking-wider">{stats.message}</span>
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  {stats.statusType === 'danger' 
                    ? `Max attainable is only ${stats.maxPossiblePercentage.toFixed(0)}% with ${stats.remainingClasses} classes left.` 
                    : stats.statusType === 'warning'
                    ? `Mathematically possible to reach your ${course.targetPercentage}% target.`
                    : `You are safely above your ${course.targetPercentage}% requirement.`}
                </p>
              </div>

              <button onClick={() => setDetailId(course.id)} className="w-full mt-6 py-3 bg-[#0f172a] rounded-xl text-xs font-black text-indigo-400 border border-slate-700">
                VIEW HISTORY
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesView;
