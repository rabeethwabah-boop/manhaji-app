// src/pages/Books.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import booksData from '../booksData_Complete.json';
import { sortBooksBySubject } from '../utils/helpers';
import BookCard from '../components/BookCard';

const Books = () => {
  const { stage, grade } = useParams();

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
    <div style={{ paddingBottom: '30px', position: 'relative' }}>
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
    </div>
  );
};

export default Books;