
import React, { useMemo, useState } from 'react';
import { useApp } from '../store';
import { ChevronRight, Heart, BookOpen, Calendar as CalendarIcon, Sparkles, User, Bell, Cake, ShoppingBasket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { PANCHANG_DATA_MAP } from '../constants';

const ImageWithFallback = ({ src, name, gender, className }: { src?: string, name: string, gender?: string, className: string }) => {
  const [error, setError] = useState(false);
  
  if (!src || error) {
    return (
      <div className={`${className} flex items-center justify-center overflow-hidden ${
        gender === 'Female' ? 'bg-pink-50 text-pink-200' : 'bg-blue-50 text-blue-200'
      }`}>
        <User size={24} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      className={className} 
      alt={name} 
      onError={() => setError(true)} 
    />
  );
};

export const Dashboard: React.FC = () => {
  const { traditions, family } = useApp();
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayMd = format(today, 'MM-dd');
  const todayPanchang = PANCHANG_DATA_MAP[todayStr];

  // 1. Logic for Today's Family Events (One-liner)
  const todayFamilyEvent = useMemo(() => {
    const lineage = family?.lineage || [];
    const member = lineage.find(m => {
      const b = m.birthDate ? format(new Date(m.birthDate), 'MM-dd') : null;
      const d = (m.isDeceased && m.deathDate) ? format(new Date(m.deathDate), 'MM-dd') : null;
      return b === todayMd || d === todayMd;
    });

    if (!member) return null;
    const isBday = member.birthDate && format(new Date(member.birthDate), 'MM-dd') === todayMd;
    return {
      name: member.name,
      type: isBday ? 'Birthday' : 'Remembrance',
      label: isBday ? `Today: ${member.name}'s Birthday` : `Today: ${member.name}'s Punya Tithi`
    };
  }, [family, todayMd]);

  // 2. Logic for Upcoming Events (Next 15 days)
  const upcomingHighlights = useMemo(() => {
    const highlights = [];
    const lineage = family?.lineage || [];
    
    for (let i = 1; i <= 15; i++) {
      const futureDate = addDays(today, i);
      const futureKey = format(futureDate, 'yyyy-MM-dd');
      const futureMd = format(futureDate, 'MM-dd');
      
      const fest = PANCHANG_DATA_MAP[futureKey];
      if (fest) {
        highlights.push({
          type: 'Festival',
          title: fest.name,
          date: futureDate,
          subtitle: `${fest.month} ${fest.tithi}`,
          raw: fest
        });
      }
      
      lineage.forEach(m => {
        if (m.birthDate && format(new Date(m.birthDate), 'MM-dd') === futureMd) {
          highlights.push({
            type: 'Birthday',
            title: `${m.name}'s Birthday`,
            date: futureDate,
            subtitle: 'Family Celebration'
          });
        }
        if (m.isDeceased && m.deathDate && format(new Date(m.deathDate), 'MM-dd') === futureMd) {
          highlights.push({
            type: 'Remembrance',
            title: `${m.name}'s Remembrance`,
            date: futureDate,
            subtitle: 'Ancestral Punya Tithi'
          });
        }
      });
    }
    return highlights.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [family, today]);

  const nextEvent = upcomingHighlights[0];

  // 3. Find if the next event has a matching ritual in traditions
  const linkedRitual = useMemo(() => {
    if (!nextEvent) return null;
    return traditions.find(t => 
      t.title.toLowerCase().includes(nextEvent.title.toLowerCase()) || 
      (nextEvent.type === 'Festival' && t.linkedFestivalId === nextEvent.title)
    );
  }, [nextEvent, traditions]);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center py-4">
        <div>
          <h1 className="title-font text-5xl text-orange-950 font-bold leading-tight tracking-tight">Ritva</h1>
          <p className="text-orange-800 text-lg font-semibold">{family?.name}</p>
        </div>
        <div className="p-4 bg-orange-100 rounded-3xl border-2 border-orange-200 cursor-pointer shadow-sm active:scale-95 transition-all" onClick={() => navigate('/family')}>
          <BookOpen className="text-orange-900" size={32} />
        </div>
      </header>

      {/* Quick Identity Section */}
      <section className="bg-white rounded-[2rem] p-6 shadow-sm border-b-4 border-orange-200">
        <div className="flex items-center justify-around">
          <div className="text-center px-2 flex-1">
            <p className="text-[9px] text-orange-900/40 font-black uppercase tracking-widest mb-1">Gotra</p>
            <p className="font-black text-orange-950 text-xs sm:text-sm">{family?.gotra || '--'}</p>
          </div>
          <div className="w-px h-8 bg-orange-100 shrink-0"></div>
          <div className="text-center px-2 flex-1">
            <p className="text-[9px] text-orange-900/40 font-black uppercase tracking-widest mb-1">Kuladevata</p>
            <p className="font-black text-orange-950 text-xs sm:text-sm">{family?.kuladevata || '--'}</p>
          </div>
          <div className="w-px h-8 bg-orange-100 shrink-0"></div>
          <div className="text-center px-2 flex-1">
            <p className="text-[9px] text-orange-900/40 font-black uppercase tracking-widest mb-1">Kuldevi</p>
            <p className="font-black text-orange-950 text-xs sm:text-sm">{family?.kuldevi || '--'}</p>
          </div>
        </div>
      </section>

      {/* Main Feature Containers */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Container 1: Daily Panchang */}
        <section 
          className="relative h-72 rounded-[3.5rem] overflow-hidden shadow-2xl cursor-pointer ring-4 ring-white group bg-orange-950"
          onClick={() => navigate('/calendar')}
        >
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1543165365-07232ed12fad?auto=format&fit=crop&q=80&w=1200" 
              alt="Ritual Diyas" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950 via-orange-950/20 to-transparent"></div>
          </div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black w-fit mb-4 uppercase tracking-[0.1em] shadow-lg">
              <Sparkles size={10} className="text-orange-200" />
              Daily Panchang
            </div>
            
            <h2 className="title-font text-5xl text-white font-black mb-1">
              {todayPanchang?.name || format(today, 'MMMM do')}
            </h2>
            
            <div className="flex items-center gap-2 text-orange-200 text-lg font-bold">
              <CalendarIcon size={18} />
              <span>{todayPanchang ? `${todayPanchang.month} ${todayPanchang.tithi}` : format(today, 'EEEE')}</span>
            </div>

            {todayFamilyEvent && (
              <div className="mt-4 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 w-full">
                <div className={`w-2 h-2 rounded-full animate-pulse ${todayFamilyEvent.type === 'Birthday' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                <p className="text-xs font-black text-white uppercase tracking-widest truncate">
                  {todayFamilyEvent.label}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Container 2: Upcoming Highlights */}
        <section 
          className="relative h-72 rounded-[3.5rem] overflow-hidden shadow-2xl ring-4 ring-white bg-white group border border-orange-50"
        >
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1517373116369-9bdb8ca51622?auto=format&fit=crop&q=80&w=1200" 
              alt="Marigold Background" 
              className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-[9px] font-black w-fit mb-4 uppercase tracking-[0.1em] border border-blue-100">
                <Bell size={10} />
                Upcoming Heritage
              </div>
              
              <h2 className="title-font text-4xl text-orange-950 font-black mb-1">
                {nextEvent ? nextEvent.title : "No Major Events"}
              </h2>
              
              <div className="flex items-center gap-2 text-orange-800 text-lg font-bold opacity-70">
                {nextEvent?.type === 'Birthday' ? <Cake size={18} /> : nextEvent?.type === 'Remembrance' ? <Heart size={18} /> : <Sparkles size={18} />}
                <span>{nextEvent ? `${format(nextEvent.date, 'MMM do')} • ${nextEvent.subtitle}` : "Scan History"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/calendar')}
                className="flex-1 bg-orange-50 text-orange-900 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-orange-100 active:scale-95 transition-transform"
              >
                View Timeline
              </button>
              
              {linkedRitual && (
                <button 
                  onClick={() => navigate(`/tradition/${linkedRitual.id}`)}
                  className="flex-[1.5] bg-orange-950 text-white py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
                >
                  <ShoppingBasket size={14} className="text-orange-400" />
                  Check Ritual
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Family Rituals Highlights */}
      <section>
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="font-black text-gray-900 text-2xl">Family Rituals</h3>
          <button onClick={() => navigate('/create')} className="text-orange-700 font-bold flex items-center gap-1 text-sm">
            Record New <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {traditions.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-10 text-center border-2 border-dashed border-orange-100">
              <p className="text-gray-400 font-bold">Your heritage vault is empty.</p>
              <button onClick={() => navigate('/create')} className="mt-4 text-orange-700 font-black text-xs uppercase tracking-widest">Start First Entry</button>
            </div>
          ) : (
            traditions.slice(0, 3).map(t => (
              <div 
                key={t.id}
                onClick={() => navigate(`/tradition/${t.id}`)}
                className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-orange-50 flex items-center gap-5 active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-orange-100">
                  <img src={`https://picsum.photos/seed/${t.id}/200/200`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 text-base leading-tight">{t.title}</h4>
                  <span className="text-orange-700 text-[9px] font-black uppercase tracking-widest mt-1 block">{t.category}</span>
                </div>
                <ChevronRight className="text-orange-200" />
              </div>
            ))
          )}
        </div>
      </section>

      <div className="h-10"></div>
    </div>
  );
};
