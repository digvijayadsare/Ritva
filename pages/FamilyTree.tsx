
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { ChevronRight, Plus, User, Trash2, Edit2, X, Heart, Users, ChevronDown, Save, UserMinus, UserPlus } from 'lucide-react';
import { FamilyMember } from '../types';

export const FamilyTree: React.FC = () => {
  const { family, addFamilyMember, updateFamilyMember, deleteFamilyMember } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addMode, setAddMode] = useState<'Child' | 'Spouse'>('Child');

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
      // Link the existing member to this new spouse
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

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this family member? This will also remove their connections.")) {
      deleteFamilyMember(id);
      setSelectedMemberId(null);
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

  // Build Hierarchy
  const renderGenerations = () => {
    // REFINED ROOT LOGIC to prevent duplicates
    // A root is someone who:
    // 1. Has no parentId
    // 2. AND if they have a spouse, that spouse ALSO has no parentId (otherwise they'd be rendered as an in-law elsewhere)
    // 3. AND apply a tie-breaker so only one member of a root couple starts the render (Male or lower ID)
    const roots = lineage.filter(m => {
      const hasParent = !!m.parentId;
      if (hasParent) return false;

      const spouse = lineage.find(s => s.id === m.spouseId);
      // If spouse has a parent, this person is an in-law and will be rendered under the spouse's bloodline
      if (spouse && spouse.parentId) return false;

      // Both have no parent (or no spouse): apply tie-breaker
      if (spouse) {
        if (m.gender === 'Male' && spouse.gender !== 'Male') return true;
        if (m.gender === 'Female' && spouse.gender === 'Male') return false;
        return m.id < spouse.id; // Final tie-breaker for same-gender couples or missing gender
      }
      
      return true;
    });
    
    const renderCoupleNode = (member: FamilyMember) => {
      const spouse = lineage.find(m => m.id === member.spouseId);
      const children = lineage.filter(m => m.parentId === member.id || (spouse && m.parentId === spouse.id));
      
      // Ensure Male is always Left and Female is Right for visual consistency
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

      return (
        <div key={member.id} className="mb-12 last:mb-0">
          {/* Couple Card - Using better padding and flex-wrap to handle long names */}
          <div className={`p-4 sm:p-6 rounded-[2.5rem] transition-all border-2 ${
            isAnyInCoupleSelected ? 'bg-orange-50 border-orange-300 shadow-xl' : 'bg-white border-orange-100 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
              {/* Left Member */}
              <div 
                onClick={() => setSelectedMemberId(leftMember.id)}
                className={`flex-1 w-full min-w-0 flex items-start gap-4 p-4 rounded-3xl transition-all cursor-pointer ${isSelected(leftMember.id) ? 'bg-orange-800 text-white' : 'bg-white hover:bg-orange-50'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  leftMember.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                } ${isSelected(leftMember.id) ? 'brightness-125 shadow-inner' : 'shadow-sm'}`}>
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-black text-sm leading-tight mb-1 break-words hyphens-auto ${isSelected(leftMember.id) ? 'text-white' : 'text-orange-950'}`}>
                    {leftMember.name}
                  </h4>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected(leftMember.id) ? 'text-white/70' : 'text-orange-900/40'}`}>
                    {leftMember.relation || 'Ancestor'} {leftMember.isDeceased && '• Late'}
                  </p>
                </div>
              </div>

              {/* Union Marker */}
              {rightMember && (
                <div className="flex items-center justify-center shrink-0 py-2 sm:py-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Heart size={16} className="text-red-500" fill="currentColor" />
                  </div>
                </div>
              )}

              {/* Right Member */}
              {rightMember ? (
                <div 
                  onClick={() => setSelectedMemberId(rightMember.id)}
                  className={`flex-1 w-full min-w-0 flex items-start gap-4 p-4 rounded-3xl transition-all cursor-pointer ${isSelected(rightMember.id) ? 'bg-orange-800 text-white' : 'bg-white hover:bg-orange-50'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    rightMember.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                  } ${isSelected(rightMember.id) ? 'brightness-125 shadow-inner' : 'shadow-sm'}`}>
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-black text-sm leading-tight mb-1 break-words hyphens-auto ${isSelected(rightMember.id) ? 'text-white' : 'text-orange-950'}`}>
                      {rightMember.name}
                    </h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected(rightMember.id) ? 'text-white/70' : 'text-orange-900/40'}`}>
                      {rightMember.relation || 'Spouse'} {rightMember.isDeceased && '• Late'}
                    </p>
                  </div>
                </div>
              ) : (
                // "Add Spouse" Placeholder
                isSelected(leftMember.id) && (
                  <button 
                    onClick={() => { setAddMode('Spouse'); setIsAdding(true); }}
                    className="flex-1 w-full border-2 border-dashed border-orange-200 rounded-3xl flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors p-4"
                  >
                    <Plus size={20} />
                    <span className="text-[10px] font-black uppercase ml-2 tracking-widest">Add Spouse</span>
                  </button>
                )
              )}
            </div>

            {/* Quick Actions Footer */}
            {isAnyInCoupleSelected && selectedMember && (
              <div className="mt-6 pt-6 border-t border-orange-100 flex flex-wrap items-center justify-between gap-4 animate-slide-up">
                <div className="flex gap-3">
                  <button 
                    onClick={() => openEdit(selectedMember)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedMember.id)}
                    className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <button 
                  onClick={() => { setAddMode('Child'); setIsAdding(true); }}
                  className="bg-orange-950 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-transform shadow-lg"
                >
                  <Plus size={16} /> Add Descendant
                </button>
              </div>
            )}
          </div>

          {/* Recursive Child Branch */}
          {children.length > 0 && (
            <div className="ml-6 sm:ml-12 mt-8 border-l-4 border-orange-100 pl-6 sm:pl-10 space-y-8 relative">
              {children.map(child => renderCoupleNode(child))}
            </div>
          )}
        </div>
      );
    };

    return roots.map(root => renderCoupleNode(root));
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="py-2 flex justify-between items-center">
        <div>
          <h1 className="title-font text-3xl text-orange-950 font-black">Family Tree</h1>
          <p className="text-orange-900/60 text-[10px] font-bold uppercase tracking-widest">Ancestral Lineage</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-100">
           <Users className="text-orange-900" size={24} />
        </div>
      </header>

      <div className="bg-orange-50 p-6 rounded-[2rem] border-2 border-orange-100/50 flex gap-4 items-center">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
          <Heart size={24} className="text-red-500" fill="currentColor" />
        </div>
        <div className="flex-1">
          <p className="text-orange-950 text-[11px] font-black uppercase tracking-wider mb-1">Navigation Tip</p>
          <p className="text-orange-900/70 text-[11px] font-bold leading-relaxed">
            Tap a name to edit or add family members. Deleting a member removes them from the vault permanently.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {lineage.length === 0 ? (
          <div className="text-center py-24 px-8 bg-white rounded-[3rem] border-2 border-dashed border-orange-100">
            <User size={48} className="mx-auto text-orange-100 mb-6" />
            <p className="font-bold text-gray-400 max-w-[200px] mx-auto leading-relaxed">
              Lineage vault is currently empty.
            </p>
          </div>
        ) : (
          <div className="animate-slide-up">
            {renderGenerations()}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFBF7] w-full max-w-md rounded-[3rem] p-8 space-y-6 animate-slide-up border-t-8 border-orange-900 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="title-font text-2xl text-orange-950 font-black">
                  {isEditing ? 'Update Profile' : `Add ${addMode}`}
                </h2>
                {!isEditing && (
                  <p className="text-[10px] text-orange-900/60 font-black uppercase tracking-widest mt-1">Connecting to {selectedMember?.name}</p>
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
                  <p className="text-[9px] font-bold text-orange-900/40">Toggle if deceased (Legacy marker)</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  className="w-full py-6 bg-orange-900 text-white rounded-[2.5rem] font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  {isEditing ? <Save size={20} /> : <UserPlus size={20} />}
                  <span>{isEditing ? 'Save Changes' : `Add to ${family?.name}`}</span>
                </button>
                
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => handleDelete(selectedMemberId!)}
                    className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    <UserMinus size={14} /> Remove Permanently
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
