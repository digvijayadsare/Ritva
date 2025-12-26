
import React from 'react';
import { useApp } from '../store';
import { ChevronRight, Bell, Heart, BookOpen, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { PANCHANG_DATA_MAP } from '../constants';

export const Dashboard: React.FC = () => {
  const { traditions, family, ancestors } = useApp();
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayPanchang = PANCHANG_DATA_MAP[todayStr];

  // Logic to show a relevant banner
  const bannerTitle = todayPanchang?.name || "Daily Panchang";
  const bannerSubtitle = todayPanchang 
    ? `${todayPanchang.month} ${todayPanchang.tithi}`
    : "Auspicious Tithi & Timings";

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

      {/* Quick Lineage Card */}
      <section className="bg-white rounded-[2rem] p-6 shadow-sm border-b-4 border-orange-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-gray-900">Family Roots</h3>
          <span className="bg-orange-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">Verified</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Gotra</p>
            <p className="font-bold text-gray-800 text-sm truncate">{family?.gotra || '--'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Kuladevata</p>
            <p className="font-bold text-gray-800 text-sm truncate">{family?.kuladevata || '--'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Kuldevi</p>
            <p className="font-bold text-gray-800 text-sm truncate">{family?.kuldevi || '--'}</p>
          </div>
        </div>
      </section>

      {/* Dynamic Tithi Banner - Fixed Readability & Image */}
      <section 
        className="relative h-72 rounded-[3rem] overflow-hidden shadow-xl cursor-pointer ring-4 ring-white group bg-orange-50 border border-orange-100"
        onClick={() => navigate('/calendar')}
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1561339396-932d1f953282?auto=format&fit=crop&q=80&w=1200" 
            alt="Ritual Background" 
            className="w-full h-full object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543165365-07232ed12fad?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-50/90 via-orange-50/20 to-transparent"></div>
        </div>
        
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 bg-orange-950 text-white px-4 py-1.5 rounded-full text-[10px] font-black w-fit mb-4 uppercase tracking-[0.15em] shadow-lg">
            <Sparkles size={12} className="text-orange-400" />
            {todayPanchang ? "Today's Celebration" : "Current Tithi"}
          </div>
          
          <h2 className="title-font text-5xl text-orange-950 font-black mb-1 drop-shadow-sm">
            {bannerTitle}
          </h2>
          
          <div className="flex items-center gap-2 text-orange-900 text-xl font-bold">
            <CalendarIcon size={20} className="text-orange-600" />
            <span>{bannerSubtitle}</span>
          </div>
          
          <p className="text-orange-900/60 text-xs mt-3 font-black uppercase tracking-[0.2em]">
            {format(today, 'EEEE, MMMM do')}
          </p>
        </div>
      </section>

      {/* Upcoming Punya Tithis Section */}
      {ancestors && ancestors.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="font-black text-gray-900 text-2xl">Remembrances</h3>
            <button onClick={() => navigate('/ancestors')} className="text-orange-700 font-bold flex items-center gap-1 text-sm">
              All Elders <ChevronRight size={18} />
            </button>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border-2 border-orange-50 shadow-sm">
            {ancestors.slice(0, 2).map((a, idx) => (
              <div key={a.id} className={`flex items-center gap-4 ${idx > 0 ? 'mt-4 pt-4 border-t border-orange-100' : ''}`}>
                <div className="w-14 h-14 bg-orange-50 rounded-2xl border-2 border-orange-100 overflow-hidden shrink-0 shadow-inner">
                  <img src={a.photoUrl || `https://picsum.photos/seed/${a.id}/100/100`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-950 text-base">{a.name}</h4>
                  <p className="text-orange-800 text-xs font-bold uppercase tracking-wider opacity-80">
                    {a.punyaTithi?.month} {a.punyaTithi?.tithi} • {a.punyaTithi?.paksha}
                  </p>
                </div>
                <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                  <Heart size={20} className="text-red-500" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Traditions Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-gray-900 text-2xl">Family Rituals</h3>
          <button className="text-orange-700 font-bold flex items-center gap-1">
            View All <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {traditions.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-8 text-center border-2 border-dashed border-orange-100">
              <p className="text-gray-400 font-bold">No rituals recorded yet.</p>
              <button 
                onClick={() => navigate('/create')}
                className="mt-4 bg-orange-950 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
              >
                Add First Tradition
              </button>
            </div>
          ) : (
            traditions.map(t => (
              <div 
                key={t.id}
                onClick={() => navigate(`/tradition/${t.id}`)}
                className="bg-white rounded-[2rem] p-5 shadow-sm border border-orange-50 flex items-center gap-4 active:scale-95 transition-transform"
              >
                <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-orange-100">
                  <img src={`https://picsum.photos/seed/${t.id}/200/200`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 text-lg leading-tight">{t.title}</h4>
                  <p className="text-orange-700 text-[10px] font-black uppercase tracking-widest mt-1">{t.category}</p>
                </div>
                <ChevronRight className="text-orange-200" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
