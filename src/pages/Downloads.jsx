// src/pages/Downloads.jsx
import React, { useState, useEffect } from 'react';
import { getBookCoverPath, cleanBookName } from '../utils/helpers';

const Downloads = () => {
  const [downloadedBooks, setDownloadedBooks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('manhaji_downloads') || '[]');
    setDownloadedBooks(saved);
  }, []);

  const handleDelete = (bookId) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد إزالة الكتاب من هذا السجل؟ (ملاحظة: هذا الإجراء لن يحذف الملف الفعلي من جهازك)");
    if (!confirmDelete) return;

    const updatedBooks = downloadedBooks.filter(b => b.id !== bookId);
    localStorage.setItem('manhaji_downloads', JSON.stringify(updatedBooks));
    setDownloadedBooks(updatedBooks);
  };

  return (
    <div style={{ paddingBottom: '80px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <span style={{ fontSize: '28px' }}>📥</span>
        <h2 style={{ color: 'var(--text-darkGray)', margin: 0 }}>سجل التنزيلات</h2>
      </div>
      
      {/* 🌟 صندوق إرشادي هام للمستخدم */}
      <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6', border: '1px solid #bae6fd' }}>
        💡 <strong>ملاحظة هامة:</strong> حمايةً لملفاتك، الكتب التي تقوم بتنزيلها تُحفظ مباشرة في تطبيق <strong>"ملفاتي (My Files)"</strong> ثم مجلد <strong>"التنزيلات (Downloads)"</strong> داخل هاتفك. لفتح أي كتاب بدون إنترنت، اذهب لملفات هاتفك وافتحه من هناك.
      </div>

      {downloadedBooks.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', backgroundColor: 'var(--bg-white)', padding: '40px 20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '15px' }}>📭</span>
          <h3 style={{ color: 'var(--text-darkGray)', marginBottom: '10px' }}>السجل فارغ</h3>
          <p style={{ color: '#718096', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
            لم تقم بتنزيل أي كتب بعد. تصفح المناهج واضغط على "تنزيل لجهازي" لحفظها!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {downloadedBooks.map(book => (
            <div key={book.id} style={{ display: 'flex', backgroundColor: 'var(--bg-white)', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', alignItems: 'center', gap: '15px' }}>
              <img src={getBookCoverPath(book)} alt={cleanBookName(book.name)} style={{ width: '65px', height: '90px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-darkGray)', lineHeight: '1.4' }}>{cleanBookName(book.name)}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>✅ محفوظ في جهازك</p>
              </div>

              <button 
                onClick={() => handleDelete(book.id)} 
                style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }} 
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;