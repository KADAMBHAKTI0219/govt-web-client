import { useEffect } from 'react'
import './index.css'
import Footer from './layout/Footer'
import Header from './layout/Header'
import Navbar from './layout/Navbar'
import AppRoutes from './routes/Routes'
import { useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AdminProvider } from './context/AdminContext'
import CreatorBot from './components/ui/CreatorBot'

function App() {
  const location = useLocation();
  const { pathname, hash } = location;

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    }
  }, [pathname, hash]);

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <AdminProvider>
        {!isDashboard && !isAuth && !isAdmin && <Header/>}
        {!isDashboard && !isAuth && !isAdmin && <Navbar/>}
        <AppRoutes />
        {!isDashboard && !isAuth && !isAdmin && <Footer/>}
        
        {/* Global Interactive Responsive 3D Mascot Guide */}
        {!isDashboard && !isAuth && !isAdmin && <CreatorBot />}
      </AdminProvider>
    </LanguageProvider>
  )
}

export default App