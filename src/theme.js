// src/theme.js
export const colors = {
    darkGreen: '#1B5E20',
    lightGreen: '#2E7D32',
    orange: '#FF8C00',
    lightOrange: '#FFA500',
    // الألوان أدناه ستتغير تلقائياً بناءً على الوضع الليلي/الفاتح
    white: 'var(--bg-white)',
    lightGray: 'var(--bg-lightGray)',
    darkGray: 'var(--text-darkGray)',
    borderGray: 'var(--border-gray)',
  };
  
  export const stages = [
    { name: 'الابتدائية', color: colors.darkGreen, key: 'الابتدائية' },
    { name: 'الأساسية', color: colors.lightGreen, key: 'الأساسية' },
    { name: 'الإعدادية', color: colors.orange, key: 'الإعدادية' },
    { name: 'الثانوية', color: colors.lightOrange, key: 'الثانوية' },
  ];