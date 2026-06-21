// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { colors } from '../theme';
import booksData from '../booksData_Complete.json';
import BookCard from '../components/BookCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // التقاط كلمة البحث من الرابط
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const allBooks = [];
    const lowerQuery = query.toLowerCase();

    // خوارزمية ذكية لاستخراج جميع الكتب من كل المراحل والصفوف والبحث داخلها
    Object.entries(booksData).forEach(([stage, grades]) => {
      Object.entries(grades).forEach(([grade, books]) => {
        books.forEach((book) => {
          if (book.name.toLowerCase().includes(lowerQuery)) {
            // ندمج بيانات الكتاب ونضيف إليها اسم المرحلة والصف ليعرف الطالب مصدره
            allBooks.push({ ...book, stage, grade });
          }
        });
      });
    });

    setResults(allBooks);
  }, [query]);

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: colors.darkGray }}>
        نتائج البحث عن: <span style={{ color: colors.orange }}>"{query}"</span>
      </h2>
      
      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <span style={{ fontSize: '64px' }}>🔍</span>
          <p style={{ color: '#a0aec0', fontSize: '20px', marginTop: '15px' }}>
            لم يتم العثور على كتب تطابق بحثك. جرب كتابة اسم المادة (مثال: علوم).
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {results.map((book, index) => (
            <BookCard key={index} book={book} selectedStage={book.stage} />
          ))}
        </div>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: colors.darkGray, color: colors.white, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
        🔙 عودة
      </button>
    </div>
  );
};

export default Search;