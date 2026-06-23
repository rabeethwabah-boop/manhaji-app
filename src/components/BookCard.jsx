// src/components/BookCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookCoverPath, cleanBookName } from '../utils/helpers';

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

  // 🛡️ حماية المفضلة
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('manhaji_favorites') || '[]');
      return favs.some(fav => fav.id === book?.id);
    } catch (e) {
      return false;
    }
  });

  // 📡 فحص ذكي: هل هذا الكتاب محفوظ مسبقاً في الجوال؟
  useEffect(() => {
    if (book?.id) {
      caches.match(downloadUrl).then((response) => {
        if (response) setIsSavedOffline(true);
      });
    }
  }, [downloadUrl, book?.id]);

  // دالة فتح الكتاب
  const handleReadClick = () => {
    if (book?.id) navigate(`/read/${book.id}`, { state: { bookName: safeName } });
  };

  // 📥 دالة الحفظ السحري للعمل بدون إنترنت
  const handleSaveOffline = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // إذا كان محفوظاً، لا داعي لإعادة تحميله
    if (isSavedOffline) {
      alert('✅ هذا الكتاب موجود في جهازك ويمكنك قراءته بدون إنترنت!');
      return;
    }

    setIsSaving(true);
    try {
      const cache = await caches.open('manhaji-v1');
      // سحب الكتاب من النت وحفظه في ذاكرة التطبيق (بوضع no-cors لتجاوز حماية جوجل)
      const request = new Request(downloadUrl, { mode: 'no-cors' });
      const response = await fetch(request);
      await cache.put(request, response);
      
      setIsSavedOffline(true);
      alert('🎉 تم حفظ الكتاب بنجاح! يمكنك الآن قراءته في أي وقت بدون إنترنت.');
    } catch (error) {
      console.error("خطأ في الحفظ", error);
      // كخطة بديلة إذا تعثر الحفظ المخفي، نقوم بتنزيله كملف عادي في مجلد التنزيلات
      window.open(downloadUrl, '_blank');
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
    } catch (e) {
      console.error("خطأ في المفضلة", e);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-white)', 
      borderRadius: '16px', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      overflow: 'hidden', 
      transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}>
      
      <button 
        onClick={toggleFavorite}
        style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: 'rgba(255, 255, 255, 0.9)',
          border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s', color: '#000' 
        }}
        title="إضافة للمفضلة"
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      <div 
        onClick={handleReadClick}
        style={{
        backgroundColor: '#15803d', 
        textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '260px', 
        color: '#ffffff', position: 'relative', 
        padding: '8px',
        cursor: 'pointer'
      }}>
        <img
          src={getBookCoverPath(book)}
          alt={cleanName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', display: imageStatus === 'failed' ? 'none' : 'block' }}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('failed')}
        />

        <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', gap: '5px', zIndex: 5 }}>
          {hasSanaa && <span style={{ backgroundColor: '#0284c7', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>صنعاء</span>}
          {hasAden && <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>عدن</span>}
        </div>
        
        {imageStatus === 'failed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <span style={{ fontSize: '32px', marginBottom: '10px' }}>📚</span>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', lineHeight: '1.4', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>{cleanName}</h4>
          </div>
        )}
      </div>
      
      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-darkGray)', margin: '0 0 15px 0', lineHeight: '1.4', textAlign: 'center', transition: 'color 0.3s' }}>{cleanName}</p>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          
          <button onClick={handleReadClick} style={{ padding: '10px', backgroundColor: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            👁️ قراءة
          </button>

          {/* 🚀 زر التحميل الذكي الجديد */}
          <button 
            onClick={handleSaveOffline} 
            disabled={isSaving}
            style={{ 
              padding: '10px', 
              backgroundColor: isSavedOffline ? '#4b5563' : (isSaving ? '#fb923c' : '#f97316'), 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              cursor: isSavedOffline ? 'default' : (isSaving ? 'wait' : 'pointer'), 
              transition: 'background-color 0.2s' 
            }}
          >
            {isSaving ? '⏳ جاري الحفظ...' : (isSavedOffline ? '✅ متاح بدون نت' : '📥 حفظ للمحمول')}
          </button>

        </div>
      </div>
    </div>
  );
};

export default BookCard;