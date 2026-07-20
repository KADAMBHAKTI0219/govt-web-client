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

import { Toaster } from 'react-hot-toast'

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
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <AdminProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0B1448',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
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