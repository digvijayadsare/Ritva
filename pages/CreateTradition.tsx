
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { CATEGORIES, MARATHI_MONTHS, TITHI_NAMES } from '../constants';
// Added Info to imports to fix "Cannot find name 'Info'" error
import { Sparkles, Plus, Trash2, Save, X, Lock, Image as ImageIcon, Video, ListChecks, Info, Calendar } from 'lucide-react';
import { generateRitualGuide } from '../services/geminiService';
import { Step } from '../types';

export const CreateTradition: React.FC = () => {
  const navigate = useNavigate();
  const { addTradition, isPro, togglePro } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Puja',
    description: '',
    month: 'Chaitra',
    tithi: 'Pratipada',
    paksha: 'Shukla',
    materialsInput: '' // Added for manual materials entry
  });
  
  const [manualSteps, setManualSteps] = useState<Step[]>([]);
  const [ritualData, setRitualData] = useState<any>(null);

  const handleAiGenerate = async () => {
    if (!isPro) {
      alert('AI Generation is a Ritva Pro feature. Please upgrade to use it.');
      return;
    }
    if (!formData.title) return alert('Please enter a Tradition name first');
    setLoading(true);
    const data = await generateRitualGuide(formData.title, formData.category);
    if (data) {
      setRitualData(data);
      // Populate materials and steps from AI
      setFormData(prev => ({
        ...prev,
        materialsInput: data.materials.join('\n')
      }));
      setManualSteps(data.steps.map((s: any, i: number) => ({
        id: 's' + i + Date.now(),
        title: s.title,
        description: s.description,
        mantra: s.mantra
      })));
    }
    setLoading(false);
  };

  const addManualStep = () => {
    const newStep: Step = {
      id: 's' + Date.now(),
      title: '',
      description: '',
    };
    setManualSteps([...manualSteps, newStep]);
  };

  const updateStep = (id: string, updates: Partial<Step>) => {
    setManualSteps(manualSteps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStep = (id: string) => {
    setManualSteps(manualSteps.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!formData.title) return alert('Please enter a Tradition name');
    
    const materialsArray = formData.materialsInput
      .split('\n')
      .map(m => m.trim())
      .filter(m => m !== '');

    const newTradition = {
      id: 't' + Date.now(),
      title: formData.title,
      category: formData.category as any,
      description: formData.description,
      steps: manualSteps,
      materials: materialsArray,
      setupInstructions: ritualData?.setupInstructions || '',
      isAiGenerated: !!ritualData,
      linkedTithi: { month: formData.month, paksha: formData.paksha as any, tithi: formData.tithi }
    };
    addTradition(newTradition);
    navigate('/');
  };

  const handleMediaUpload = (stepId: string, type: 'image' | 'video') => {
    if (type === 'video' && !isPro) {
      alert('Video uploads are a Ritva Pro feature.');
      return;
    }
    
    // Simulate media upload
    const dummyUrl = type === 'image' 
      ? `https://picsum.photos/seed/${stepId}/400/300` 
      : 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
      
    updateStep(stepId, { mediaUrl: dummyUrl, mediaType: type });
  };

  return (
    <div className="flex flex-col min-h-full pb-48">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="title-font text-3xl text-orange-950 font-bold">New Tradition</h1>
          <p className="text-orange-900/60 text-xs font-black uppercase tracking-widest">Archive family heritage</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100">
          <X size={24} className="text-orange-900" />
        </button>
      </header>

      {/* Pro Membership Toggle (Demo Purposes) */}
      <div 
        onClick={togglePro}
        className={`mb-6 p-4 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${isPro ? 'bg-orange-950 border-orange-400 text-orange-400' : 'bg-white border-orange-100 text-gray-400'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isPro ? 'bg-orange-800' : 'bg-gray-100'}`}>
            <Sparkles size={20} />
          </div>
          <div>
            <span className="font-black text-[10px] block uppercase tracking-tighter leading-none mb-1">Membership</span>
            <span className="font-black text-xs uppercase tracking-widest leading-none">{isPro ? 'Ritva Pro Active' : 'Free Version'}</span>
          </div>
        </div>
        {!isPro && <span className="text-[10px] font-black underline bg-orange-100 text-orange-700 px-2 py-1 rounded-lg">UPGRADE</span>}
      </div>

      <div className="space-y-6">
        {/* Section 1: Basic Details */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-orange-600" />
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Basic Information</h3>
          </div>
          
          <div>
            <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Tradition Title</label>
            <input 
              type="text" 
              placeholder="e.g., Ganpati Sthapana"
              className="w-full bg-orange-50 border-2 border-transparent focus:border-orange-500 rounded-2xl p-4 outline-none font-black text-lg text-gray-950"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Category</label>
              <select 
                className="w-full bg-orange-50 rounded-2xl p-4 outline-none font-bold text-gray-950 border-2 border-transparent focus:border-orange-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Hindu Month</label>
              <select 
                className="w-full bg-orange-50 rounded-2xl p-4 outline-none font-bold text-gray-950 border-2 border-transparent focus:border-orange-500"
                value={formData.month}
                onChange={e => setFormData({...formData, month: e.target.value})}
              >
                {MARATHI_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Paksha</label>
              <select 
                className="w-full bg-orange-50 rounded-2xl p-4 outline-none font-bold text-gray-950 border-2 border-transparent focus:border-orange-500"
                value={formData.paksha}
                onChange={e => setFormData({...formData, paksha: e.target.value as any})}
              >
                <option value="Shukla">Shukla (Bright)</option>
                <option value="Krishna">Krishna (Dark)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Tithi</label>
              <select 
                className="w-full bg-orange-50 rounded-2xl p-4 outline-none font-bold text-gray-950 border-2 border-transparent focus:border-orange-500"
                value={formData.tithi}
                onChange={e => setFormData({...formData, tithi: e.target.value})}
              >
                {TITHI_NAMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Puja Sahitya (Materials) */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks size={20} className="text-orange-600" />
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Puja Sahitya / Materials</h3>
          </div>
          <p className="text-[10px] text-gray-400 font-bold mb-3 italic">Enter one material per line (e.g. Haldi, Kumkum...)</p>
          <textarea 
            placeholder="Haldi-Kumkum&#10;Supari&#10;Paan..."
            className="w-full bg-orange-50/50 rounded-2xl p-4 outline-none font-medium text-gray-700 text-sm min-h-[120px] border-2 border-transparent focus:border-orange-200"
            value={formData.materialsInput}
            onChange={e => setFormData({...formData, materialsInput: e.target.value})}
          />
        </div>

        {/* Section 3: The Procedure (Steps) */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black text-gray-900 text-xl">The Procedure</h3>
            <button 
              onClick={handleAiGenerate}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] transition-all ${isPro ? 'bg-orange-950 text-orange-400 shadow-md' : 'bg-gray-100 text-gray-400'}`}
            >
              {loading ? 'Consulting Vedas...' : isPro ? <><Sparkles size={14} /> AI GENERATE</> : <><Lock size={12} /> AI GENERATE</>}
            </button>
          </div>

          <div className="space-y-4">
            {manualSteps.length === 0 && (
              <div className="text-center py-12 bg-white rounded-[2.5rem] border-2 border-dashed border-orange-100 px-6">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-orange-200" size={32} />
                </div>
                <p className="text-gray-400 font-bold text-sm leading-relaxed">
                  No steps recorded.<br/>Add manual steps or use AI Assist to populate the standard process.
                </p>
              </div>
            )}
            
            {manualSteps.map((step, idx) => (
              <div key={step.id} className="bg-white p-6 rounded-[2.5rem] shadow-md border border-orange-100 animate-slide-up relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-8 h-8 rounded-full bg-orange-900 text-white flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</span>
                    <input 
                      type="text"
                      placeholder="Step Title (e.g. Sthapana)"
                      className="w-full bg-transparent font-black text-gray-900 outline-none border-b-2 border-transparent focus:border-orange-200 py-1"
                      value={step.title}
                      onChange={e => updateStep(step.id, { title: e.target.value })}
                    />
                  </div>
                  <button onClick={() => removeStep(step.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>

                <textarea 
                  placeholder="Instructions for this step..."
                  className="w-full bg-orange-50/50 rounded-2xl p-4 outline-none font-medium text-gray-700 text-sm mb-4 min-h-[100px] border-2 border-transparent focus:border-orange-100"
                  value={step.description}
                  onChange={e => updateStep(step.id, { description: e.target.value })}
                />

                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => handleMediaUpload(step.id, 'image')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] transition-all ${step.mediaType === 'image' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-900'}`}
                  >
                    <ImageIcon size={16} /> PHOTO
                  </button>
                  <button 
                    onClick={() => handleMediaUpload(step.id, 'video')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] transition-all ${step.mediaType === 'video' ? 'bg-orange-600 text-white' : isPro ? 'bg-orange-50 text-orange-900' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                  >
                    {isPro ? <Video size={16} /> : <Lock size={12} />} VIDEO
                  </button>
                </div>

                {step.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden border-2 border-orange-100 relative shadow-sm">
                    <img 
                      src={step.mediaType === 'image' ? step.mediaUrl : 'https://images.unsplash.com/photo-1574170609519-d1d320b7c7b8?auto=format&fit=crop&q=80&w=400'} 
                      className="w-full h-32 object-cover" 
                      alt="Step Media"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">
                      {step.mediaType} ATTACHED
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button 
              onClick={addManualStep}
              className="w-full flex items-center justify-center gap-3 py-6 bg-white border-2 border-orange-100 rounded-[2rem] text-orange-900 font-black text-sm active:scale-95 transition-transform shadow-sm"
            >
              <Plus size={24} /> Add Procedure Step
            </button>
          </div>
        </section>
      </div>

      {/* Fixed-ish Action Footer to ensure button is never lost */}
      <div className="mt-12 px-2">
        <button 
          onClick={handleSave}
          className="w-full py-6 bg-orange-700 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-orange-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-orange-800"
        >
          <Save size={24} /> Save to Family Archive
        </button>
        <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-[0.2em]">
          End of Heritage Entry
        </p>
      </div>
    </div>
  );
};
