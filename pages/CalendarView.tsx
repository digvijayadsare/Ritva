
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PANCHANG_DATA_MAP } from '../constants';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // Default Oct 2024
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 9, 31)); // Default Diwali

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const panchang = PANCHANG_DATA_MAP[format(selectedDate, 'yyyy-MM-dd')] || { tithi: '--', paksha: '--', month: '--', name: '--' };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-orange-50">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-orange-50 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-orange-600" />
        </button>
        <h2 className="title-font text-xl text-orange-900 font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-orange-50 rounded-full transition-colors">
          <ChevronRight size={24} className="text-orange-600" />
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 bg-white p-4 rounded-3xl shadow-sm border border-orange-50">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-2">{d}</div>
        ))}
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const hasEvent = format(day, 'yyyy-MM-dd') === '2024-10-31';
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`relative h-12 flex flex-col items-center justify-center rounded-xl transition-all ${
                isSelected ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-orange-50 text-gray-700'
              }`}
            >
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
              {hasEvent && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-orange-600 rounded-full"></div>}
            </button>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{format(selectedDate, 'EEEE, MMM do')}</h3>
            <p className="text-orange-600 font-medium">Ashvin Amavasya • Diwali</p>
          </div>
          <div className="bg-orange-100 text-orange-700 p-2 rounded-xl text-xs font-bold uppercase tracking-tight">
            Amanta System
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#FDF7F2] p-3 rounded-2xl text-center border border-orange-100">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Tithi</p>
            <p className="font-bold text-orange-900">{panchang.tithi}</p>
          </div>
          <div className="bg-[#FDF7F2] p-3 rounded-2xl text-center border border-orange-100">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Paksha</p>
            <p className="font-bold text-orange-900">{panchang.paksha}</p>
          </div>
          <div className="bg-[#FDF7F2] p-3 rounded-2xl text-center border border-orange-100">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Month</p>
            <p className="font-bold text-orange-900">{panchang.month}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest px-1">Traditions Today</h4>
          <div className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between border border-orange-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center text-orange-600 font-bold">L</div>
              <div>
                <p className="font-bold text-gray-800">Lakshmi Puja</p>
                <p className="text-xs text-gray-500">Family Puja • 5 Steps</p>
              </div>
            </div>
            <ChevronRight className="text-orange-300" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
