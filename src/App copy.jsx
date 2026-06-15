import React, { useState, useEffect } from 'react';
import booksDataRaw from './booksData.json';

// Google Drive Folder IDs
const DRIVE_FOLDERS = {
  'ابتدائي': '18oNgzeJpzXlpgJMuwdy5OQ0Di-qsk8vK',
  'أساسي': '1HEzeKD7-eC1enEFhqqAZDfocW7Nujhoc',
  'إعدادي': '1iTlnS_U0Hsa2EI3lMl1yj3uYO1uGRX0f',
  'ثانوي': '10Ztanenq_xLLJcVsfGiJO_EUunpn7WBG'
};

// دالة لاستخراج معرّف الملف من رابط Google Drive
const extractFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // 1. يدعم الصيغة الشهيرة /d/ID/view
  const matchD = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (matchD) return matchD[1];
  
  // 2. يدعم صيغة الروابط المختصرة open?id=ID
  const matchId = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (matchId) return matchId[1];
  
  return null;
};

// دالة للحصول على رابط معاينة الملف من Google Drive
const getGoogleDrivePreviewUrl = (fileId) => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

// دالة للحصول على رابط التحميل المباشر
const getGoogleDriveDownloadUrl = (fileId) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// مكون Modal للإعدادات
function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      direction: 'rtl'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>الإعدادات</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#64748b'
          }}>✕</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ padding: '15px', background: '#f1f5f9', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}>اللغة</h3>
            <select style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}>
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>
          
          <div style={{ padding: '15px', background: '#f1f5f9', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}>الوضع</h3>
            <select style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}>
              <option>فاتح</option>
              <option>مظلم</option>
            </select>
          </div>
          
          <div style={{ padding: '15px', background: '#f1f5f9', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}>حجم الخط</h3>
            <input type="range" min="12" max="18" defaultValue="14" style={{ width: '100%' }} />
          </div>
        </div>
        
        <button onClick={onClose} style={{
          width: '100%',
          padding: '10px',
          marginTop: '20px',
          background: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}

// مكون Modal لـ "من نحن"
function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      direction: 'rtl'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>من نحن</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#64748b'
          }}>✕</button>
        </div>
        
        <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '14px' }}>
          <p>
            <strong>منصة مَنهجي</strong> هي مكتبة رقمية شاملة تهدف إلى تسهيل الوصول إلى المناهج الدراسية اليمنية بشكل مباشر وسهل.
          </p>
          <p>
            نؤمن بأهمية التعليم الجودة والوصول المتساوي للمواد التعليمية لجميع الطلاب والطالبات في اليمن.
          </p>
          <p>
            منصتنا توفر:
          </p>
          <ul style={{ paddingRight: '20px' }}>
            <li>مكتبة شاملة للمناهج من الصف الأول الابتدائي إلى الثالث الثانوي</li>
            <li>واجهة سهلة الاستخدام وتفاعلية</li>
            <li>تصنيف ذكي حسب المراحل والصفوف</li>
            <li>روابط مباشرة للمناهج من Google Drive</li>
          </ul>
          <p>
            <strong>رؤيتنا:</strong> أن نصبح المنصة الأولى للمناهج الدراسية في اليمن والعالم العربي.
          </p>
        </div>
        
        <button onClick={onClose} style={{
          width: '100%',
          padding: '10px',
          marginTop: '20px',
          background: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          إغلاق
        </button>
      </div>
    </div>
  );
}

// مكون Modal للتواصل
function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('شكراً لتواصلك معنا! سيتم الرد عليك قريباً.');
    setFormData({ name: '', email: '', message: '' });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      direction: 'rtl'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>تواصل معنا</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#64748b'
          }}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="اسمك"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit',
              textAlign: 'right'
            }}
          />
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit',
              textAlign: 'right'
            }}
          />
          <textarea
            placeholder="رسالتك"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows="5"
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              textAlign: 'right'
            }}
          />
          <button type="submit" style={{
            padding: '10px',
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            إرسال الرسالة
          </button>
        </form>
      </div>
    </div>
  );
}

