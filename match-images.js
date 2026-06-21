import fs from 'fs';
import path from 'path';

// تحديد مسار البيانات ومجلد الصور
const dataPath = path.resolve('src/booksData_Complete.json');
const imagesFolder = path.resolve('public/books');

const rawData = fs.readFileSync(dataPath, 'utf-8');
const booksData = JSON.parse(rawData);

// استخراج جميع الصور من المجلد
const files = fs.readdirSync(imagesFolder).filter(f => f.match(/\.(webp|jpg|png|jpeg)$/i));

// دالة لتنظيف النصوص من الكلمات الزائدة لمطابقة أدق
const normalize = (str) => str.replace(/\.(pdf|webp|jpg|png|jpeg)$/i, '')
                              .replace(/_/g, ' ')
                              .replace(/كتاب/g, '')
                              .replace(/الطبعة/g, '')
                              .replace(/صنعاء/g, '')
                              .replace(/عدن/g, '')
                              .replace(/اليمن/g, '')
                              .replace(/المنهج/g, '')
                              .trim();

let matchCount = 0;

console.log('⏳ جاري تشغيل خوارزمية المطابقة الذكية للصور...\n');

Object.entries(booksData).forEach(([stage, grades]) => {
  Object.entries(grades).forEach(([grade, books]) => {
    books.forEach((book) => {
      // الكلمات المفتاحية لاسم الكتاب
      const bookStr = normalize(book.name);
      const bookWords = bookStr.split(' ').filter(w => w.length > 2);

      let bestMatch = null;
      let bestScore = 0;

      // البحث عن أقرب صورة تطابق كلمات الكتاب
      files.forEach(file => {
         const fileStr = normalize(file);
         let score = 0;
         bookWords.forEach(w => {
             if(fileStr.includes(w)) score++;
         });
         
         if (score > bestScore) {
             bestScore = score;
             bestMatch = file;
         }
      });

      // إذا وجدنا تطابقاً (على الأقل كلمتين متطابقتين كالـ "الأحياء" و "الأول")
      if (bestMatch && bestScore >= 2) {
         const oldPath = path.join(imagesFolder, bestMatch);
         
         // الحيلة الذكية: حفظ النسخة الجديدة باسم الـ ID وبصيغة jpg لكي يراها التطبيق فوراً
         const newPath = path.join(imagesFolder, `${book.id}.jpg`); 

         try {
            // نستخدم Copy بدلاً من Rename لتجنب إتلاف الصور الأصلية
            fs.copyFileSync(oldPath, newPath);
            matchCount++;
         } catch(e) {
            console.log('حدث خطأ أثناء نسخ الصورة:', bestMatch);
         }
      }
    });
  });
});

console.log(`🎉 اكتمل العمل! تم التعرف على ${matchCount} صورة من أصل 184 وربطها بالكتب بنجاح.`);