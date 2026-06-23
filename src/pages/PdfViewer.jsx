// src/pages/PdfViewer.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { cleanBookName } from '../utils/helpers';

const PdfViewer = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌙 حالة الوضع الليلي المريح للعين
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const bookName = location.state?.bookName ? cleanBookName(location.state.bookName) : 'قراءة الكتاب';
  const iframeUrl = `https://drive.google.com/file/d/${bookId}/preview`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: '-20px' }}>
      
      {/* 🌟 شريط علوي احترافي مطور */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '12px 15px', backgroundColor: isDarkMode ? '#1a202c' : '#15803d', color: '#ffffff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 10,
        transition: 'background-color 0.3s'
      }}>
        
        {/* زر الرجوع */}
        <button onClick={() => navigate(-1)} style={{ 
          background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '5px', fontSize: '15px', fontWeight: 'bold'
        }}>
          <span style={{ fontSize: '20px' }}>➔</span> عودة
        </button>

        {/* اسم الكتاب */}
        <h3 style={{ margin: 0, fontSize: '15px', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {bookName}
        </h3>

        {/* زر تبديل الوضع الليلي 🌙/☀️ */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ 
            padding: '8px 12px', backgroundColor: isDarkMode ? '#4a5568' : '#ffffff', 
            color: isDarkMode ? '#ffffff' : '#15803d', border: 'none', borderRadius: '8px', 
            cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'all 0.3s'
          }}
          title={isDarkMode ? 'العودة للوضع العادي' : 'تفعيل الوضع الليلي'}
        >
          {isDarkMode ? '☀️ نهاري' : '🌙 ليلي'}
        </button>

      </div>

      {/* منطقة عرض الـ PDF */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: isDarkMode ? '#000000' : '#4b5563' }}>
        {isLoading && (
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            color: '#ffffff', fontSize: '18px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '30px' }}>⏳</span>
            جاري تجهيز الكتاب... 
          </div>
        )}
        
        {/* خدعة الوضع الليلي عبر الفلاتر البصرية */}
        <iframe
          src={iframeUrl}
          title={bookName}
          width="100%"
          height="100%"
          style={{ 
            border: 'none',
            // هذا السطر هو سر الوضع الليلي: يقلب الألوان ويصحح درجات الصور
            filter: isDarkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none',
            transition: 'filter 0.4s ease'
          }}
          onLoad={() => setIsLoading(false)}
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  );
};

export default PdfViewer;