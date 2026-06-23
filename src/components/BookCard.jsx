// src/components/BookCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookCoverPath, cleanBookName } from '../utils/helpers';
import { CapacitorHttp } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const BookCard = ({ book, selectedStage }) => {
  const [imageStatus, setImageStatus] = useState('loading');
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${book?.id || ''}`;
  const safeName = book?.name || '';
  const cleanName = cleanBookName(safeName);
  const hasSanaa = safeName.includes('صنعاء');
  const hasAden = safeName.includes('عدن');

  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('manhaji_favorites') || '[]');
      return favs.some(fav => fav.id === book?.id);
    } catch (e) { return false; }
  });

  useEffect(() => {
    if (book?.id) {
      const savedBooks = JSON.parse(localStorage.getItem('manhaji_downloads') || '[]');
      if (savedBooks.some(b => b.id === book.id)) {
        setIsSavedOffline(true);
      }
    }
  }, [book?.id]);

  const handleReadClick = () => {
    if (book?.id) navigate(`/read/${book.id}`, { state: { bookName: safeName } });
  };

  const handleSaveOffline = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSavedOffline) {
      alert('✅ هذا الكتاب متاح في جهازك بالفعل!');
      return;
    }

    setIsSaving(true);
    try {
      const fileName = `manhaji_${book.id}.pdf`;

      // 🚀 التحميل المباشر والعميق لذاكرة الجوال (تجاوز الويب تماماً)
      await CapacitorHttp.downloadFile({
        url: downloadUrl,
        filePath: fileName,
        fileDirectory: Directory.Data, // مسار بيانات التطبيق في الأندرويد
        connectTimeout: 60000,
        readTimeout: 60000,
      });
      
      // تسجيل بيانات الكتاب واسم الملف للوصول إليه لاحقاً
      const savedBooks = JSON.parse(localStorage.getItem('manhaji_downloads') || '[]');
      if (!savedBooks.some(b => b.id === book.id)) {
        savedBooks.push({ ...book, fileName: fileName });
        localStorage.setItem('manhaji_downloads', JSON.stringify(savedBooks));
      }

      setIsSavedOffline(true);
      alert('🎉 تم تنزيل الكتاب بنجاح! يمكنك الآن قراءته في أي وقت بدون إنترنت.');
    } catch (error) {
      console.error("خطأ في التحميل", error);
      alert('حدث خطأ أثناء تنزيل الكتاب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!book?.id) return;
    try {
      const favs = JSON.parse(localStorage.getItem('manhaji_favorites') || '[]');
      if (isFavorite) {
        const updatedFavs = favs.filter(fav => fav.id !== book.id);
        localStorage.setItem('manhaji_favorites', JSON.stringify(updatedFavs));
        setIsFavorite(false);
      } else {
        favs.push(book);
        localStorage.setItem('manhaji_favorites', JSON.stringify(favs));
        setIsFavorite(true);
      }
    } catch (e) { console.error("خطأ", e); }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-white)', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s', 
      display: 'flex', flexDirection: 'column', position: 'relative'
    }}>
      <button onClick={toggleFavorite} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title="إضافة للمفضلة">
        {isFavorite ? '⭐' : '☆'}
      </button>

      <div onClick={handleReadClick} style={{ backgroundColor: '#15803d', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: '#ffffff', position: 'relative', padding: '8px', cursor: 'pointer' }}>
        <img src={getBookCoverPath(book)} alt={cleanName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', display: imageStatus === 'failed' ? 'none' : 'block' }} onLoad={() => setImageStatus('loaded')} onError={() => setImageStatus('failed')} />
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', gap: '5px', zIndex: 5 }}>
          {hasSanaa && <span style={{ backgroundColor: '#0284c7', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>صنعاء</span>}
          {hasAden && <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>عدن</span>}
        </div>
      </div>
      
      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-darkGray)', margin: '0 0 15px 0', lineHeight: '1.4', textAlign: 'center' }}>{cleanName}</p>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button onClick={handleReadClick} style={{ padding: '10px', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>👁️ قراءة أونلاين</button>
          <button onClick={handleSaveOffline} disabled={isSaving || isSavedOffline} style={{ padding: '10px', backgroundColor: isSavedOffline ? '#4b5563' : (isSaving ? '#fb923c' : '#f97316'), color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: isSavedOffline ? 'default' : (isSaving ? 'wait' : 'pointer') }}>
            {isSaving ? '⏳ جاري التنزيل الحقيقي...' : (isSavedOffline ? '✅ محفوظ في الذاكرة' : '📥 تنزيل للموبايل')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;