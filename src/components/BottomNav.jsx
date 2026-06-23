// src/components/BottomNav.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // إخفاء الشريط السفلي تماماً في شاشة قراءة الـ PDF لمنح الطالب مساحة كاملة للقراءة
  if (location.pathname.startsWith('/read/')) {
    return null;
  }

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: '🏠' },
    { path: '/search', label: 'البحث', icon: '🔍' },
    { path: '/favorites', label: 'المفضلة', icon: '⭐' },
    { path: '/downloads', label: 'التنزيلات', icon: '📥' }, // القسم الجديد الممهد للأوفلاين
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-white)',
      height: '65px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.08)',
      zIndex: 999,
      borderTopRightRadius: '20px',
      borderTopLeftRadius: '20px',
      padding: '0 10px',
      transition: 'background-color 0.3s'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flex: 1,
              gap: '4px',
              color: isActive ? '#15803d' : '#718096',
              transition: 'transform 0.2s, color 0.2s'
            }}
          >
            <span style={{ 
              fontSize: '22px',
              transform: isActive ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.2s'
            }}>
              {item.icon}
            </span>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: isActive ? 'bold' : 'normal',
              color: isActive ? '#15803d' : 'var(--text-darkGray)'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;