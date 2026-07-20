import React, { createContext, useState, useEffect, useContext } from 'react';
import { categoriesData } from '../components/home/categoriesData';
import { fetchCategoriesAPI } from '../services/categories';
import { 
  adminLoginAPI, 
  createCategoryAPI, 
  updateCategoryAPI, 
  deleteCategoryAPI,
  fetchAdminParticipantsAPI,
  updateParticipantStatusAPI,
  deleteParticipantAdminAPI
} from '../services/admin';

const AdminContext = createContext(null);

const INITIAL_PARTICIPANTS = [
  {
    id: "part-101",
    fullName: "Rakesh Verma",
    email: "rakesh.verma@gmail.com",
    phone: "+91 98271 23456",
    district: "Bastar",
    categorySlug: "bastar-tribal-heritage-storyteller",
    categoryTitle: "Bastar Tribal Heritage Storyteller",
    stream: "Creative Arts",
    channelUrl: "https://youtube.com/@rakeshvermavlogs",
    followersCount: "145K",
    bio: "Documenting tribal life, Dhokra craft, and indigenous songs across Jagdalpur and Kondagaon.",
    status: "SUBMITTED",
    submittedAt: "2026-07-15T10:30:00Z"
  },
  {
    id: "part-102",
    fullName: "Sunita Sahu",
    email: "sunita.recipes@gmail.com",
    phone: "+91 94255 67890",
    district: "Raipur",
    categorySlug: "cg-cuisine-creator",
    categoryTitle: "CG Cuisine Creator",
    stream: "Niche",
    channelUrl: "https://instagram.com/sunitaskitchen_cg",
    followersCount: "89K",
    bio: "Showcasing traditional Chhattisgarhi delicacies like Chhela, Fara, and Dubki Kadi.",
    status: "APPROVED",
    submittedAt: "2026-07-14T14:20:00Z"
  },
  {
    id: "part-103",
    fullName: "Amit Patel",
    email: "amit.tech.cg@gmail.com",
    phone: "+91 91790 11223",
    district: "Bhilai",
    categorySlug: "best-tech-ai-creator",
    categoryTitle: "Best Tech & AI Creator",
    stream: "Tech & Growth",
    channelUrl: "https://youtube.com/@techinhinglish",
    followersCount: "320K",
    bio: "Making AI tutorials, smartphone reviews, and coding tips accessible in Hindi.",
    status: "PENDING",
    submittedAt: "2026-07-18T09:15:00Z"
  },
  {
    id: "part-104",
    fullName: "Priya Sharma",
    email: "priya.designs@gmail.com",
    phone: "+91 99812 44556",
    district: "Bilaspur",
    categorySlug: "handloom-craft-champion",
    categoryTitle: "Handloom & Craft Champion",
    stream: "Creative Arts",
    channelUrl: "https://instagram.com/priyahandlooms",
    followersCount: "64K",
    bio: "Promoting Kosa silk, Champa handlooms, and fusion saree styling.",
    status: "APPROVED",
    submittedAt: "2026-07-12T16:45:00Z"
  },
  {
    id: "part-105",
    fullName: "Rahul Gupta",
    email: "rahul.comedy@gmail.com",
    phone: "+91 97520 88990",
    district: "Durg",
    categorySlug: "best-comedy-creator",
    categoryTitle: "Best Comedy Creator",
    stream: "Entertainment",
    channelUrl: "https://youtube.com/@rahulcgcomedy",
    followersCount: "510K",
    bio: "Creator of family-friendly Chhattisgarhi comedy sketches and relational reels.",
    status: "PENDING",
    submittedAt: "2026-07-19T11:00:00Z"
  },
  {
    id: "part-106",
    fullName: "Kavita Soni",
    email: "kavita.green@gmail.com",
    phone: "+91 93001 77665",
    district: "Surguja",
    categorySlug: "green-champion",
    categoryTitle: "Green Champion",
    stream: "Social Impact",
    channelUrl: "https://instagram.com/eco_surguja",
    followersCount: "28K",
    bio: "Tree plantation drives, plastic-free campaigns, and Hasdeo forest protection advocacy.",
    status: "SUBMITTED",
    submittedAt: "2026-07-16T13:10:00Z"
  }
];

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem("admin_user");
    return saved ? JSON.parse(saved) : { name: "Directorate Admin", email: "admin@stateawards.gov.in", role: "SUPER_ADMIN" };
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return !!localStorage.getItem("admin_token");
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("admin_categories");
    if (saved) return JSON.parse(saved);
    return categoriesData.map(c => ({
      _id: `cat-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: c.title,
      shortDescription: c.description || "",
      tier: c.stream === "Creative Arts" ? "A_CULTURE_IDENTITY" : c.stream === "Social Impact" ? "B_NATION_STATE_BUILDING" : "C_CRAFT_PLATFORM",
      stream: c.stream || "Creative Arts",
      taskBrief: "Showcase your creator impact in Chhattisgarh.",
      hashtag: "cgcreatorawards",
      prizeTier: "FLAGSHIP",
      cashPrizeMin: 51000,
      cashPrizeMax: 75000,
      image: null,
      isActive: true
    }));
  });

  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem("admin_participants");
    return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
  });

  // Fetch categories from backend API on mount
  useEffect(() => {
    async function loadBackendCategories() {
      const res = await fetchCategoriesAPI();
      if (res && res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map(item => {
          let streamTag = "Craft & Platform";
          if (item.tier === "A_CULTURE_IDENTITY") streamTag = "Creative Arts";
          else if (item.tier === "B_NATION_STATE_BUILDING") streamTag = "Social Impact";

          return {
            _id: item._id || item.id || item.slug,
            slug: item.slug,
            title: item.title,
            shortDescription: item.shortDescription || item.description || "",
            tier: item.tier || "A_CULTURE_IDENTITY",
            stream: streamTag,
            taskBrief: item.taskBrief || "",
            hashtag: item.hashtag || "cgcreatorawards",
            prizeTier: item.prizeTier || "FLAGSHIP",
            cashPrizeMin: item.cashPrizeMin || 0,
            cashPrizeMax: item.cashPrizeMax || 0,
            image: item.image || null,
            isActive: item.isActive !== undefined ? item.isActive : true
          };
        });
        setCategories(mapped);
      }
    }
    loadBackendCategories();
  }, []);

  // Fetch participants from backend API when admin is authenticated
  useEffect(() => {
    async function loadBackendParticipants() {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await fetchAdminParticipantsAPI(token);
      if (res && res.success && res.participants && res.participants.length > 0) {
        const mappedList = [];
        res.participants.forEach(p => {
          if (p.categorySubmissions && Array.isArray(p.categorySubmissions) && p.categorySubmissions.length > 0) {
            p.categorySubmissions.forEach(sub => {
              // Resolve category details
              let catInfo = null;
              if (sub.category && typeof sub.category === 'object') {
                catInfo = sub.category;
              } else if (sub.category) {
                const subCatId = String(sub.category);
                // Look up in categories list first
                catInfo = categories.find(c => c._id === subCatId || c.slug === subCatId);
                if (!catInfo) {
                  // Fallback match from categoriesData
                  const matchedLocal = categoriesData.find(c => {
                    const generatedId = `cat-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return generatedId === subCatId || slug === subCatId || c._id === subCatId;
                  });
                  if (matchedLocal) {
                    let streamTag = "Creative Arts";
                    if (matchedLocal.stream === "Social Impact") streamTag = "Social Impact";
                    else if (matchedLocal.stream === "Craft & Platform") streamTag = "Craft & Platform";
                    catInfo = {
                      _id: subCatId,
                      title: matchedLocal.title,
                      slug: matchedLocal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      tier: matchedLocal.stream === "Creative Arts" ? "A_CULTURE_IDENTITY" : matchedLocal.stream === "Social Impact" ? "B_NATION_STATE_BUILDING" : "C_CRAFT_PLATFORM",
                      stream: streamTag
                    };
                  }
                }
              }

              const categoryTitle = catInfo?.title || sub.categoryTitle || p.categoryTitle || "Award Category";
              const categorySlug = catInfo?.slug || sub.categorySlug || "";
              const categoryTier = catInfo?.tier || "";
              let streamTag = "Creative Arts";
              if (categoryTier === "B_NATION_STATE_BUILDING") streamTag = "Social Impact";
              else if (categoryTier === "C_CRAFT_PLATFORM") streamTag = "Craft & Platform";
              else if (catInfo?.stream) streamTag = catInfo.stream;

              mappedList.push({
                id: p._id || p.id,
                _id: p._id || p.id,
                subId: sub._id,
                categoryId: catInfo?._id || sub.category,
                fullName: p.fullName,
                email: p.email,
                phone: p.phone,
                district: p.district,
                age: p.age,
                platform: p.platform,
                submissionLink: sub.submissionLink || p.submissionLink || "",
                instagram: p.instagram || "",
                youtube: p.youtube || "",
                twitter: p.twitter || "",
                linkedin: p.linkedin || "",
                isInternational: p.isInternational || false,
                category: catInfo || sub.category,
                categoryTitle,
                categorySlug,
                stream: streamTag,
                channelUrl: sub.submissionLink || p.submissionLink || "",
                bio: `Platform: ${p.platform || 'Digital'} | Submission Link: ${sub.submissionLink || 'None'}`,
                status: (sub.status || p.status || 'PENDING').toUpperCase(),
                submittedAt: sub.submittedAt || p.createdAt || new Date().toISOString()
              });
            });
          } else {
            mappedList.push({
              id: p._id || p.id,
              _id: p._id || p.id,
              fullName: p.fullName,
              email: p.email,
              phone: p.phone,
              district: p.district,
              age: p.age,
              platform: p.platform,
              submissionLink: p.submissionLink || p.channelUrl || "",
              instagram: p.instagram || "",
              youtube: p.youtube || "",
              twitter: p.twitter || "",
              linkedin: p.linkedin || "",
              isInternational: p.isInternational || false,
              category: p.category,
              categoryTitle: p.category?.title || p.categoryTitle || "Award Category",
              categorySlug: p.category?.slug || "",
              stream: p.category?.tier === "A_CULTURE_IDENTITY" ? "Creative Arts" : p.category?.tier === "B_NATION_STATE_BUILDING" ? "Social Impact" : "Craft & Platform",
              channelUrl: p.submissionLink || p.instagram || p.youtube || "",
              bio: `Platform: ${p.platform || 'Digital'} | Submission Link: ${p.submissionLink || 'None'}`,
              status: (p.status || 'PENDING').toUpperCase(),
              submittedAt: p.createdAt || new Date().toISOString()
            });
          }
        });
        setParticipants(mappedList);
      }
    }
    if (isAdminAuthenticated) {
      loadBackendParticipants();
    }
  }, [isAdminAuthenticated]);

  // Save changes to localStorage for offline persistence
  useEffect(() => {
    localStorage.setItem("admin_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("admin_participants", JSON.stringify(participants));
  }, [participants]);

  // Admin login handler calling real API POST /api/auth/login
  const adminLogin = async (email, password) => {
    try {
      const res = await adminLoginAPI(email, password);
      
      if (res && res.success) {
        const user = {
          id: res.admin?.id || res.admin?._id,
          name: res.admin?.name || "Directorate Admin",
          email: res.admin?.email || email,
          role: res.admin?.role || "SUPER_ADMIN"
        };
        setAdminUser(user);
        setIsAdminAuthenticated(true);
        localStorage.setItem("admin_token", res.token);
        localStorage.setItem("admin_user", JSON.stringify(user));
        return { success: true, admin: user, token: res.token };
      }
      
      // Fallback for offline demo mode
      if (email.trim().toLowerCase() === "admin@stateawards.gov.in" && password === "admin123") {
        const user = { name: "Directorate Admin", email: "admin@stateawards.gov.in", role: "SUPER_ADMIN" };
        setAdminUser(user);
        setIsAdminAuthenticated(true);
        localStorage.setItem("admin_token", "authenticated_admin_token");
        localStorage.setItem("admin_user", JSON.stringify(user));
        return { success: true };
      }

      return { success: false, message: res.message || "Invalid Admin Credentials" };
    } catch (err) {
      console.error("Admin Login Error:", err);
      if (email.trim().toLowerCase() === "admin@stateawards.gov.in" && password === "admin123") {
        const user = { name: "Directorate Admin", email: "admin@stateawards.gov.in", role: "SUPER_ADMIN" };
        setAdminUser(user);
        setIsAdminAuthenticated(true);
        localStorage.setItem("admin_token", "authenticated_admin_token");
        localStorage.setItem("admin_user", JSON.stringify(user));
        return { success: true };
      }
      return { success: false, message: "Unable to connect to authentication server." };
    }
  };

  // Admin logout handler
  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  };

  // Category Actions
  const addCategory = async (categoryData) => {
    const token = localStorage.getItem("admin_token");
    const res = await createCategoryAPI(categoryData, token);
    const createdCat = res && res.success && res.category ? res.category : null;
    
    const slug = createdCat?.slug || categoryData.slug || (typeof categoryData.get === 'function' ? categoryData.get('title') : categoryData.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = createdCat?.title || (typeof categoryData.get === 'function' ? categoryData.get('title') : categoryData.title);
    const tier = createdCat?.tier || (typeof categoryData.get === 'function' ? categoryData.get('tier') : categoryData.tier) || "A_CULTURE_IDENTITY";

    let streamTag = "Creative Arts";
    if (tier === "B_NATION_STATE_BUILDING") streamTag = "Social Impact";
    else if (tier === "C_CRAFT_PLATFORM") streamTag = "Craft & Platform";

    const newCat = {
      _id: createdCat?._id || `cat-${Date.now()}`,
      slug,
      title,
      shortDescription: createdCat?.shortDescription || (typeof categoryData.get === 'function' ? categoryData.get('shortDescription') : categoryData.shortDescription) || "",
      tier,
      stream: streamTag,
      taskBrief: createdCat?.taskBrief || (typeof categoryData.get === 'function' ? categoryData.get('taskBrief') : categoryData.taskBrief) || "",
      hashtag: createdCat?.hashtag || (typeof categoryData.get === 'function' ? categoryData.get('hashtag') : categoryData.hashtag) || "cgcreatorawards",
      prizeTier: createdCat?.prizeTier || "FLAGSHIP",
      cashPrizeMin: Number(createdCat?.cashPrizeMin || (typeof categoryData.get === 'function' ? categoryData.get('cashPrizeMin') : categoryData.cashPrizeMin) || 51000),
      cashPrizeMax: Number(createdCat?.cashPrizeMax || (typeof categoryData.get === 'function' ? categoryData.get('cashPrizeMax') : categoryData.cashPrizeMax) || 75000),
      image: createdCat?.image || (typeof categoryData.get === 'function' ? categoryData.get('image') : categoryData.image) || null,
      isActive: true
    };

    setCategories(prev => [newCat, ...prev]);
    return { success: true, category: newCat };
  };

  const updateCategory = async (idOrSlug, updatedData) => {
    const token = localStorage.getItem("admin_token");
    const target = categories.find(c => c._id === idOrSlug || c.slug === idOrSlug);
    const targetId = target?._id || idOrSlug;

    const res = await updateCategoryAPI(targetId, updatedData, token);
    const updatedCat = res && res.success && res.category ? res.category : null;

    setCategories(prev => prev.map(c => {
      if (c._id === targetId || c.slug === idOrSlug) {
        const title = updatedCat?.title || (typeof updatedData.get === 'function' ? updatedData.get('title') : updatedData.title) || c.title;
        const tier = updatedCat?.tier || (typeof updatedData.get === 'function' ? updatedData.get('tier') : updatedData.tier) || c.tier;
        let streamTag = "Creative Arts";
        if (tier === "B_NATION_STATE_BUILDING") streamTag = "Social Impact";
        else if (tier === "C_CRAFT_PLATFORM") streamTag = "Craft & Platform";

        return {
          ...c,
          title,
          shortDescription: updatedCat?.shortDescription || (typeof updatedData.get === 'function' ? updatedData.get('shortDescription') : updatedData.shortDescription) || c.shortDescription,
          tier,
          stream: streamTag,
          taskBrief: updatedCat?.taskBrief || (typeof updatedData.get === 'function' ? updatedData.get('taskBrief') : updatedData.taskBrief) || c.taskBrief,
          hashtag: updatedCat?.hashtag || (typeof updatedData.get === 'function' ? updatedData.get('hashtag') : updatedData.hashtag) || c.hashtag,
          prizeTier: updatedCat?.prizeTier || c.prizeTier,
          cashPrizeMin: Number(updatedCat?.cashPrizeMin || (typeof updatedData.get === 'function' ? updatedData.get('cashPrizeMin') : updatedData.cashPrizeMin) || c.cashPrizeMin),
          cashPrizeMax: Number(updatedCat?.cashPrizeMax || (typeof updatedData.get === 'function' ? updatedData.get('cashPrizeMax') : updatedData.cashPrizeMax) || c.cashPrizeMax),
          image: updatedCat?.image !== undefined ? updatedCat.image : c.image
        };
      }
      return c;
    }));

    return { success: true };
  };

  const deleteCategory = async (idOrSlug) => {
    const token = localStorage.getItem("admin_token");
    const target = categories.find(c => c._id === idOrSlug || c.slug === idOrSlug);
    const targetId = target?._id || idOrSlug;

    await deleteCategoryAPI(targetId, token);
    setCategories(prev => prev.filter(c => c._id !== targetId && c.slug !== idOrSlug));
    return { success: true };
  };

  // Participant actions with API integration
  const addParticipant = (data) => {
    const newParticipant = {
      id: `part-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "+91 90000 00000",
      district: data.district || "Raipur",
      categorySlug: data.categorySlug || "chhattisgarhiya-sanskriti-ambassador",
      categoryTitle: data.categoryTitle || "Culture & Identity Ambassador",
      stream: data.stream || "Creative Arts",
      channelUrl: data.channelUrl || "",
      followersCount: data.followersCount || "10K",
      bio: data.bio || "",
      status: (data.status || "SUBMITTED").toUpperCase(),
      submittedAt: new Date().toISOString()
    };
    setParticipants(prev => [newParticipant, ...prev]);
    return newParticipant;
  };

  const updateParticipantStatus = async (id, newStatus, categoryId = null) => {
    const token = localStorage.getItem("admin_token");
    const upperStatus = String(newStatus).toUpperCase();

    const cleanCatId = typeof categoryId === 'object' && categoryId !== null 
      ? (categoryId._id || categoryId.id) 
      : categoryId;

    // Call backend API PUT /api/participants/:id/status
    const res = await updateParticipantStatusAPI(id, upperStatus, cleanCatId, token);

    // Update participants state
    setParticipants(prev => prev.map(p => {
      const isTarget = p.id === id || p._id === id;
      if (!isTarget) return p;

      const catMatch = !cleanCatId || 
        p.subId === cleanCatId || 
        p.categoryId === cleanCatId || 
        p.category?._id === cleanCatId || 
        p.category?.id === cleanCatId || 
        p.category === cleanCatId;

      if (catMatch) {
        return { ...p, status: upperStatus };
      }
      return p;
    }));

    return res;
  };

  const deleteParticipant = async (id) => {
    const token = localStorage.getItem("admin_token");
    await deleteParticipantAdminAPI(id, token);
    setParticipants(prev => prev.filter(p => p.id !== id && p._id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated,
        categories,
        participants,
        adminLogin,
        adminLogout,
        addParticipant,
        updateParticipantStatus,
        deleteParticipant,
        addCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
