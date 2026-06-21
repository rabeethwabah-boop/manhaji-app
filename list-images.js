import fs from 'fs';

try {
  const files = fs.readdirSync('./public/books');
  console.log('📂 عينة من أسماء الصور الموجودة حالياً في مجلد public/books:');
  console.log('---------------------------------------------------');
  // طباعة أول 15 صورة فقط
  files.slice(0, 15).forEach(file => console.log(file));
  console.log('---------------------------------------------------');
  console.log(`إجمالي عدد الملفات في المجلد: ${files.length}`);
} catch (error) {
  console.log('❌ عذراً، لم أتمكن من العثور على مجلد public/books');
}