// مكون عرض الملف من Google Drive
function FileViewer({ fileId, fileName, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1000px',
        marginBottom: '10px',
        color: 'white'
      }}>
        <h3 style={{ margin: 0 }}>{fileName}</h3>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          ✕ إغلاق
        </button>
      </div>
      
      <iframe
        src={getGoogleDrivePreviewUrl(fileId)}
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '85vh',
          border: 'none',
          borderRadius: '8px'
        }}
        title={fileName}
      />
    </div>
  );
}

function App() {
  const [navigationStack, setNavigationStack] = useState(['main']);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [driveFiles, setDriveFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  
  const currentCategory = navigationStack[navigationStack.length - 1];
  
  // جلب الملفات من Google Drive عند تغيير الفئة
  useEffect(() => {
    if (currentCategory === 'main') {
      setDriveFiles(prev => ({ ...prev, [currentCategory]: [] }));
      return;
    }

    setLoading(true);
    try {
      // 1. تصفية الكتب من الفهرس المحدث بناءً على المرحلة (ابتدائي، أساسي، إعدادي، ثانوي)
      const filteredBooks = booksDataRaw.filter(book => book.category === currentCategory);
      
      // 2. تحويل البيانات وتجهيزها لتتوافق مع التصميم المدمج
      const formattedFiles = filteredBooks.map(book => {
        const fileId = extractFileId(book.pdfUrl);
        return {
          id: fileId || book.id,       // معرف الملف من قوقل درايف
          name: book.title,            // اسم الكتاب كاملاً
          grade: book.gradeDisplay,    // 👈 السطر السحري: تمرير الصف الدراسي (مثل: الأول الثانوي) لتفعيل التقسيم والفلترة
          rawUrl: book.pdfUrl          // الرابط الاحتياطي
        };
      });

      setDriveFiles(prev => ({
        ...prev,
        [currentCategory]: formattedFiles
      }));
    } catch (error) {
      console.error('خطأ في معالجة ملفات الكتب المحلية:', error);
    } finally {
      setLoading(false);
    }
  }, [currentCategory]);
  const handleSelectCategory = (category) => {
    setNavigationStack([...navigationStack, category]);
    setSelectedGrade('all');
  };
  
  const handleGoBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
      setSelectedGrade('all');
    }
  };
  
  const allCategoryFiles = driveFiles[currentCategory] || [];
  // تصفية الكتب ديناميكياً بناءً على الصف المختار، وإذا كان 'all' يعرض القائمة كاملة
  const files = selectedGrade === 'all' 
    ? allCategoryFiles 
    : allCategoryFiles.filter(file => file.grade === selectedGrade);
  
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      direction: 'rtl',
      padding: '0',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* الهيدر العلوي */}
      <header style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        padding: '20px 40px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
         <div 
  onClick={() => {
    setNavigationStack(['main']);
    setSelectedGrade('all');
    if (typeof setSearchTerm === 'function') setSearchTerm(''); // تصفير البحث عند العودة
  }} 
  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
>
  <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>منصة مَنهجي 🏠</h1>
  <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#38bdf8' }}>المكتبة الرقمية للمناهج الدراسية اليمنية</p>
