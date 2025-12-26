
import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Info, Cake, Heart } from 'lucide-react';
import { PANCHANG_DATA_MAP } from '../constants';
import { useApp } from '../store';

export const CalendarView: React.FC = () => {
  const { family } = useApp();
  const lineage = family?.lineage || [];
  
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = useMemo(() => eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  }), [currentDate]);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const monthDayKey = format(selectedDate, 'MM-dd');
  const panchang = PANCHANG_DATA_MAP[dateKey] || { tithi: '--', paksha: '--', month: '--', name: 'Standard Day' };

  const familyEvents = useMemo(() => {
    const events: any[] = [];
    lineage.forEach(member => {
      if (member.birthDate) {
        const bDay = format(new Date(member.birthDate), 'MM-dd');
        if (bDay === monthDayKey) {
          events.push({ type: 'Birthday', name: `${member.name}'s Birthday`, member });
        }
      }
      if (member.isDeceased && member.deathDate) {
        const dDay = format(new Date(member.deathDate), 'MM-dd');
        if (dDay === monthDayKey) {
          events.push({ type: 'Remembrance', name: `${member.name}'s Remembrance`, member });
        }
      }
    });
    return events;
  }, [lineage, monthDayKey]);

  const checkHasFamilyEvent = (day: Date) => {
    const md = format(day, 'MM-dd');
    return lineage.some(m => {
      const b = m.birthDate ? format(new Date(m.birthDate), 'MM-dd') : null;
      const d = (m.isDeceased && m.deathDate) ? format(new Date(m.deathDate), 'MM-dd') : null;
      return b === md || d === md;
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 hover:bg-orange-50 rounded-2xl transition-colors"><ChevronLeft size={24} className="text-orange-900" /></button>
        <div className="text-center">
           <h2 className="title-font text-2xl text-orange-950 font-black">{format(currentDate, 'MMMM yyyy')}</h2>
           <p className="text-[10px] text-orange-800 font-black uppercase tracking-widest mt-0.5">Hindu Heritage Cycle</p>
        </div>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 hover:bg-orange-50 rounded-2xl transition-colors"><ChevronRight size={24} className="text-orange-900" /></button>
      </header>

      <div className="grid grid-cols-7 gap-2 bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-gray-400 py-2 uppercase tracking-widest">{d}</div>
        ))}
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const hasPanchang = !!PANCHANG_DATA_MAP[format(day, 'yyyy-MM-dd')];
          const hasFamily = checkHasFamilyEvent(day);

          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`relative h-14 flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${
                isSelected 
                  ? 'bg-orange-900 text-white shadow-xl ring-4 ring-orange-100' 
                  : 'hover:bg-orange-50 text-gray-900'
              }`}
            >
              <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-gray-950'}`}>{format(day, 'd')}</span>
              <div className="flex gap-1 absolute bottom-1.5">
                {hasPanchang && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-orange-400' : 'bg-orange-600'}`}></div>}
                {hasFamily && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-600'}`}></div>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-lg border border-orange-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 opacity-30 group-hover:scale-110 transition-transform"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h3 className="text-3xl font-black text-gray-950 leading-tight">{format(selectedDate, 'MMMM do')}</h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="bg-orange-100 text-orange-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{format(selectedDate, 'EEEE')}</span>
               {panchang.name !== 'Standard Day' && <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Auspicious</span>}
            </div>
          </div>
          <div className="bg-orange-950 text-white p-4 rounded-2xl shadow-lg"><Info size={24} /></div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {['Tithi', 'Paksha', 'Month'].map(label => (
            <div key={label} className="bg-[#FDF7F2] p-5 rounded-[2rem] text-center border-b-4 border-orange-200 shadow-sm">
              <p className="text-[10px] text-orange-900 uppercase font-black tracking-widest mb-1.5">{label}</p>
              <p className="font-black text-gray-950 text-lg">{panchang[label.toLowerCase()]}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Events List */}
        <div className="space-y-4 relative z-10">
          {panchang.name !== 'Standard Day' && (
            <div className="bg-orange-50 p-6 rounded-[2.5rem] border-2 border-orange-100">
               <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-orange-950 text-orange-400 rounded-2xl flex items-center justify-center font-black">{panchang.name.charAt(0)}</div>
                 <div>
                   <p className="font-black text-gray-950 text-xl">{panchang.name}</p>
                   <p className="text-xs text-orange-800 font-bold">Standard Observance</p>
                 </div>
               </div>
            </div>
          )}

          {familyEvents.map((ev, i) => (
            <div key={i} className={`p-6 rounded-[2.5rem] border-2 flex items-center space-x-4 ${ev.type === 'Birthday' ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${ev.type === 'Birthday' ? 'bg-blue-600' : 'bg-red-600'}`}>
                 {ev.type === 'Birthday' ? <Cake size={24} /> : <Heart size={24} fill="currentColor" />}
               </div>
               <div>
                 <p className={`font-black text-xl ${ev.type === 'Birthday' ? 'text-blue-900' : 'text-red-900'}`}>{ev.name}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Family Heritage Event</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
