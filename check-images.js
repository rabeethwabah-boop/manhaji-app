// check-images.js
import fs from 'fs';
import path from 'path';

// مسار ملف البيانات ومسار مجلد الصور
const dataPath = path.resolve('src/booksData_Complete.json');
const imagesFolder = path.resolve('public/books');

const rawData = fs.readFileSync(dataPath, 'utf-8');
const booksData = JSON.parse(rawData);

let missingCount = 0;
let totalBooks = 0;

console.log('🔍 جاري فحص صور الأغلفة...\n');
console.log('-----------------------------------------');

Object.entries(booksData).forEach(([stage, grades]) => {
  Object.entries(grades).forEach(([grade, books]) => {
    books.forEach((book) => {
      totalBooks++;
      // مسار الصورة المفترض
      const expectedImagePath = path.join(imagesFolder, `${book.id}.jpg`); 
      const expectedImagePathPng = path.join(imagesFolder, `${book.id}.png`);
      const expectedImageName = path.join(imagesFolder, `${book.name}.jpg`);

      // التحقق هل الصورة موجودة بأي من هذه الأسماء؟
      if (!fs.existsSync(expectedImagePath) && !fs.existsSync(expectedImagePathPng) && !fs.existsSync(expectedImageName)) {
        console.log(`❌ مفقودة: [${stage} - ${grade}] -> اسم الكتاب: ${book.name}`);
        missingCount++;
      }
    });
  });
});

console.log('-----------------------------------------');
console.log(`📊 النتيجة: من أصل ${totalBooks} كتاب، هناك ${missingCount} صورة مفقودة أو اسمها خاطئ.`);