</div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAbout(true)}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              ℹ️ من نحن
            </button>
            <button
              onClick={() => setShowContact(true)}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              📧 تواصل
            </button>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              ⚙️ الإعدادات
            </button>
          </div>
        </div>
      </header>
      
      {/* شريط العودة الذكي */}
      {navigationStack.length > 1 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 40px',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handleGoBack}
            style={{
              padding: '8px 20px',
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#0369a1'}
            onMouseLeave={(e) => e.target.style.background = '#0284c7'}
          >
            ⬅️ رجوع
          </button>
        </div>
      )}
      
      {/* المحتوى الرئيسي */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 40px 80px 40px'
      }}>
        {/* الواجهة الرئيسية: اختيار المراحل */}
        {currentCategory === 'main' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              color: '#1e293b',
              marginBottom: '40px',
              fontSize: '28px',
              fontWeight: '800'
            }}>
              اختر المرحلة الدراسية
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {/* المرحلة الابتدائية */}
              <div
                onClick={() => handleSelectCategory('ابتدائي')}
                style={{
                  padding: '40px 20px',
                  background: '#ffffff',
                  borderTop: '5px solid #0ea5e9',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎒</div>
                <h3 style={{ color: '#0ea5e9', margin: '0 0 10px 0', fontSize: '20px' }}>المرحلة الابتدائية</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>من الصف الأول وحتى الصف الثالث</p>
              </div>
              
              {/* المرحلة الأساسية */}
              <div
                onClick={() => handleSelectCategory('أساسي')}
                style={{
                  padding: '40px 20px',
                  background: '#ffffff',
                  borderTop: '5px solid #f59e0b',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>📚</div>
                <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0', fontSize: '20px' }}>المرحلة الأساسية</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>من الصف الرابع وحتى الصف السادس</p>
              </div>
              
              {/* المرحلة الإعدادية */}
              <div
                onClick={() => handleSelectCategory('إعدادي')}
                style={{
                  padding: '40px 20px',
                  background: '#ffffff',
                  borderTop: '5px solid #8b5cf6',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔬</div>
                <h3 style={{ color: '#8b5cf6', margin: '0 0 10px 0', fontSize: '20px' }}>المرحلة الإعدادية</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>من الصف السابع وحتى الصف التاسع</p>
              </div>
              
              {/* المرحلة الثانوية */}
              <div
                onClick={() => handleSelectCategory('ثانوي')}
                style={{
                  padding: '40px 20px',
                  background: '#ffffff',
                  borderTop: '5px solid #10b981',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎓</div>
                <h3 style={{ color: '#10b981', margin: '0 0 10px 0', fontSize: '20px' }}>المرحلة الثانوية</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>من الصف الأول الثانوي وحتى الثالث الثانوي</p>
              </div>
            </div>
          </div>
        )}
        
        {/* واجهة عرض الملفات */}
        {currentCategory !== 'main' && (
          <div>
            <h2 style={{
              color: '#0f172a',
              marginBottom: '30px',
              fontSize: '24px',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '10px'
            }}>
              كتب المرحلة {
                currentCategory === 'ثانوي' ? 'الثانوية' : 
                currentCategory === 'إعدادي' ? 'الإعدادية' :
                currentCategory === 'أساسي' ? 'الأساسية' : 'الابتدائية'
              }
            </h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                جاري تحميل الملفات...
              </div>
            ) : files.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                لا توجد ملفات متاحة حالياً
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                    }}
                  >
                    <h3 style={{ color: '#0f172a', margin: '0 0 15px 0', fontSize: '16px' }}>
                      📄 {file.name}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <button
                        onClick={() => setViewingFile(file)}
                        style={{
                          padding: '10px 15px',
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#0369a1'}
                        onMouseLeave={(e) => e.target.style.background = '#0284c7'}
                      >
                        👁️ فتح الملف
                      </button>
                      
                      <a
                        href={getGoogleDriveDownloadUrl(file.id)}
                        download
                        style={{
                          padding: '10px 15px',
                          background: '#f1f5f9',
                          color: '#0284c7',
                          border: '2px solid #0284c7',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          textAlign: 'center',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#0284c7';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f1f5f9';
                          e.currentTarget.style.color = '#0284c7';
                        }}
                      >
                        ⬇️ تحميل الملف
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* المودالات */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      
      {/* عارض الملفات */}
      {viewingFile && (
        <FileViewer
          fileId={viewingFile.id}
          fileName={viewingFile.name}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
}

export default App;
