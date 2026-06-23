// src/pages/PdfViewer.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { cleanBookName } from '../utils/helpers';

const PdfViewer = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  const bookName = location.state?.bookName ? cleanBookName(location.state.bookName) : 'قراءة الكتاب';
  const iframeUrl = `https://drive.google.com/file/d/${bookId}/preview`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: '-20px' }}>
      
      {/* شريط علوي بسيط ونظيف */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '15px 20px', backgroundColor: '#15803d', color: '#ffffff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 10
      }}>
        <button onClick={() => navigate(-1)} style={{ 
          background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '5px', fontSize: '15px', fontWeight: 'bold'
        }}>
          <span style={{ fontSize: '20px' }}>➔</span> عودة
        </button>
        <h3 style={{ margin: 0, fontSize: '15px', maxWidth: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {bookName}
        </h3>
      </div>

      {/* منطقة عرض الـ PDF (نقية وبدون فلاتر لضمان عمل التكبير بإصبعين) */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#4b5563' }}>
        {isLoading && (
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            color: '#ffffff', fontSize: '18px', fontWeight: 'bold' 
          }}>
            جاري تجهيز الكتاب... ⏳
          </div>
        )}
        <iframe
          src={iframeUrl}
          title={bookName}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={() => setIsLoading(false)}
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  );
};

export default PdfViewer;