import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ملاحظة: تأكد من تمرير خصائص الوضع الليلي إذا كنت تستخدمها (مثل isDarkMode و toggleTheme)
const Header = ({ setShowAbout, setShowContact, isDarkMode, toggleTheme }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const navigate = useNavigate();

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
      deferredPrompt.userChoice.then((choiceResult) => {
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
        
        {/* زر التثبيت (يظهر فقط إذا كان متاحاً) */}
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

        {/* زر الوضع الليلي (تأكد من توافقه مع منطق الـ App.jsx لديك) */}
        {toggleTheme && (
           <button 
             onClick={toggleTheme} 
             style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
             title="تبديل الوضع"
           >
             {isDarkMode ? '☀️' : '🌙'}
           </button>
        )}

        <button onClick={() => setShowAbout(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-darkGray)', fontWeight: 'bold' }}>حول</button>
        <button onClick={() => setShowContact(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-darkGray)', fontWeight: 'bold' }}>تواصل</button>
      </div>
    </header>
  );
};

export default Header;