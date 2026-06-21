import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ setShowAbout, setShowContact }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // الاستماع لحدث التثبيت الذي يطلقه المتصفح تلقائياً
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // منع ظهور الشريط الافتراضي للمتصفح
      setDeferredPrompt(e); // حفظ الحدث لاستخدامه لاحقاً عند الضغط على زرنا
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // إظهار نافذة التثبيت
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null); // مسح الحدث بعد التفاعل
      });
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', marginBottom: '20px' }}>
      <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d', textDecoration: 'none' }}>
        مَنهَجي 📘
      </Link>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* زر التثبيت - يظهر فقط إذا كان التطبيق قابلاً للتثبيت */}
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick} 
            style={{ 
              backgroundColor: '#15803d', color: '#ffffff', border: 'none', 
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', 
              fontSize: '14px', fontWeight: 'bold' 
            }}
          >
            تثبيت التطبيق 📱
          </button>
        )}

        <button onClick={() => setShowAbout(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>حول</button>
        <button onClick={() => setShowContact(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>تواصل</button>
      </div>
    </header>
  );
};

export default Header;