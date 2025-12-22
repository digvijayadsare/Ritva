
import React, { useState } from 'react';
import { useApp } from '../store';
import { MARATHI_MONTHS } from '../constants';
import { Plus, User, Calendar as CalendarIcon, Heart, X, Trash2 } from 'lucide-react';

export const AncestorManagement: React.FC = () => {
  // Fix: Property 'addAncestor' does not exist on type 'AppState'. Using 'addFamilyMember' instead.
  const { ancestors, addFamilyMember } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    month: 'Kartik',
    paksha: 'Krishna' as 'Shukla' | 'Krishna',
    tithi: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Using addFamilyMember and ensuring required fields like gender and isDeceased are provided.
    addFamilyMember({
      id: 'a' + Date.now(),
      name: formData.name,
      relation: formData.relation,
      gender: formData.gender,
      isDeceased: true,
      punyaTithi: { month: formData.month, paksha: formData.paksha, tithi: formData.tithi.toString() },
      photoUrl: `https://picsum.photos/seed/${formData.name}/200/200`
    });
    setIsAdding(false);
    setFormData({ name: '', relation: '', gender: 'Male', month: 'Kartik', paksha: 'Krishna', tithi: 1 });
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center py-2">
        <h1 className="title-font text-3xl text-orange-950 font-black">In Memory</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-orange-700 text-white p-3 rounded-2xl shadow-lg shadow-orange-100 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <p className="text-orange-900/70 font-bold text-sm px-1 leading-relaxed italic">
        "Preserve the legacy of those who walked before us. Their traditions live through you."
      </p>

      <div className="space-y-4">
        {ancestors.map(a => (
          <div key={a.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-orange-100 flex items-center space-x-4">
            <div className="relative">
              <img src={a.photoUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200" alt={a.name} />
              <div className="absolute -bottom-1 -right-1 bg-red-600 p-1 rounded-full text-white shadow-md">
                <Heart size={10} fill="currentColor" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-gray-950 text-lg">{a.name}</h3>
              <p className="text-xs text-orange-700 font-black uppercase tracking-widest mb-1">{a.relation}</p>
              <div className="flex items-center text-xs text-gray-500 font-bold space-x-2">
                <CalendarIcon size={12} className="text-orange-400" />
                <span>{a.punyaTithi?.month} {a.punyaTithi?.tithi}, {a.punyaTithi?.paksha} Paksha</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFBF7] w-full max-w-md rounded-[3rem] p-8 space-y-6 animate-slide-up border-t-8 border-orange-600">
            <div className="flex justify-between items-center">
              <h2 className="title-font text-2xl text-orange-950 font-black">Add Ancestor</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-orange-50 rounded-full text-orange-900"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-1 block">Full Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950 text-lg"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-1 block">Relation</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g., Aaja (Grandfather)"
                    className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-500 outline-none font-bold text-gray-950 text-lg"
                    value={formData.relation}
                    onChange={e => setFormData({...formData, relation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-1 block">Gender</label>
                  <select 
                    className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 outline-none font-bold text-gray-950"
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value as any})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-1 block">Tithi Month</label>
                  <select 
                    className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 outline-none font-bold text-gray-950"
                    value={formData.month}
                    onChange={e => setFormData({...formData, month: e.target.value})}
                  >
                    {MARATHI_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-1 block">Tithi Day (1-15)</label>
                  <input 
                    required
                    type="number" 
                    min="1" 
                    max="15"
                    className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 outline-none font-bold text-gray-950 text-lg"
                    value={formData.tithi}
                    onChange={e => setFormData({...formData, tithi: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-orange-700 text-white rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-transform mt-4"
              >
                Honor Legacy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
