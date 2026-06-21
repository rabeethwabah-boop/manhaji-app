// src/pages/PdfViewer.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../theme';
import { cleanBookName } from '../utils/helpers';

const PdfViewer = () => {
  const { bookId } = useParams(); // استخراج ID الكتاب من الرابط
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  // استلام اسم الكتاب من الصفحة السابقة (إن وجد)
  const bookName = location.state?.bookName ? cleanBookName(location.state.bookName) : 'قراءة الكتاب';
  
  // الرابط الخاص بـ Google Drive المخصص للعرض داخل iframe
  const iframeUrl = `https://drive.google.com/file/d/${bookId}/preview`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: '-20px' }}>
      {/* شريط علوي خاص بالقارئ */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '15px 20px', backgroundColor: colors.darkGreen, color: colors.white,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 10
      }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>📖 {bookName}</h3>
        <button onClick={() => navigate(-1)} style={{ 
          padding: '8px 15px', backgroundColor: colors.white, color: colors.darkGreen, 
          border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
        }}>
          إغلاق القارئ
        </button>
      </div>

      {/* منطقة عرض الـ PDF */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: colors.darkGray }}>
        {isLoading && (
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
            color: colors.white, fontSize: '18px', fontWeight: 'bold' 
          }}>
            جاري تحميل الكتاب... ⏳
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