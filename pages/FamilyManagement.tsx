
import React, { useState } from 'react';
import { useApp } from '../store';
import { Users, Share2, Shield, LogOut, ChevronRight, UserPlus, Edit3, Save, X, GitGraph, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FamilyManagement: React.FC = () => {
  const { family, logout, updateFamilyDetails, user, isPro, togglePro } = useApp();
  const navigate = useNavigate();
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({
    name: family?.name || '',
    gotra: family?.gotra || '',
    kuladevata: family?.kuladevata || '',
    kuldevi: family?.kuldevi || '',
    origin: family?.origin || ''
  });

  const isAdmin = user?.role === 'Admin';

  const handleShareInvite = () => {
    const inviteLink = `https://ritva.app/join/${family?.id}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join our Family Group on Ritva',
        text: `Join the "${family?.name}" group to preserve our family traditions together.`,
        url: inviteLink,
      });
    } else {
      alert(`Invite link copied: ${inviteLink}`);
    }
  };

  const saveIdentity = () => {
    updateFamilyDetails(identityForm);
    setIsEditingIdentity(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="py-2 flex justify-between items-start">
        <div>
          <h1 className="title-font text-3xl text-orange-950 font-black">{family?.name}</h1>
          <p className="text-orange-900/60 text-sm font-bold uppercase tracking-widest">Family Group • Private</p>
        </div>
        {isAdmin && !isEditingIdentity && (
          <button 
            onClick={() => setIsEditingIdentity(true)}
            className="p-3 bg-white border-2 border-orange-100 text-orange-700 rounded-2xl active:scale-95 transition-transform shadow-sm"
          >
            <Edit3 size={20} />
          </button>
        )}
      </header>

      {/* Pro Membership Card */}
      <section 
        onClick={togglePro}
        className={`rounded-[2.5rem] p-6 flex items-center justify-between group cursor-pointer active:scale-95 transition-all shadow-xl ${isPro ? 'bg-orange-950 text-orange-400' : 'bg-white border-2 border-orange-100 text-gray-500'}`}
      >
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-3xl ${isPro ? 'bg-orange-800' : 'bg-orange-50 text-orange-600'}`}>
            <Sparkles size={32} />
          </div>
          <div>
            <h3 className="font-black text-xl leading-tight">{isPro ? 'Ritva Pro' : 'Free Plan'}</h3>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPro ? 'text-orange-300' : 'text-gray-400'}`}>
              {isPro ? 'AI & Video Enabled' : 'Upgrade for AI & Videos'}
            </p>
          </div>
        </div>
        <ChevronRight size={24} className={isPro ? 'text-orange-700' : 'text-gray-200'} />
      </section>

      {/* Main Action Card: Family Tree */}
      <section 
        onClick={() => navigate('/tree')}
        className="bg-orange-950 rounded-[2.5rem] p-6 text-white shadow-2xl flex items-center justify-between group cursor-pointer active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-5">
          <div className="p-4 bg-orange-800 rounded-3xl group-hover:bg-orange-700 transition-colors">
            <GitGraph size={32} />
          </div>
          <div>
            <h3 className="font-black text-xl leading-tight">Lineage Tree</h3>
            <p className="text-orange-300 text-xs font-bold uppercase tracking-widest mt-1">Explore Generations</p>
          </div>
        </div>
        <ChevronRight size={24} className="text-orange-700" />
      </section>

      {/* Family Identity Section */}
      <section className="bg-white rounded-[2rem] p-6 shadow-md border-b-4 border-orange-200">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          Family Identity
        </h3>
        
        {isEditingIdentity ? (
          <div className="space-y-4 animate-slide-up">
            <div>
              <label className="text-[10px] font-bold text-orange-900 uppercase tracking-widest mb-1 block">Family Name</label>
              <input 
                type="text" 
                className="w-full bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950"
                value={identityForm.name}
                onChange={e => setIdentityForm({...identityForm, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-orange-900 uppercase tracking-widest mb-1 block">Gotra</label>
                <input 
                  type="text" 
                  className="w-full bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950"
                  value={identityForm.gotra}
                  onChange={e => setIdentityForm({...identityForm, gotra: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-orange-900 uppercase tracking-widest mb-1 block">Origin</label>
                <input 
                  type="text" 
                  className="w-full bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950"
                  value={identityForm.origin}
                  onChange={e => setIdentityForm({...identityForm, origin: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-orange-900 uppercase tracking-widest mb-1 block">Kuladevata</label>
              <input 
                type="text" 
                className="w-full bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950"
                value={identityForm.kuladevata}
                onChange={e => setIdentityForm({...identityForm, kuladevata: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-orange-900 uppercase tracking-widest mb-1 block">Kuldevi</label>
              <input 
                type="text" 
                className="w-full bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950"
                value={identityForm.kuldevi}
                onChange={e => setIdentityForm({...identityForm, kuldevi: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={saveIdentity}
                className="flex-1 bg-orange-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
              >
                <Save size={18} /> Save Identity
              </button>
              <button 
                onClick={() => setIsEditingIdentity(false)}
                className="p-4 bg-orange-50 text-orange-900 rounded-2xl active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-orange-900 font-bold uppercase tracking-widest">Gotra</p>
              <p className="font-black text-gray-950 text-lg leading-tight">{family?.gotra || 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-orange-900 font-bold uppercase tracking-widest">Origin</p>
              <p className="font-black text-gray-950 text-lg leading-tight">{family?.origin || 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-orange-900 font-bold uppercase tracking-widest">Kuladevata</p>
              <p className="font-black text-gray-950 text-lg leading-tight">{family?.kuladevata || 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-orange-900 font-bold uppercase tracking-widest">Kuldevi</p>
              <p className="font-black text-gray-950 text-lg leading-tight">{family?.kuldevi || 'Not set'}</p>
            </div>
          </div>
        )}
      </section>

      {/* Invite Section */}
      <section className="bg-orange-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-orange-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-black text-lg leading-tight">Heritage Guardians</h3>
            <p className="text-sm opacity-90 font-medium leading-snug">Invite family members to this vault.</p>
          </div>
        </div>
        <button 
          onClick={handleShareInvite}
          className="w-full bg-white text-orange-700 py-4 rounded-2xl font-black flex items-center justify-center space-x-2 active:scale-95 transition-transform shadow-sm"
        >
          <Share2 size={18} />
          <span>Send Group Invite</span>
        </button>
      </section>

      {/* Members List */}
      <section className="space-y-4">
        <h3 className="font-black text-gray-900 text-xl px-1">Family Circle</h3>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100 overflow-hidden">
          {family?.members.map((mId, idx) => (
            <div key={mId} className={`flex items-center justify-between p-5 ${idx !== family.members.length - 1 ? 'border-b border-orange-50' : ''}`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-700">
                  <Users size={24} />
                </div>
                <div>
                  <p className="font-black text-gray-950 text-base leading-tight">{mId === 'u1' ? 'Rajesh Patil (You)' : 'Family Member'}</p>
                  <p className="text-[10px] text-orange-900 font-black uppercase tracking-widest">{mId === 'u1' ? 'Admin' : 'Member'}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Settings List */}
      <section className="space-y-3 pt-4">
        <button className="w-full bg-white p-5 rounded-[2rem] shadow-sm border border-orange-100 flex items-center justify-between text-gray-700 active:bg-orange-50 transition-colors">
          <div className="flex items-center space-x-4">
            <Shield size={24} className="text-orange-700" />
            <span className="font-black text-base">Privacy & Encryption</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <button 
          onClick={logout}
          className="w-full bg-red-50 p-5 rounded-[2rem] border border-red-100 flex items-center justify-between text-red-600 active:bg-red-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <LogOut size={24} />
            <span className="font-black text-base">Sign Out</span>
          </div>
        </button>
      </section>

      <div className="text-center pt-8">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">Ritva v1.2.0<br/>Decentralized Heritage Network</p>
      </div>
    </div>
  );
};
