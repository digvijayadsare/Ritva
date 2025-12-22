
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ChevronLeft, Play, Info, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

export const TraditionDetails: React.FC = () => {
  const { id } = useParams();
  const { traditions, family } = useApp();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showFamilyRef, setShowFamilyRef] = useState(false);

  const tradition = traditions.find(t => t.id === id);
  if (!tradition) return <div>Not found</div>;

  return (
    <div className="pb-32 -mt-4 -mx-4 min-h-screen bg-[#FDF7F2]">
      {/* Header Image */}
      <div className="relative h-72 overflow-hidden shadow-2xl">
        <img 
          src={`https://picsum.photos/seed/${id}/1000/800`} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950 via-transparent to-black/20"></div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/30"
        >
          <ChevronLeft size={28} />
        </button>
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 mb-3">
             <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {tradition.category}
            </span>
            {tradition.isAiGenerated && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Info size={10} /> AI Guided
              </span>
            )}
          </div>
          <h1 className="title-font text-4xl text-white font-bold leading-tight">{tradition.title}</h1>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Family Reference Quick Action */}
        <button 
          onClick={() => setShowFamilyRef(!showFamilyRef)}
          className="w-full bg-orange-950 p-5 rounded-[2rem] flex items-center justify-between text-white shadow-xl"
        >
          <div className="flex items-center gap-3">
            <UserCheck size={24} />
            <span className="font-black text-lg">Family Reference</span>
          </div>
          <span className="text-orange-400 font-bold text-xs uppercase">View Gotra & Elders</span>
        </button>

        {showFamilyRef && (
          <div className="bg-white p-6 rounded-[2rem] border-2 border-orange-200 space-y-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
               <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Gotra</p>
                <p className="font-bold text-gray-900">{family?.gotra}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Kuladevata</p>
                <p className="font-bold text-gray-900">{family?.kuladevata}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Elders to invoke</p>
            <div className="flex flex-wrap gap-2">
              {family?.lineage.map(m => (
                <span key={m.id} className="bg-orange-50 text-orange-950 px-3 py-1 rounded-full font-bold text-sm">
                  {m.name} ({m.relation})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sahitya / Materials */}
        {tradition.materials && tradition.materials.length > 0 && (
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Puja Sahitya</h3>
            <div className="grid grid-cols-1 gap-3">
              {tradition.materials.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 font-bold text-gray-800">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-orange-600 text-xs">✓</div>
                  {m}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Step by Step */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-gray-900 px-2">The Procedure</h3>
          <div className="space-y-8">
            {tradition.steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isCompleted = activeStep > idx;
              return (
                <div key={step.id} className={`relative pl-12 transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                   {/* Vertical Line */}
                  {idx < tradition.steps.length - 1 && (
                    <div className={`absolute left-5 top-12 w-1 h-full rounded-full ${isCompleted ? 'bg-orange-600' : 'bg-orange-100'}`} />
                  )}
                  {/* Circle Marker */}
                  <div className={`absolute left-0 top-0 w-11 h-11 rounded-full flex items-center justify-center font-black border-4 transition-all ${
                    isCompleted ? 'bg-orange-600 border-orange-200 text-white' : isActive ? 'bg-white border-orange-600 text-orange-600' : 'bg-white border-orange-50 text-gray-300'
                  }`}>
                    {isCompleted ? <CheckCircle size={24} /> : idx + 1}
                  </div>
                  
                  <div 
                    onClick={() => setActiveStep(idx)}
                    className={`p-6 rounded-[2.5rem] cursor-pointer transition-all ${isActive ? 'bg-white shadow-xl border border-orange-100 scale-[1.02]' : ''}`}
                  >
                    <h4 className={`font-black text-xl mb-3 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</h4>
                    {isActive && (
                      <div className="space-y-4 animate-slide-up">
                        <p className="text-gray-600 font-medium text-lg leading-relaxed">{step.description}</p>
                        {step.mantra && (
                          <div className="bg-orange-950 p-5 rounded-[2rem] text-orange-100 font-bold italic border-l-8 border-orange-500 text-lg">
                            "{step.mantra}"
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button className="flex-1 bg-orange-50 py-5 rounded-2xl flex items-center justify-center gap-2 text-orange-700 font-black active:scale-95 transition-transform">
                            <Play size={20} /> Watch
                          </button>
                        </div>
                        {idx < tradition.steps.length - 1 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveStep(idx+1); }}
                            className="w-full py-6 bg-orange-600 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-100 mt-4"
                          >
                            Next Step <ArrowRight />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
