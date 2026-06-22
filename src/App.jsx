// src/App.jsx
import React, { useState, useEffect } from 'react';
import './index.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app'; // مكتبة التحكم بأزرار الهاتف
import Header from './components/Header';

// استدعاء الصفحات
import Home from './pages/Home';
import Grades from './pages/Grades';
import Books from './pages/Books';
import Search from './pages/Search'; 
import PdfViewer from './pages/PdfViewer';
import Favorites from './pages/Favorites';

const App = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // أدوات لمعرفة مكان المستخدم الحالي ونقله
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------------------
  // الكود السحري للتحكم بزر الرجوع في نظام الأندرويد
  // ----------------------------------------------------
  useEffect(() => {
    const handleBackButton = async () => {
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        // إذا كنا في الصفحة الرئيسية
        if (location.pathname === '/') {
          // إذا كانت أي نافذة منبثقة مفتوحة، أغلقها فقط ولا تخرج من التطبيق
          if (showAbout || showContact) {
            setShowAbout(false);
            setShowContact(false);
          } else {
            // إذا لم يكن هناك شيء مفتوح ونحن في الرئيسية، اخرج من التطبيق
            CapacitorApp.exitApp();
          }
        } else {
          // إذا كنا في أي صفحة أخرى (كتاب، صفوف، بحث)، ارجع خطوة واحدة للخلف
          navigate(-1);
        }
      });
    };

    handleBackButton();

    // تنظيف الحدث لعدم تكرار الأوامر
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [location.pathname, navigate, showAbout, showContact]);
  // ----------------------------------------------------

  return (
    <div style={{ 
      fontFamily: 'Cairo, sans-serif', direction: 'rtl', minHeight: '100vh', 
      backgroundColor: 'var(--bg-lightGray)', 
      color: 'var(--text-darkGray)',
      padding: '20px',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      
      <Header setShowAbout={setShowAbout} setShowContact={setShowContact} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stage/:stage" element={<Grades />} />
        <Route path="/stage/:stage/grade/:grade" element={<Books />} />
        <Route path="/search" element={<Search />} /> 
        <Route path="/read/:bookId" element={<PdfViewer />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

      {/* النوافذ المنبثقة */}
      {showAbout && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-darkGray)', padding: '30px', borderRadius: '16px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#15803d', marginTop: 0 }}>تطبيق مَنهَجي</h2>
            <p style={{ lineHeight: '1.6' }}>تطبيق يمني يهدف لتوفير المناهج الدراسية لجميع الصفوف بسهولة ويسر وبأعلى جودة برمجية.</p>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <button onClick={() => setShowAbout(false)} style={{ padding: '8px 20px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {showContact && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-darkGray)', padding: '30px', borderRadius: '16px', maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#15803d', marginTop: 0 }}>تواصل معنا</h2>
            <p style={{ lineHeight: '1.6', fontSize: '18px' }}>البريد الإلكتروني للمطور:<br/><strong style={{ color: '#15803d' }}>support@manhaji.com</strong></p>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <button onClick={() => setShowContact(false)} style={{ padding: '8px 20px', backgroundColor: '#15803d', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 