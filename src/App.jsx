import React, { useState } from 'react';

function App() {
  // بيانات تجريبية للصفوف والمواد البرمجية لتطبيق "مكتبتي التعليمي"
  const [selectedStage, setSelectedStage] = useState('ثانوي');

  const subjects = [
    { id: 1, name: 'الرياضيات', icon: '📐', count: '12 ملف' },
    { id: 2, name: 'الفيزياء', icon: '⚡', count: '8 ملفات' },
    { id: 3, name: 'الكيمياء', icon: '🧪', count: '10 ملفات' },
    { id: 4, name: 'اللغة العربية', icon: '📚', count: '15 ملف' },
    { id: 5, name: 'اللغة الإنجليزية', icon: '🗣️', count: '9 ملفات' },
    { id: 6, name: 'الأحياء', icon: '🌱', count: '7 ملفات' },
  ];

  return (
    <div style={styles.container}>
      {/* الهيدر أو شريط العناوين العلوي */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>📖</span>
          <h1 style={styles.logoText}>مكتبتي التعليمية</h1>
        </div>
        <p style={styles.subtitle}>منصتك الشاملة للمناهج الدراسية، الملخصات، والاختبارات</p>
      </header>

      {/* أزرار اختيار المرحلة الدراسية */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tabButton, ...(selectedStage === 'أساسي' ? styles.activeTab : {})}}
          onClick={() => setSelectedStage('أساسي')}
        >
          التعليم الأساسي (الابتدائي/الإعدادي)
        </button>
        <button 
          style={{...styles.tabButton, ...(selectedStage === 'ثانوي' ? styles.activeTab : {})}}
          onClick={() => setSelectedStage('ثانوي')}
        >
          التعليم الثانوي
        </button>
      </div>

      {/* قسم عرض المواد الدراسية */}
      <main style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>المواد الدراسية المتاحة لـ (القسم ال{selectedStage})</h2>
        
        <div style={styles.grid}>
          {subjects.map((subject) => (
            <div key={subject.id} style={styles.card}>
              <div style={styles.cardIcon}>{subject.icon}</div>
              <h3 style={styles.cardTitle}>{subject.name}</h3>
              <p style={styles.cardCount}>{subject.count}</p>
              <button style={styles.cardButton}>تصفح الكتب والملخصات</button>
            </div>
          ))}
        </div>
      </main>

      {/* تذييل الصفحة */}
      <footer style={styles.footer}>
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - تطبيق مكتبتي التعليمي</p>
      </footer>
    </div>
  );
}

// تنسيقات سريعة وجميلة متوافقة مع القراءة من اليمين لليسان (RTL)
const styles = {
  container: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    direction: 'rtl',
    backgroundColor: '#f4f7f6',
    color: '#333',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  logoIcon: {
    fontSize: '2.5rem',
  },
  logoText: {
    fontSize: '2.5rem',
    margin: 0,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    margin: '30px 0 10px 0',
  },
  tabButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    border: '2px solid #2c3e50',
    borderRadius: '25px',
    backgroundColor: '#fff',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: '0.3s',
    fontWeight: 'bold',
  },
  activeTab: {
    backgroundColor: '#2c3e50',
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    width: '100%',
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '25px',
    padding: '10px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
    borderTop: '5px solid #3498db',
  },
  cardIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '1.4rem',
    margin: '0 0 10px 0',
    color: '#2c3e50',
  },
  cardCount: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '20px',
  },
  cardButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    transition: '0.2s',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    fontSize: '0.9rem',
    marginTop: '40px',
  }
};

export default App; 