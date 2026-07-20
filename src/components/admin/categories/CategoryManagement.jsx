import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, Award, Image as ImageIcon, Link2, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Form State matching backend Mongoose Schema
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    tier: 'A_CULTURE_IDENTITY',
    prizeTier: 'FLAGSHIP',
    taskBrief: '',
    hashtag: 'cgcreatorawards',
    cashPrizeMin: 51000,
    cashPrizeMax: 75000,
    image: '',
    isActive: true
  });

  const tierOptions = [
    { label: 'All Tiers', value: 'All' },
    { label: 'Culture & Identity (Tier A)', value: 'A_CULTURE_IDENTITY' },
    { label: 'Nation & State Building (Tier B)', value: 'B_NATION_STATE_BUILDING' },
    { label: 'Craft & Platform (Tier C)', value: 'C_CRAFT_PLATFORM' }
  ];

  const prizeTierOptions = [
    'FLAGSHIP', 'MARQUEE', 'STANDARD', 'EMERGING_NANO', 'NRI'
  ];

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesTier = selectedTierFilter === 'All' || cat.tier === selectedTierFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        cat.title.toLowerCase().includes(query) ||
        (cat.shortDescription && cat.shortDescription.toLowerCase().includes(query)) ||
        (cat.hashtag && cat.hashtag.toLowerCase().includes(query));

      return matchesTier && matchesSearch;
    });
  }, [categories, searchQuery, selectedTierFilter]);

  // Open add modal
  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      shortDescription: '',
      tier: 'A_CULTURE_IDENTITY',
      prizeTier: 'FLAGSHIP',
      taskBrief: 'Showcase your creative impact in Chhattisgarh.',
      hashtag: 'cgcreatorawards',
      cashPrizeMin: 51000,
      cashPrizeMax: 75000,
      image: '',
      isActive: true
    });
    setImageFile(null);
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (cat) => {
    setFormData({
      title: cat.title,
      shortDescription: cat.shortDescription || cat.description || '',
      tier: cat.tier || 'A_CULTURE_IDENTITY',
      prizeTier: cat.prizeTier || 'FLAGSHIP',
      taskBrief: cat.taskBrief || '',
      hashtag: cat.hashtag || 'cgcreatorawards',
      cashPrizeMin: cat.cashPrizeMin || 51000,
      cashPrizeMax: cat.cashPrizeMax || 75000,
      image: cat.image || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setImageFile(null);
    setEditingCategory(cat);
    setIsAddModalOpen(true);
  };

  // Submit form (supports FormData if file attached or JSON)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append('title', formData.title);
      payload.append('shortDescription', formData.shortDescription);
      payload.append('tier', formData.tier);
      payload.append('prizeTier', formData.prizeTier);
      payload.append('taskBrief', formData.taskBrief);
      payload.append('hashtag', formData.hashtag);
      payload.append('cashPrizeMin', formData.cashPrizeMin);
      payload.append('cashPrizeMax', formData.cashPrizeMax);
      payload.append('isActive', formData.isActive);
      payload.append('image', imageFile);
    } else {
      payload = { ...formData };
    }

    if (editingCategory) {
      await updateCategory(editingCategory._id || editingCategory.slug, payload);
    } else {
      await addCategory(payload);
    }

    setIsAddModalOpen(false);
  };

  // Delete handler
  const handleDelete = async (idOrSlug, title) => {
    if (window.confirm(`Are you sure you want to delete category "${title}"?`)) {
      await deleteCategory(idOrSlug);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
            Directorate Schema API
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-display !text-[#0B1448] uppercase tracking-tight">
            Award Category Management
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-amber-400 to-[#FFA320] hover:from-amber-300 hover:to-amber-400 text-[#0B1448] font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search & Tier Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Tier Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
            <Filter className="w-4 h-4 text-[#0B1448] shrink-0" />
            <label htmlFor="tierFilterSelect" className="text-xs font-black uppercase tracking-wider text-slate-700 shrink-0">
              Tier:
            </label>
            <select
              id="tierFilterSelect"
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="bg-transparent text-slate-900 text-xs font-extrabold outline-none cursor-pointer py-1"
            >
              {tierOptions.map((item) => (
                <option key={item.value} value={item.value} className="font-bold">
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-bold pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-royal-blue/30 transition-all outline-none"
          />
        </div>

      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          return (
            <div 
              key={cat._id || cat.slug}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* Image or Icon Banner */}
                <div className="relative h-36 -mx-6 -mt-6 mb-4 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  {cat.image ? (
                    <img 
                      src={cat.image.startsWith('http') ? cat.image : `http://localhost:5000${cat.image.startsWith('/') ? '' : '/'}${cat.image}`} 
                      alt={cat.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#0B1448] to-[#1E2B7B] flex items-center justify-center text-amber-400">
                      <Award className="w-10 h-10" />
                    </div>
                  )}

                  {/* Tier Pill Badge */}
                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-400 border border-white/20 backdrop-blur-xs">
                    {cat.tier || 'A_CULTURE_IDENTITY'}
                  </span>
                </div>

                {/* Title & Short Description */}
                <h3 className="text-base font-black font-display !text-[#0B1448] uppercase mb-2 leading-snug">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                  {cat.shortDescription || cat.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat._id || cat.slug, cat.title)}
                  className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal (Fully matching Backend Model) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto font-sans">
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
                Backend Mongoose Schema
              </span>
              <h2 className="text-xl font-black font-display !text-[#0B1448] uppercase">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-700">
              
              {/* Category Title */}
              <div>
                <label className="block mb-1 font-extrabold uppercase text-slate-600">Category Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Best Storyteller Award"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block mb-1 font-extrabold uppercase text-slate-600">Short Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Provide short description for creators..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue resize-none"
                />
              </div>

              {/* Tier & Prize Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-extrabold uppercase text-slate-600">Tier Enum *</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                  >
                    <option value="A_CULTURE_IDENTITY">A_CULTURE_IDENTITY</option>
                    <option value="B_NATION_STATE_BUILDING">B_NATION_STATE_BUILDING</option>
                    <option value="C_CRAFT_PLATFORM">C_CRAFT_PLATFORM</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold uppercase text-slate-600">Prize Tier Enum *</label>
                  <select
                    value={formData.prizeTier}
                    onChange={(e) => setFormData({ ...formData, prizeTier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                  >
                    {prizeTierOptions.map(pt => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Brief & Hashtag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-extrabold uppercase text-slate-600">Task Brief</label>
                  <input
                    type="text"
                    value={formData.taskBrief}
                    onChange={(e) => setFormData({ ...formData, taskBrief: e.target.value })}
                    placeholder="Showcase your impact in Chhattisgarh..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-extrabold uppercase text-slate-600">Campaign Hashtag</label>
                  <input
                    type="text"
                    value={formData.hashtag}
                    onChange={(e) => setFormData({ ...formData, hashtag: e.target.value })}
                    placeholder="cgcreatorawards"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                  />
                </div>
              </div>

              {/* Cash Prize Min & Max */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-extrabold uppercase text-slate-600">Cash Prize Min (₹)</label>
                  <input
                    type="number"
                    value={formData.cashPrizeMin}
                    onChange={(e) => setFormData({ ...formData, cashPrizeMin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-extrabold uppercase text-slate-600">Cash Prize Max (₹)</label>
                  <input
                    type="number"
                    value={formData.cashPrizeMax}
                    onChange={(e) => setFormData({ ...formData, cashPrizeMax: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-royal-blue"
                  />
                </div>
              </div>

              {/* Image Upload File or Direct Image URL */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="block font-extrabold uppercase text-slate-600">Category Cover Image</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold mb-1">Option 1: Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold mb-1">Option 2: Direct Image URL</span>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-royal-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold py-3.5 rounded-xl uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
