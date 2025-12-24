
import React from 'react';
import { SemesterConfig } from '../types';
import { CalendarRange, Save } from 'lucide-react';

interface Props {
  semester: SemesterConfig;
  setSemester: React.Dispatch<React.SetStateAction<SemesterConfig>>;
}

const SemesterView: React.FC<Props> = ({ semester, setSemester }) => {
  const handleChange = (field: keyof SemesterConfig, value: string) => {
    setSemester(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-200">
      <header>
        <h1 className="text-3xl font-bold text-white">Semester Configuration</h1>
        <p className="text-slate-400">Define the duration of your academic term</p>
      </header>

      <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-600/20 p-3 rounded-2xl text-indigo-400 border border-indigo-500/20">
            <CalendarRange className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Term Dates</h2>
            <p className="text-sm text-slate-500 font-medium">Auto-calculates potential class sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-400">Semester Start Date</label>
            <input 
              type="date"
              value={semester.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-400">Semester End Date</label>
            <input 
              type="date"
              value={semester.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="mt-12 p-6 bg-[#0f172a] rounded-2xl border border-slate-700">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
            Calculation Logic
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Attendance percentages are dynamic. We count every instance of your scheduled days between these two dates. 
            <br/><br/>
            Selecting <span className="text-amber-400 font-black">"No class"</span> in the tracker removes that session from the total count entirely, ensuring holidays don't hurt your stats.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SemesterView;
