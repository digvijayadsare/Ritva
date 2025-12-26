
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { 
  ChevronRight, Plus, User, Trash2, Edit2, X, Heart, Users, 
  ChevronDown, Save, UserMinus, UserPlus, Info, AlertTriangle,
  ZoomIn, ZoomOut, Maximize, Target
} from 'lucide-react';
import { FamilyMember } from '../types';

export const FamilyTree: React.FC = () => {
  const { family, addFamilyMember, updateFamilyMember, deleteFamilyMember } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addMode, setAddMode] = useState<'Child' | 'Spouse'>('Child');
  const [zoom, setZoom] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const selfRef = useRef<HTMLDivElement>(null);

  const lineage = family?.lineage || [];

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female',
    isDeceased: false,
    relation: ''
  });

  const selectedMember = useMemo(() => 
    lineage.find(m => m.id === selectedMemberId), 
    [lineage, selectedMemberId]
  );

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));

  const focusSelf = () => {
    setZoom(1); // Set zoom to 100% for fit-to-screen feel
    // Small delay to let browser handle the zoom transformation before scrolling
    setTimeout(() => {
      if (selfRef.current) {
        selfRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center', 
          inline: 'center' 
        });
        const selfMember = lineage.find(m => m.relation?.toLowerCase() === 'self');
        if (selfMember) setSelectedMemberId(selfMember.id);
      }
    }, 150);
  };

  // Auto-focus self on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      focusSelf();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const newMember: FamilyMember = {
      id: 'm' + Date.now(),
      name: formData.name,
      gender: formData.gender,
      isDeceased: formData.isDeceased,
      relation: formData.relation || addMode,
    };

    if (addMode === 'Child') {
      newMember.parentId = selectedMemberId;
    } else if (addMode === 'Spouse') {
      newMember.spouseId = selectedMemberId;
      updateFamilyMember(selectedMemberId, { spouseId: newMember.id });
    }
    
    addFamilyMember(newMember);
    setIsAdding(false);
    resetForm();
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    updateFamilyMember(selectedMemberId, {
      name: formData.name,
      gender: formData.gender as any,
      isDeceased: formData.isDeceased,
      relation: formData.relation
    });
    setIsEditing(false);
    resetForm();
  };

  const confirmDelete = (deleteDescendants: boolean) => {
    if (selectedMemberId) {
      deleteFamilyMember(selectedMemberId, deleteDescendants);
      setSelectedMemberId(null);
      setShowDeleteDialog(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', gender: 'Male', isDeceased: false, relation: '' });
  };

  const openEdit = (member: FamilyMember) => {
    setFormData({
      name: member.name,
      gender: (member.gender as any) || 'Male',
      isDeceased: member.isDeceased,
      relation: member.relation || ''
    });
    setIsEditing(true);
  };

  const renderGenerations = () => {
    const roots = lineage.filter(m => {
      const hasParent = !!m.parentId;
      if (hasParent) return false;
      const spouse = lineage.find(s => s.id === m.spouseId);
      if (spouse && spouse.parentId) return false;
      if (spouse) {
        if (m.gender === 'Male' && spouse.gender !== 'Male') return true;
        if (m.gender === 'Female' && spouse.gender === 'Male') return false;
        return m.id < spouse.id;
      }
      return true;
    });
    
    const renderCoupleNode = (member: FamilyMember) => {
      const spouse = lineage.find(m => m.id === member.spouseId);
      const children = lineage.filter(m => m.parentId === member.id || (spouse && m.parentId === spouse.id));
      
      let leftMember = member;
      let rightMember = spouse;

      if (spouse) {
        if (member.gender === 'Female' && spouse.gender === 'Male') {
          leftMember = spouse;
          rightMember = member;
        }
      }

      const isSelected = (mId: string) => selectedMemberId === mId;
      const isAnyInCoupleSelected = (leftMember && selectedMemberId === leftMember.id) || (rightMember && selectedMemberId === rightMember.id);
      const isSelf = (m: FamilyMember) => m.relation?.toLowerCase() === 'self';

      return (
        <div key={member.id} className="flex flex-col items-center mb-16 last:mb-0 min-w-max">
          <div 
            ref={isSelf(leftMember) || (rightMember && isSelf(rightMember)) ? selfRef : null}
            className={`p-4 sm:p-6 rounded-[2.5rem] transition-all border-4 relative ${
            isAnyInCoupleSelected ? 'bg-orange-50 border-orange-400 shadow-2xl z-10' : 'bg-white border-orange-100 shadow-lg'
          }`}>
            <div className="flex gap-4 sm:gap-8 items-center">
              {/* Left Card */}
              <div 
                onClick={() => setSelectedMemberId(leftMember.id)}
                className={`w-40 sm:w-52 p-5 rounded-3xl transition-all cursor-pointer flex flex-col items-center text-center ${isSelected(leftMember.id) ? 'bg-orange-800 text-white' : 'hover:bg-orange-50'} ${isSelf(leftMember) ? 'ring-4 ring-orange-500 ring-offset-4' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mb-3 ${
                  leftMember.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                } ${isSelected(leftMember.id) ? 'brightness-125' : ''}`}>
                  <User size={32} />
                </div>
                <h4 className={`font-black text-sm sm:text-base leading-tight mb-1 break-words w-full ${isSelected(leftMember.id) ? 'text-white' : 'text-orange-950'}`}>
                  {leftMember.name}
                </h4>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSelected(leftMember.id) ? 'text-white/70' : 'text-orange-900/40'}`}>
                  {leftMember.relation || (leftMember.gender === 'Male' ? 'Father' : 'Mother')}
                </span>
                {leftMember.isDeceased && <span className="text-[9px] mt-1 font-bold text-red-400 uppercase tracking-widest">In Memory</span>}
              </div>

              {/* Union Heart */}
              {rightMember && (
                <div className="flex items-center justify-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shadow-inner">
                    <Heart size={20} className="text-red-500" fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Right Card */}
              {rightMember ? (
                <div 
                  onClick={() => setSelectedMemberId(rightMember.id)}
                  className={`w-40 sm:w-52 p-5 rounded-3xl transition-all cursor-pointer flex flex-col items-center text-center ${isSelected(rightMember.id) ? 'bg-orange-800 text-white' : 'hover:bg-orange-50'} ${isSelf(rightMember) ? 'ring-4 ring-orange-500 ring-offset-4' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mb-3 ${
                    rightMember.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                  } ${isSelected(rightMember.id) ? 'brightness-125' : ''}`}>
                    <User size={32} />
                  </div>
                  <h4 className={`font-black text-sm sm:text-base leading-tight mb-1 break-words w-full ${isSelected(rightMember.id) ? 'text-white' : 'text-orange-950'}`}>
                    {rightMember.name}
                  </h4>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSelected(rightMember.id) ? 'text-white/70' : 'text-orange-900/40'}`}>
                    {rightMember.relation || (rightMember.gender === 'Female' ? 'Mother' : 'Father')}
                  </span>
                  {rightMember.isDeceased && <span className="text-[9px] mt-1 font-bold text-red-400 uppercase tracking-widest">In Memory</span>}
                </div>
              ) : (
                isSelected(leftMember.id) && (
                  <button 
                    onClick={() => { setAddMode('Spouse'); setIsAdding(true); }}
                    className="w-40 sm:w-52 h-full border-4 border-dashed border-orange-100 rounded-3xl flex flex-col items-center justify-center text-orange-200 hover:bg-orange-50 transition-all p-5"
                  >
                    <Plus size={32} />
                    <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Add Spouse</span>
                  </button>
                )
              )}
            </div>

            {/* Selection Actions Overlay */}
            {isAnyInCoupleSelected && selectedMember && (
              <div className="mt-6 pt-6 border-t-2 border-orange-100 flex items-center justify-between gap-4 animate-slide-up">
                <div className="flex gap-2">
                  <button onClick={() => openEdit(selectedMember)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 shadow-sm"><Edit2 size={24} /></button>
                  <button onClick={() => setShowDeleteDialog(true)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 shadow-sm"><Trash2 size={24} /></button>
                </div>
                <button 
                  onClick={() => { setAddMode('Child'); setIsAdding(true); }}
                  className="bg-orange-950 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform shadow-xl"
                >
                  <Plus size={20} /> Add Child
                </button>
              </div>
            )}
          </div>

          {/* Path to Children */}
          {children.length > 0 && (
            <div className="w-1 h-16 bg-orange-200 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-200"></div>
            </div>
          )}

          {/* Children Branch */}
          {children.length > 0 && (
            <div className="flex gap-12 sm:gap-24 relative pt-4 px-12 border-t-4 border-orange-100 rounded-t-[4rem]">
              {children.map(child => renderCoupleNode(child))}
            </div>
          )}
        </div>
      );
    };

    return roots.map(root => renderCoupleNode(root));
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#FDF7F2]">
      <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm border-b border-orange-50 z-20">
        <div>
          <h1 className="title-font text-3xl text-orange-950 font-black">Lineage Vault</h1>
          <p className="text-orange-900/60 text-[10px] font-bold uppercase tracking-widest">Apli Parampara</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-2xl">
           <Users className="text-orange-950" size={24} />
        </div>
      </header>

      {/* Zoom & Focus Controls */}
      <div className="absolute bottom-24 right-6 z-30 flex flex-col gap-3">
        <button 
          onClick={focusSelf}
          title="Fit to Screen (Focus Self)"
          className="p-4 bg-orange-900 shadow-2xl rounded-2xl text-white border border-orange-800 active:scale-95 transition-transform flex items-center justify-center"
        >
          <Target size={24} />
        </button>
        <button 
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-4 bg-white shadow-xl rounded-2xl text-orange-900 border border-orange-100 active:scale-95 transition-transform"
        >
          <ZoomIn size={24} />
        </button>
        <button 
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-4 bg-white shadow-xl rounded-2xl text-orange-900 border border-orange-100 active:scale-95 transition-transform"
        >
          <ZoomOut size={24} />
        </button>
        <div className="bg-orange-950 text-white text-[10px] font-black px-3 py-1 rounded-full text-center shadow-lg uppercase tracking-widest">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Interactive Tree View */}
      <div ref={containerRef} className="flex-1 overflow-auto p-8 sm:p-20 hide-scrollbar cursor-grab active:cursor-grabbing">
        {lineage.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Users size={64} className="mb-4 text-orange-200" />
            <p className="font-black text-orange-900/50 uppercase tracking-widest">No lineage data available</p>
          </div>
        ) : (
          <div 
            className="inline-block transition-transform duration-300 ease-out origin-top-left"
            style={{ transform: `scale(${zoom})` }}
          >
             {renderGenerations()}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 shadow-2xl border-b-8 border-red-500">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={32} />
            </div>
            <div className="text-center">
              <h2 className="title-font text-2xl text-gray-900 font-bold mb-2">Delete Lineage Node?</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                You are deleting <span className="font-black text-gray-950">{selectedMember?.name}</span>. How would you like to proceed?
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button 
                onClick={() => confirmDelete(true)}
                className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Delete All Descendants
              </button>
              <button 
                onClick={() => confirmDelete(false)}
                className="w-full py-5 bg-orange-50 text-orange-900 rounded-3xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
              >
                Keep Descendants Only
              </button>
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest"
              >
                Cancel Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFBF7] w-full max-w-md rounded-[3rem] p-8 space-y-6 animate-slide-up border-t-8 border-orange-900 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="title-font text-2xl text-orange-950 font-black">
                  {isEditing ? 'Profile Settings' : `Add ${addMode}`}
                </h2>
                {!isEditing && (
                  <p className="text-[10px] text-orange-900/60 font-black uppercase tracking-widest mt-1">Linking to {selectedMember?.name}</p>
                )}
              </div>
              <button 
                onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} 
                className="p-3 bg-orange-50 rounded-2xl text-orange-900 hover:bg-orange-100"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={isEditing ? handleUpdateMember : handleAddMember} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Full Name</label>
                <input 
                  required
                  type="text" 
                  autoFocus
                  className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-900 outline-none font-black text-gray-950 text-lg shadow-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Gender</label>
                  <div className="flex bg-white border-2 border-orange-100 rounded-2xl overflow-hidden shadow-sm p-1">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'Male'})}
                      className={`flex-1 py-3 text-[10px] font-black uppercase transition-all rounded-xl ${formData.gender === 'Male' ? 'bg-orange-900 text-white' : 'text-gray-400'}`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'Female'})}
                      className={`flex-1 py-3 text-[10px] font-black uppercase transition-all rounded-xl ${formData.gender === 'Female' ? 'bg-orange-900 text-white' : 'text-gray-400'}`}
                    >
                      Female
                    </button>
                  </div>
                </div>
                <div>
                   <label className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-2 block">Relation Tag</label>
                   <input 
                    type="text" 
                    placeholder={addMode || selectedMember?.relation}
                    className="w-full bg-white border-2 border-orange-100 rounded-2xl p-4 focus:border-orange-900 outline-none font-bold text-gray-950 text-sm shadow-sm"
                    value={formData.relation}
                    onChange={e => setFormData({...formData, relation: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-3xl border border-orange-100/50">
                <div 
                  onClick={() => setFormData({...formData, isDeceased: !formData.isDeceased})}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${formData.isDeceased ? 'bg-orange-800' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.isDeceased ? 'left-7' : 'left-1'}`} />
                </div>
                <div>
                  <label className="font-black text-orange-950 text-xs uppercase tracking-widest block">In Loving Memory</label>
                  <p className="text-[9px] font-bold text-orange-900/40">Visible heritage marker</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  className="w-full py-6 bg-orange-900 text-white rounded-[2.5rem] font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  {isEditing ? <Save size={20} /> : <UserPlus size={20} />}
                  <span>{isEditing ? 'Sync Profile' : 'Link to Ancestors'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};