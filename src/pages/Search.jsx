// src/pages/Search.jsx
import React, { useState } from 'react';
import booksData from '../booksData_Complete.json';
import BookCard from '../components/BookCard';
import { cleanBookName } from '../utils/helpers';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredBooks = () => {
    if (!searchQuery.trim()) return [];
    
    const results = [];
    const query = searchQuery.toLowerCase();

    try {
      Object.keys(booksData).forEach((stage) => {
        Object.keys(booksData[stage]).forEach((grade) => {
          const books = booksData[stage][grade];
          if (Array.isArray(books)) {
            books.forEach((book) => {
              if (book?.name && book.name.toLowerCase().includes(query)) {
                if (!results.some(r => r.id === book.id)) {
                  results.push({ ...book, stage, grade });
                }
              }
            });
          }
        });
      });
    } catch (e) {
      console.error("خطأ أثناء البحث:", e);
    }
    return results;
  };

  const filteredBooks = getFilteredBooks();

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h2 style={{ color: 'var(--text-darkGray)', marginBottom: '15px' }}>🔍 البحث عن الكُتب</h2>
      
      {/* سطر البحث الاحترافي المضمون الظهور */}
      <div style={{ marginBottom: '25px', width: '100%' }}>
        <input
          type="text"
          placeholder="اكتب اسم الكتاب هنا (مثلاً: الرياضيات، التاريخ...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '2px solid #15803d',
            backgroundColor: '#ffffff',
            color: '#2d3748',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            outline: 'none',
            fontFamily: 'Cairo, sans-serif',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {searchQuery.trim() === '' ? (
        <div style={{ textAlign: 'center', color: '#a0aec0', marginTop: '40px' }}>
          <span style={{ fontSize: '48px' }}>📚</span>
          <p style={{ marginTop: '10px' }}>ابدأ بكتابة اسم المادة المدرسية للبحث عنها في جميع الصفوف.</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#a0aec0', marginTop: '40px' }}>
          <span style={{ fontSize: '48px' }}>❌</span>
          <p style={{ marginTop: '10px' }}>لم يتم العثور على كتب تطابق بحثك: "{searchQuery}"</p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#718096', marginBottom: '15px', fontSize: '14px' }}>
            تم العثور على ({filteredBooks.length}) كتاب مطابِق:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '15px' }}>
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id || index} book={book} selectedStage={book.stage} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;