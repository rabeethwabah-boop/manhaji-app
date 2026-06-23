// src/pages/Downloads.jsx
import React from 'react';

const Downloads = () => {
  return (
    <div style={{ paddingBottom: '80px', textAlign: 'center', marginTop: '50px' }}>
      <span style={{ fontSize: '64px' }}>📥</span>
      <h2 style={{ color: 'var(--text-darkGray)', marginTop: '20px' }}>مكتبتي المحملة</h2>
      <p style={{ color: '#718096', maxWidth: '400px', margin: '10px auto', lineHeight: '1.6' }}>
        هنا ستظهر جميع الكتب التي قمت بحفظها للعمل بدون إنترنت لتتمكن من الوصول إليها بسرعة وسهولة في أي وقت!
      </p>
    </div>
  );
};

export default Downloads;