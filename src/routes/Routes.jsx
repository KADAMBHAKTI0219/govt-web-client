import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/home/Home';
import AuthPage from '../components/auth/AuthPage';
import Dashboard from '../components/dashboard/Dashboard';
import OAuthSuccess from '../components/auth/OAuthSuccess';
import CategoriesPage from '../components/home/CategoriesPage';
import ParticipateForm from '../components/home/ParticipateForm';
import MyProfile from '../components/home/MyProfile';
import AboutPage from '../components/about/AboutPage';

// Admin Imports
import AdminLogin from '../components/admin/auth/AdminLogin';
import AdminLayout from '../components/admin/layout/AdminLayout';
import Overview from '../components/admin/dashboard/Overview';
import CategoryManagement from '../components/admin/categories/CategoryManagement';
import ParticipantsList from '../components/admin/participantsManagement/ParticipantsList';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/participate" element={<ParticipateForm />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/track" element={<Navigate to="/my-profile" replace />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Portal Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Overview />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="participants" element={<ParticipantsList />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
