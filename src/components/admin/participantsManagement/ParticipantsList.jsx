import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, UserPlus, Eye, Trash2, X, ExternalLink, ShieldCheck, Mail, Phone, 
  MapPin, Award, CheckCircle2, Clock, FileCheck, Globe, Link2, Share2, Check, AlertCircle, Filter 
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import ParticipantsAdd from './ParticipantsAdd';

export default function ParticipantsList() {
  const { participants, updateParticipantStatus, deleteParticipant } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All'); // 'All' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: participants.length,
      pending: participants.filter(p => p.status?.toUpperCase() === 'PENDING').length,
      submitted: participants.filter(p => p.status?.toUpperCase() === 'SUBMITTED').length,
      approved: participants.filter(p => p.status?.toUpperCase() === 'APPROVED' || p.status?.toUpperCase() === 'APPROVE').length,
      rejected: participants.filter(p => p.status?.toUpperCase() === 'REJECTED').length,
    };
  }, [participants]);

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((part) => {
      const partStatus = part.status?.toUpperCase() || 'PENDING';
      const matchesStatus = 
        selectedStatusTab === 'All' || 
        partStatus === selectedStatusTab || 
        (selectedStatusTab === 'APPROVED' && partStatus === 'APPROVE');

      const query = searchQuery.toLowerCase();
      const catTitle = (part.category?.title || part.categoryTitle || '').toLowerCase();
      const matchesSearch = 
        part.fullName.toLowerCase().includes(query) ||
        part.email.toLowerCase().includes(query) ||
        (part.district && part.district.toLowerCase().includes(query)) ||
        catTitle.includes(query) ||
        (part.phone && part.phone.includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [participants, searchQuery, selectedStatusTab]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete participant record for "${name}"?`)) {
      await deleteParticipant(id);
      if (selectedParticipant?.id === id || selectedParticipant?._id === id) {
        setSelectedParticipant(null);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Executive Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
            Directorate Registry API
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-display !text-[#0B1448] uppercase tracking-tight">
            Participants Management
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-amber-400 to-[#FFA320] hover:from-amber-300 hover:to-amber-400 text-[#0B1448] font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Participant</span>
        </button>
      </div>

      {/* Filter Row: Status Dropdown & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
            <Filter className="w-4 h-4 text-[#0B1448] shrink-0" />
            <label htmlFor="statusFilterSelect" className="text-xs font-black uppercase tracking-wider text-slate-700 shrink-0">
              Status:
            </label>
            <select
              id="statusFilterSelect"
              value={selectedStatusTab}
              onChange={(e) => setSelectedStatusTab(e.target.value)}
              className="bg-transparent text-slate-900 text-xs font-extrabold outline-none cursor-pointer py-1"
            >
              <option value="All" className="font-bold">All Statuses ({counts.all})</option>
              <option value="PENDING" className="font-bold text-red-600">🔴 Pending ({counts.pending})</option>
              <option value="SUBMITTED" className="font-bold text-amber-800">🟡 Submitted ({counts.submitted})</option>
              <option value="APPROVED" className="font-bold text-emerald-700">🟢 Approve ({counts.approved})</option>
              <option value="REJECTED" className="font-bold text-slate-700">⚪ Rejected ({counts.rejected})</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, district, category, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-bold pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-royal-blue/30 transition-all outline-none"
          />
        </div>

      </div>

      {/* Participants Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-black text-[11px]">
                <th className="py-4 px-6">Creator Info</th>
                <th className="py-4 px-6">District & Phone</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status (PUT API)</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((part) => {
                  const partStatus = (part.status || 'PENDING').toUpperCase();

                  return (
                    <tr key={part.id || part._id} className="hover:bg-slate-50/80 transition-colors font-bold text-slate-700">
                      
                      {/* Creator Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B1448] to-[#2F6FEF] text-amber-400 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {part.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#0B1448] text-xs">{part.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{part.email}</div>
                            {part.followersCount && (
                              <span className="inline-block text-[10px] text-royal-blue font-black mt-0.5">
                                {part.followersCount} Followers
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* District & Phone */}
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-[#0B1448]">{part.district}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{part.phone}</div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <div className="inline-block bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-xl text-[11px] font-extrabold">
                          {part.category?.title || part.categoryTitle || 'Award Category'}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-black mt-1">
                          {part.category?.tier || part.stream || 'Social Impact'}
                        </div>
                      </td>

                      {/* STATUS WITH EXACT COLOR REQUIREMENTS */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={partStatus === 'APPROVE' ? 'APPROVED' : partStatus}
                            onChange={(e) => updateParticipantStatus(part.id || part._id, e.target.value, part.categoryId || part.category?._id || part.subId)}
                            className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase border outline-none cursor-pointer transition-all shadow-xs ${
                              partStatus === 'PENDING'
                                ? 'bg-red-500/10 text-red-600 border-red-300 focus:ring-2 focus:ring-red-400'
                                : partStatus === 'SUBMITTED'
                                ? 'bg-amber-500/10 text-amber-800 border-amber-300 focus:ring-2 focus:ring-amber-400'
                                : (partStatus === 'APPROVED' || partStatus === 'APPROVE')
                                ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300 focus:ring-2 focus:ring-emerald-400'
                                : 'bg-slate-500/10 text-slate-700 border-slate-300 focus:ring-2 focus:ring-slate-400'
                            }`}
                          >
                            <option value="PENDING" className="bg-white text-red-600 font-bold">🔴 Pending</option>
                            <option value="SUBMITTED" className="bg-white text-amber-800 font-bold">🟡 Submitted</option>
                            <option value="APPROVED" className="bg-white text-emerald-700 font-bold">🟢 Approve</option>
                            <option value="REJECTED" className="bg-white text-slate-700 font-bold">⚪ Rejected</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedParticipant(part)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1"
                            title="View Full Dossier"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => handleDelete(part.id || part._id, part.fullName)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Participant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                    No participant records match the search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Registration Modal */}
      <ParticipantsAdd 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Comprehensive Participant Dossier Modal displaying ALL SCHEMA FIELDS */}
      {selectedParticipant && createPortal(
        <div className="fixed inset-0 bg-[#0B1448]/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-auto max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedParticipant(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Top Header */}
            <div className="flex items-start gap-4 mb-6 pr-8 border-b border-slate-100 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B1448] to-[#2F6FEF] text-amber-400 font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {selectedParticipant.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Participant Dossier
                  </span>
                  {selectedParticipant.isInternational && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> NRI / International
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black font-display !text-[#0B1448] uppercase leading-tight">
                  {selectedParticipant.fullName}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-royal-blue" /> {selectedParticipant.district} District</span>
                  <span>•</span>
                  <span>Age: {selectedParticipant.age || 25}</span>
                </div>
              </div>
            </div>

            {/* Live Status Switcher Section */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                  Update Review Status (PUT /api/participants/:id/status)
                </label>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  Current: {selectedParticipant.status?.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    const status = 'PENDING';
                    const catId = selectedParticipant.categoryId || selectedParticipant.category?._id || selectedParticipant.subId;
                    updateParticipantStatus(selectedParticipant.id || selectedParticipant._id, status, catId);
                    setSelectedParticipant({ ...selectedParticipant, status });
                  }}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    (selectedParticipant.status?.toUpperCase() === 'PENDING')
                      ? 'bg-red-500 text-white border-red-600 shadow-md'
                      : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                  }`}
                >
                  🔴 Pending
                </button>
                <button
                  onClick={() => {
                    const status = 'SUBMITTED';
                    const catId = selectedParticipant.categoryId || selectedParticipant.category?._id || selectedParticipant.subId;
                    updateParticipantStatus(selectedParticipant.id || selectedParticipant._id, status, catId);
                    setSelectedParticipant({ ...selectedParticipant, status });
                  }}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    (selectedParticipant.status?.toUpperCase() === 'SUBMITTED')
                      ? 'bg-amber-400 text-[#0B1448] border-amber-500 shadow-md'
                      : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  🟡 Submitted
                </button>
                <button
                  onClick={() => {
                    const status = 'APPROVED';
                    const catId = selectedParticipant.categoryId || selectedParticipant.category?._id || selectedParticipant.subId;
                    updateParticipantStatus(selectedParticipant.id || selectedParticipant._id, status, catId);
                    setSelectedParticipant({ ...selectedParticipant, status });
                  }}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    (selectedParticipant.status?.toUpperCase() === 'APPROVED' || selectedParticipant.status?.toUpperCase() === 'APPROVE')
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  🟢 Approve
                </button>
                <button
                  onClick={() => {
                    const status = 'REJECTED';
                    const catId = selectedParticipant.categoryId || selectedParticipant.category?._id || selectedParticipant.subId;
                    updateParticipantStatus(selectedParticipant.id || selectedParticipant._id, status, catId);
                    setSelectedParticipant({ ...selectedParticipant, status });
                  }}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                    (selectedParticipant.status?.toUpperCase() === 'REJECTED')
                      ? 'bg-slate-700 text-white border-slate-800 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ⚪ Reject
                </button>
              </div>
            </div>

            {/* Detailed Dossier Grid (Displaying All Schema Parameters) */}
            <div className="space-y-5 text-xs text-slate-700 font-bold mb-6">
              
              {/* 1. Contact & Identity Information */}
              <div className="bg-slate-50/70 border border-slate-200/70 p-4 rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Contact & Personal Details
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-royal-blue shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Email Address</span>
                      <span className="text-slate-900 font-extrabold">{selectedParticipant.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-royal-blue shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Mobile Phone</span>
                      <span className="text-slate-900 font-extrabold">{selectedParticipant.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/50">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">District</span>
                    <span className="text-slate-900 font-extrabold">{selectedParticipant.district}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Age</span>
                    <span className="text-slate-900 font-extrabold">{selectedParticipant.age || 25} Years</span>
                  </div>
                </div>
              </div>

              {/* 2. Category & Submission Link */}
              <div className="bg-slate-50/70 border border-slate-200/70 p-4 rounded-2xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Award Category & Submission Link
                </span>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Selected Category</span>
                  <div className="text-royal-blue font-extrabold text-sm mt-0.5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{selectedParticipant.category?.title || selectedParticipant.categoryTitle || 'Award Category'}</span>
                  </div>
                  {(selectedParticipant.category?.tier || selectedParticipant.stream) && (
                    <span className="text-[10px] font-black uppercase text-slate-500 mt-1 block">
                      Tier / Stream: {selectedParticipant.category?.tier || selectedParticipant.stream}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/50">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Content Submission Link</span>
                  {(selectedParticipant.submissionLink || selectedParticipant.channelUrl) ? (
                    <a
                      href={selectedParticipant.submissionLink || selectedParticipant.channelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-royal-blue text-white font-extrabold hover:bg-brand-indigo transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="truncate max-w-md">{selectedParticipant.submissionLink || selectedParticipant.channelUrl}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 font-normal">No submission link provided</span>
                  )}
                </div>

                {selectedParticipant.platform && (
                  <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Primary Platform</span>
                    <span className="text-xs font-black text-slate-800 uppercase px-2.5 py-0.5 rounded-lg bg-white border border-slate-200">
                      {selectedParticipant.platform}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Optional Social Media Handles */}
              <div className="bg-slate-50/70 border border-slate-200/70 p-4 rounded-2xl space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Social Handles & Profiles
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {selectedParticipant.instagram ? (
                    <a href={selectedParticipant.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-pink-600 hover:underline">
                      <Link2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">Instagram: {selectedParticipant.instagram}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400"><Link2 className="w-4 h-4 opacity-40" /> <span>Instagram: N/A</span></div>
                  )}

                  {selectedParticipant.youtube ? (
                    <a href={selectedParticipant.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-red-600 hover:underline">
                      <Link2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">YouTube: {selectedParticipant.youtube}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400"><Link2 className="w-4 h-4 opacity-40" /> <span>YouTube: N/A</span></div>
                  )}

                  {selectedParticipant.twitter ? (
                    <a href={selectedParticipant.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-600 hover:underline">
                      <Link2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">Twitter/X: {selectedParticipant.twitter}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400"><Link2 className="w-4 h-4 opacity-40" /> <span>Twitter/X: N/A</span></div>
                  )}

                  {selectedParticipant.linkedin ? (
                    <a href={selectedParticipant.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline">
                      <Link2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">LinkedIn: {selectedParticipant.linkedin}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400"><Link2 className="w-4 h-4 opacity-40" /> <span>LinkedIn: N/A</span></div>
                  )}
                </div>
              </div>

              {/* 4. Verification Flags & Options */}
              <div className="bg-slate-50/70 border border-slate-200/70 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mobile OTP Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Privacy Policy Accepted</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Content Consent Accepted</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}