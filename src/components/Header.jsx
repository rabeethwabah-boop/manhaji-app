import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setShowAbout, setShowContact }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();
  
  // حالة الوضع الليلي (يقرأ الحالة من ذاكرة المتصفح ليتذكر اختيار المستخدم)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // تفعيل الكلاس الخاص بالوضع الليلي عند تغير الحالة
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // دالة تبديل الوضع (ليلي / نهاري)
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); 
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null); 
      });
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
      
      {/* اسم التطبيق / الشعار */}
      <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d', textDecoration: 'none' }}>
        مَنهَجي 📘
      </Link>
      
      {/* مجموعة الأزرار */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* زر التثبيت */}
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick} 
            style={{ 
              backgroundColor: '#15803d', color: '#ffffff', border: 'none', 
              padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', 
              fontSize: '14px', fontWeight: 'bold' 
            }}
          >
            تثبيت 📱
          </button>
        )}

        {/* زر المفضلة */}
        <button 
          onClick={() => navigate('/favorites')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
          title="المفضلة"
        >
          ❤️
        </button>

        {/* زر الوضع الليلي (مستقل ويعمل بكفاءة) */}
        <button 
          onClick={toggleTheme} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
          title="تبديل الوضع"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <button onClick={() => setShowAbout(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-darkGray)', fontWeight: 'bold' }}>حول</button>
        <button onClick={() => setShowContact(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-darkGray)', fontWeight: 'bold' }}>تواصل</button>
      </div>
    </header>
  );
};

export default Header;