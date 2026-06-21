// src/pages/Books.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import booksData from '../booksData_Complete.json';
import { sortBooksBySubject } from '../utils/helpers';
import BookCard from '../components/BookCard';

const Books = () => {
  const { stage, grade } = useParams();
  const navigate = useNavigate();

  // 🛡️ دالة محمية لجلب الكتب بأمان تام ضد انهيار الشاشة البيضاء
  const getAvailableBooks = () => {
    try {
      const books = booksData[stage]?.[grade];
      if (!books || !Array.isArray(books)) return [];
      return sortBooksBySubject(books, stage === 'الثانوية');
    } catch (error) {
      console.error("خطأ في جلب بيانات الكتب:", error);
      return [];
    }
  };

  const availableBooks = getAvailableBooks();

  return (
    <div style={{ paddingBottom: '80px', position: 'relative' }}>
      <h2 style={{ marginBottom: '20px', color: 'var(--text-darkGray)', transition: 'color 0.3s' }}>
        كتب {grade} ({stage}):
      </h2>
      
      {availableBooks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a0aec0' }}>لم يتم العثور على كتب مضافة لهذا الصف حالياً.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '15px' }}>
          {availableBooks.map((book, index) => (
            <BookCard key={book?.id || index} book={book} selectedStage={stage} />
          ))}
        </div>
      )}

      {/* 🚀 الزر العائم (المنبثق) في الجهة اليمنى */}
      <button 
        onClick={() => navigate(`/stage/${stage}`)} 
        style={{ 
          position: 'fixed', 
          bottom: '30px', 
          right: '30px', /* 👈 نقلناه لليمين كما طلبت */
          zIndex: 1000, 
          padding: '12px 25px', 
          backgroundColor: 'var(--text-darkGray)', 
          color: 'var(--bg-white)', 
          border: 'none', 
          borderRadius: '30px', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)', 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.3s, color 0.3s, transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span>🔙</span> عودة للصفوف
      </button>
    </div>
  );
};

export default Books;