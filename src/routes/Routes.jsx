import { Routes, Route } from 'react-router-dom';
import Home from '../components/home/Home';
import AuthPage from '../components/auth/AuthPage';
import Dashboard from '../components/dashboard/Dashboard';
import OAuthSuccess from '../components/auth/OAuthSuccess';
import CategoriesPage from '../components/home/CategoriesPage';
import ParticipateForm from '../components/home/ParticipateForm';
import AboutPage from '../components/about/AboutPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/participate" element={<ParticipateForm />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
