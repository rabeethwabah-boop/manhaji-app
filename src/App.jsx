import React, { useState } from 'react';
// استيراد قاعدة البيانات الجديدة التي رتبها مانوس
import booksData from './booksData_Complete.json';

const App = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [navigationStack, setNavigationStack] = useState(['home']);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // الحفاظ على المراحل الـ 4 وألوانها المعتمدة في تطبيقك
  const stages = [
    { name: 'الابتدائية', color: '#FF6B6B', key: 'الابتدائية' },
    { name: 'الأساسية', color: '#4ECDC4', key: 'الأساسية' },
    { name: 'الإعدادية', color: '#45B7D1', key: 'الإعدادية' },
    { name: 'الثانوية', color: '#96CEB4', key: 'الثانوية' },
  ];

  const handleStageSelect = (stageKey) => {
    setSelectedStage(stageKey);
    setSelectedGrade(null);
    setNavigationStack(['home', stageKey]);
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setNavigationStack(['home', selectedStage, grade]);
  };

  // زر الرجوع الذكي للخلف
  const handleGoBack = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      
      if (newStack.length === 1) {
        setSelectedStage(null);
        setSelectedGrade(null);
      } else if (newStack.length === 2) {
        setSelectedGrade(null);
        setSelectedStage(newStack[1]);
      }
    }
  };

  // دالة تنظيف أسماء الكتب من الامتداد والشرطات لتبدو جميلة للمستخدم
  const cleanBookName = (name) => {
    return name
      .replace('.pdf', '')
      .replace(/_/g, ' ')
      .replace('كتاب', '')
      .trim();
  };

  // جلب الصفوف المتاحة للمرحلة المحددة (تجنب الانهيار إذا كانت المرحلة فارغة كالإبتدائية)
  const availableGrades = selectedStage && booksData[selectedStage] 
    ? Object.keys(booksData[selectedStage]) 
    : [];

  // جلب الكتب المتاحة للصف المحدد (مع حزام أمان تجنباً للانهيار)
  const availableBooks = selectedStage && selectedGrade && booksData[selectedStage]?.[selectedGrade]
    ? booksData[selectedStage][selectedGrade]
    : [];

  return (
    <div style={{
      fontFamily: 'Cairo, sans-serif',
      direction: 'rtl',
      minHeight: '100vh',
      backgroundColor: '#f5f7fb',
      padding: '20px'
    }}>
      {/* الهيدر العلوي لشريط التطبيق */}
      <header style={{
        display: 'flex',
        justifyContent: 'between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '15px 30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {navigationStack.length > 1 && (
            <button onClick={handleGoBack} style={{
              padding: '8px 15px',
              backgroundColor: '#e2e8f0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>🔙 عودة</button>
          )}
          <h1 style={{ color: '#2d3748', margin: 0, fontSize: '24px' }}>📚 تطبيق مَنهَجي</h1>
        </div>
        
        <nav style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowAbout(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}>من نحن</button>
          <button onClick={() => setShowContact(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}>تواصل معنا</button>
        </nav>
      </header>

      {/* الشاشة الرئيسية: اختيار المرحلة */}
      {!selectedStage && (
        <div>
          <h2 style={{ textWith: 'center', marginBottom: '20px', color: '#4a5568' }}>اختر المرحلة الدراسية:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {stages.map((stage) => (
              <div
                key={stage.key}
                onClick={() => handleStageSelect(stage.key)}
                style={{
                  backgroundColor: stage.color,
                  color: 'white',
                  padding: '40px 20px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
              >
                {stage.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الشاشة الثانية: اختيار الصف الدراسي */}
      {selectedStage && !selectedGrade && (
        <div>
          <h2 style={{ marginBottom: '20px', color: '#4a5568' }}>المرحلة: {selectedStage} - اختر الصف:</h2>
          {availableGrades.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '18px' }}>جاري تجهيز كتب هذه المرحلة قريباً... 🛠️</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              {availableGrades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGradeSelect(grade)}
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#2d3748'
                  }}
                >
                  {grade}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* الشاشة الثالثة: عرض الكتب ومطابقتها الصحيحة بدون انهيار */}
      {selectedStage && selectedGrade && (
        <div>
          <h2 style={{ marginBottom: '20px', color: '#4a5568' }}>كتب {selectedGrade} ({selectedStage}):</h2>
          {availableBooks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0aec0' }}>لم يتم العثور على كتب مضافة لهذا الصف حالياً.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {availableBooks.map((book, index) => {
                // 1. رابط التحميل المباشر للكتب
                const downloadUrl = `https://drive.google.com/uc?export=download&id=${book.id}`;
                
                // 2. رابط العرض والقراءة في متصفح جوجل درايف مباشرة بدون تحميل
                const previewUrl = `https://drive.google.com/file/d/${book.id}/view?usp=sharing`;
                
                return (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: '500', color: '#2d3748' }}>
                      📖 {cleanBookName(book.name)}
                    </span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#4a5568',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        👁️ قراءة
                      </a>
                      <a
                        href={downloadUrl}
                        download
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#319795',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        📥 تحميل
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* قوالب النوافذ المنبثقة (Modals) الشائعة للحفاظ على واجهتك */}
      {showAbout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h2>تطبيق مَنهَجي</h2>
            <p>تطبيق يمني يهدف لتوفير المناهج الدراسية لجميع الصفوف بسهولة ويسر وبأعلى جودة برمجية.</p>
            <button onClick={() => setShowAbout(false)} style={{ padding: '8px 16px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إغلاق</button>
          </div>
        </div>
      )}

      {showContact && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h2>تواصل معنا</h2>
            <p>البريد الإلكتروني المطور: support@manhaji.com</p>
            <button onClick={() => setShowContact(false)} style={{ padding: '8px 16px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;