import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function ParticipantsAdd({ isOpen, onClose }) {
  const { categories, addParticipant } = useAdmin();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: 'Raipur',
    categorySlug: categories[0]?.slug || '',
    channelUrl: '',
    followersCount: '',
    bio: '',
    status: 'SUBMITTED' // 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCat = categories.find(c => c.slug === formData.categorySlug) || categories[0];
    
    addParticipant({
      ...formData,
      status: formData.status.toUpperCase(),
      categoryTitle: selectedCat ? selectedCat.title : 'General Category',
      stream: selectedCat ? selectedCat.stream : 'Creative Arts'
    });

    onClose();
  };

  const chhattisgarhDistricts = [
    "Raipur", "Bastar", "Bilaspur", "Durg", "Bhilai", "Rajnandgaon", 
    "Surguja", "Korba", "Raigarh", "Dhamtari", "Kanker", "Kondagaon",
    "Jashpur", "Kabirdham", "Mahasamund", "Janjgir-Champa", "Balod", "Bemetara"
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto font-sans">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
            Manual Registration
          </span>
          <h2 className="text-xl font-black font-display text-[#0B1448] uppercase">
            Add New Participant
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
          
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-extrabold uppercase text-slate-600">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Ramesh Sahu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
              />
            </div>
            <div>
              <label className="block mb-1 font-extrabold uppercase text-slate-600">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
              />
            </div>
          </div>

          {/* Phone & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-extrabold uppercase text-slate-600">Mobile Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98270 00000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
              />
            </div>
            <div>
              <label className="block mb-1 font-extrabold uppercase text-slate-600">District *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
              >
                {chhattisgarhDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-extrabold uppercase text-slate-600">Award Category *</label>
            <select
              value={formData.categorySlug}
              onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
            >
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.title} ({c.stream})</option>
              ))}
            </select>
          </div>

          {/* Channel URL & Followers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-extrabold uppercase text-slate-600">Channel / Profile URL</label>
              <input
                type="url"
                value={formData.channelUrl}
                onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                placeholder="https://youtube.com/@channel"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
              />
            </div>
            <div>
              <label className="block mb-1 font-extrabold uppercase text-slate-600">Followers Count</label>
              <input
                type="text"
                value={formData.followersCount}
                onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                placeholder="e.g. 50K"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
              />
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block mb-1 font-extrabold uppercase text-slate-600">Initial Review Status</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'PENDING' })}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                  formData.status === 'PENDING'
                    ? 'bg-red-500 text-white border-red-600 shadow-md'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                🔴 Pending
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'SUBMITTED' })}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                  formData.status === 'SUBMITTED'
                    ? 'bg-amber-400 text-[#0B1448] border-amber-500 shadow-md'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                🟡 Submitted
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'APPROVED' })}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                  formData.status === 'APPROVED'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                🟢 Approve
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'REJECTED' })}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                  formData.status === 'REJECTED'
                    ? 'bg-slate-700 text-white border-slate-800 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                ⚪ Reject
              </button>
            </div>
          </div>

          {/* Creator Bio */}
          <div>
            <label className="block mb-1 font-extrabold uppercase text-slate-600">Bio & Achievements Summary</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of creator content..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold py-3.5 rounded-xl uppercase tracking-wider shadow-md cursor-pointer"
            >
              Add Participant
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
