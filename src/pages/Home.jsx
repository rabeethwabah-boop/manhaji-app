// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { stages } from '../theme';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-darkGray)', transition: 'color 0.3s' }}>
        اختر المرحلة الدراسية:
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '10px' }}>
        {stages.map((stage) => (
          <div 
            key={stage.key} 
            onClick={() => navigate(`/stage/${stage.key}`)} 
            style={{ 
              backgroundColor: '#15803d', /* اللون الموحد الجديد */
              color: '#ffffff', padding: '40px 20px', 
              borderRadius: '16px', textAlign: 'center', cursor: 'pointer', 
              fontSize: '22px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
          >
            {stage.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;