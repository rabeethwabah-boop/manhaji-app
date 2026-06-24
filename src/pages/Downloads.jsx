// src/pages/Downloads.jsx
import React, { useState, useEffect } from 'react';
import { getBookCoverPath, cleanBookName } from '../utils/helpers';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

const Downloads = () => {
  const [downloadedBooks, setDownloadedBooks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('manhaji_downloads') || '[]');
    setDownloadedBooks(saved);
  }, []);

  const handleDelete = async (bookId, fileName) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا الكتاب من التنزيلات لتحرير مساحة في هاتفك؟");
    if (!confirmDelete) return;

    try {
      const targetFile = fileName || `manhaji_${bookId}.pdf`;
      await Filesystem.deleteFile({
        path: targetFile,
        directory: Directory.Data
      });
    } catch (e) {
      console.warn("تم إزالة الملف الفعلي مسبقاً", e);
    }

    const updatedBooks = downloadedBooks.filter(b => b.id !== bookId);
    localStorage.setItem('manhaji_downloads', JSON.stringify(updatedBooks));
    setDownloadedBooks(updatedBooks);
  };

  const openOfflineBook = async (book) => {
    try {
      const targetFile = book.fileName || `manhaji_${book.id}.pdf`;
      const fileInfo = await Filesystem.getUri({
        path: targetFile,
        directory: Directory.Data
      });

      await FileOpener.open({
        filePath: fileInfo.uri,
        contentType: 'application/pdf',
      });
    } catch (error) {
      console.error("خطأ فتح الملف", error);
      alert('لم نجد تطبيق قارئ PDF مناسب في جوالك لفتح الملف أوفلاين، يرجى تثبيت أي قارئ كتب مجاني.');
    }
  };

  return (
    <div style={{ paddingBottom: '80px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <span style={{ fontSize: '28px' }}>📥</span>
        <h2 style={{ color: 'var(--text-darkGray)', margin: 0 }}>المكتبة المحملة (الأوفلاين)</h2>
      </div>

      {downloadedBooks.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', backgroundColor: 'var(--bg-white)', padding: '40px 20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '15px' }}>📭</span>
          <h3 style={{ color: 'var(--text-darkGray)', marginBottom: '10px' }}>المكتبة فارغة</h3>
          <p style={{ color: '#718096', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>
            لم تقم بحفظ أي كتب في تطبيق منهجي بعد. تصفح المواد واضغط على "حفظ للمحمول".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {downloadedBooks.map(book => (
            <div key={book.id} style={{ display: 'flex', backgroundColor: 'var(--bg-white)', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', alignItems: 'center', gap: '15px' }}>
              <img src={getBookCoverPath(book)} alt={cleanBookName(book.name)} style={{ width: '65px', height: '90px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-darkGray)', lineHeight: '1.4' }}>{cleanBookName(book.name)}</h4>
                <button 
                  onClick={() => openOfflineBook(book)} 
                  style={{ padding: '8px 15px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  📖 قراءة الأوفلاين الأصلي
                </button>
              </div>

              <button 
                onClick={() => handleDelete(book.id, book.fileName)} 
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