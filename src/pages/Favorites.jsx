// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { colors } from '../theme';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // جلب الكتب المحفوظة عند فتح الصفحة
    const favs = JSON.parse(localStorage.getItem('manhaji_favorites') || '[]');
    setFavorites(favs);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      <h2 style={{ color: colors.darkGreen, textAlign: 'center', marginBottom: '30px', borderBottom: `2px solid ${colors.orange}`, paddingBottom: '10px', display: 'inline-block' }}>
        ⭐ كتبي المفضلة
      </h2>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', color: colors.darkGray, marginTop: '50px', backgroundColor: colors.lightGray, padding: '40px', borderRadius: '12px' }}>
          <span style={{ fontSize: '40px' }}>📚</span>
          <h3 style={{ marginTop: '15px' }}>لم تقم بإضافة أي كتب للمفضلة بعد.</h3>
          <p style={{ fontSize: '14px', marginTop: '5px' }}>تصفح المناهج واضغط على علامة النجمة (☆) لحفظ كتبك للوصول السريع إليها هنا.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {favorites.map((book, index) => (
            <BookCard key={index} book={book} selectedStage="مفضلة" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;