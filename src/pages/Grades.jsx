// src/pages/Grades.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import booksData from '../booksData_Complete.json';

const Grades = () => {
  const { stage } = useParams();
  const navigate = useNavigate();
  
  const availableGrades = booksData[stage] ? Object.keys(booksData[stage]) : [];

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: 'var(--text-darkGray)', transition: 'color 0.3s' }}>المرحلة: {stage} - اختر الصف:</h2>
      {availableGrades.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '18px' }}>جاري تجهيز كتب هذه المرحلة قريباً... 🛠️</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          {availableGrades.map((grade) => (
            <button 
              key={grade} 
              onClick={() => navigate(`/stage/${stage}/grade/${grade}`)} 
              style={{ 
                padding: '20px', 
                backgroundColor: '#15803d', /* لون أخضر واضح متناسق مع الرئيسية */
                color: '#ffffff', /* نص أبيض ساطع */
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontSize: '18px', /* خط أصغر قليلاً من الرئيسية (22px) */
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-3px)'; 
                e.currentTarget.style.boxShadow = '0 8px 10px -3px rgba(0,0,0,0.2)'; 
                e.currentTarget.style.backgroundColor = '#166534';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; 
                e.currentTarget.style.backgroundColor = '#15803d';
              }}
            >
              {grade}
            </button>
          ))}
        </div>
      )}
      
      <button onClick={() => navigate('/')} style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: 'var(--text-darkGray)', color: 'var(--bg-white)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s, color 0.3s' }}>
        🔙 عودة للمراحل
      </button>
    </div>
  );
};

export default Grades;