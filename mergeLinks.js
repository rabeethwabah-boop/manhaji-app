import fs from 'fs';
import { fileURLToPath } from 'url';
import pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

// تحديد مسارات الملفات تلقائياً
let jsonPath = pathModule.join(__dirname, 'booksData.json');
let csvPath = pathModule.join(__dirname, 'yemeni_books_drive_links.csv');

if (!fs.existsSync(jsonPath) || !fs.existsSync(csvPath)) {
  jsonPath = pathModule.join(__dirname, 'src', 'booksData.json');
  csvPath = pathModule.join(__dirname, 'src', 'yemeni_books_drive_links.csv');
}

function cleanText(text) {
  if (!text) return "";
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/[\s_\-\(\)\/\\\.\'\’\+]+/g, ' ');
  cleaned = cleaned.replace(/[أإآ]/g, 'ا')
                   .replace(/ة/g, 'ه')
                   .replace(/ى/g, 'ي');
  return cleaned.trim();
}

function getEssentialTokens(text) {
  const cleaned = cleanText(text);
  const words = cleaned.split(' ');
  
  const fillerWords = new Set([
    'كتاب', 'الطبعة', 'منهج', 'نشر', 'اليمن', 'نسخة', 'في', 'للصف', 'الصف', 
    'النسخة', 'الجمهورية', 'اليمنية', 'وزارة', 'التربية', 'والتعليم', 'مركز', 
    'المناهج', 'طبعة', 'مطبوع', 'pdf', 'تحميل', 'رابط', 'درايف', 'جوجل', 'و', 'part'
  ]);
  
  const translationMap = {
    'history': 'تاريخ اجتماعيات',
    'geographic': 'جغرافيا اجتماعيات',
    'geography': 'جغرافيا اجتماعيات',
    'social': 'اجتماعيات تاريخ جغرافيا وطنيه',
    'science': 'علوم',
    'mathematics': 'رياضيات',
    'math': 'رياضيات',
    'national': 'وطنيه اجتماعيات',
    'education': 'تربيه',
    'english': 'انجليزي',
    'computer': 'حاسوب',
    'physics': 'فيزياء',
    'chemistry': 'كيمياء',
    'biology': 'احياء',
    'islamic': 'اسلاميه دين تربيه',
    'quran': 'قران كريم'
  };

  let tokens = [];
  words.forEach(w => {
    if (w && !fillerWords.has(w) && isNaN(w)) {
      tokens.push(w);
      if (translationMap[w]) {
        tokens.push(...translationMap[w].split(' '));
      }
    }
  });
  
  // إضافة دعم تبادلي للمواد الاجتماعية والقرآن
  if (cleaned.includes('تاريخ') || cleaned.includes('جغرافيا') || cleaned.includes('وطنيه')) tokens.push('اجتماعيات');
  if (cleaned.includes('قران')) tokens.push('اسلاميه');
  
  return Array.from(new Set(tokens));
}

function extractTraits(text) {
  const cleaned = cleanText(text);
  let grade = null;
  
  if (cleaned.includes('اول ثانوي') || cleaned.includes('1st secondary')) grade = '1_secondary';
  else if (cleaned.includes('ثاني ثانوي') || cleaned.includes('2nd secondary')) grade = '2_secondary';
  else if (cleaned.includes('ثالث ثانوي') || cleaned.includes('3rd secondary')) grade = '3_secondary';
  if (!grade) {
    if (cleaned.includes('اول') || cleaned.includes('1st')) grade = '1_primary';
    else if (cleaned.includes('ثاني') || cleaned.includes('2nd')) grade = '2_primary';
    else if (cleaned.includes('ثالث') || cleaned.includes('3rd')) grade = '3_primary';
    else if (cleaned.includes('رابع') || cleaned.includes('4th')) grade = '4';
    else if (cleaned.includes('خامس') || cleaned.includes('5th') || cleaned.includes('5_')) grade = '5';
    else if (cleaned.includes('سادس') || cleaned.includes('6th') || cleaned.includes('6_')) grade = '6';
    else if (cleaned.includes('سابع') || cleaned.includes('7th')) grade = '7';
    else if (cleaned.includes('ثامن') || cleaned.includes('8th')) grade = '8';
    else if (cleaned.includes('تاسع') || cleaned.includes('9th')) grade = '9';
  }

  let part = null;
  if (cleaned.includes('الجزء الاول') || cleaned.includes('جزء اول') || cleaned.includes('ج1') || cleaned.includes('part1') || cleaned.includes('part 1')) {
    part = 'part_1';
  } else if (cleaned.includes('الجزء الثاني') || cleaned.includes('جزء ثاني') || cleaned.includes('ج2') || cleaned.includes('part2') || cleaned.includes('part 2')) {
    part = 'part_2';
  }

  let branch = null;
  if (cleaned.includes('علمي') || cleaned.includes('scientific') || cleaned.includes('sci')) branch = 'scientific';
  else if (cleaned.includes('ادبي') || cleaned.includes('literary') || cleaned.includes('lit')) branch = 'literary';

  let region = null;
  if (cleaned.includes('صنعاء') || cleaned.includes('sanaa')) region = 'sanaa';
  else if (cleaned.includes('عدن') || cleaned.includes('aden')) region = 'aden';

  return { grade, part, branch, region };
}

try {
  if (!fs.existsSync(jsonPath) || !fs.existsSync(csvPath)) {
    throw new Error("لم يتم العثور على ملف booksData.json أو ملف الـ CSV.");
  }

  const booksData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split(/\r?\n/);

  const csvRows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const firstComma = line.indexOf(',');
    if (firstComma === -1) continue;

    const bookName = line.substring(0, firstComma).trim();
    const driveLink = line.substring(firstComma + 1).trim();

    if (bookName && driveLink) {
      csvRows.push({
        originalName: bookName,
        link: driveLink,
        tokens: getEssentialTokens(bookName),
        traits: extractTraits(bookName)
      });
    }
  }

  let updatedCount = 0;
  const missedBooksList = [];

  booksData.forEach(book => {
    const title = book.title || "";
    const jsonTokens = getEssentialTokens(title);
    const jsonTraits = extractTraits(title);

    let bestMatch = null;
    let bestScore = -1;

    csvRows.forEach(csvItem => {
      const csvTraits = csvItem.traits;

      // قيود صارمة للغاية لمنع خلط الصفوف
      if (jsonTraits.grade && csvTraits.grade && jsonTraits.grade !== csvTraits.grade) return;
      if (jsonTraits.part && csvTraits.part && jsonTraits.part !== csvTraits.part) return;
      if (jsonTraits.branch && csvTraits.branch && jsonTraits.branch !== csvTraits.branch) return;
      if (jsonTraits.region && csvTraits.region && jsonTraits.region !== csvTraits.region) return;

      const tokenSet = new Set(jsonTokens);
      let score = 0;
      csvItem.tokens.forEach(t => {
        if (tokenSet.has(t)) score += 2; // رفع وزن الكلمات المشتركة
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = csvItem;
      }
    });

    // المطابقة بحرية أكبر للمواد العشرة المتبقية
    if (bestMatch && bestScore >= 2) {
      book.pdfUrl = bestMatch.link;
      updatedCount++;
    } else {
      missedBooksList.push({
        id: book.id,
        title: title,
        currentPdfUrl: book.pdfUrl
      });
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(booksData, null, 2), 'utf8');
  
  console.log(`\x1b[32m%s\x1b[0m`, `\n==================================================`);
  console.log(`\x1b[32m%s\x1b[0m`, `✅ تحديث نهائي! تم ربط (${updatedCount}) كتاب بنجاح داخل ملف booksData.json!`);
  console.log(`\x1b[32m%s\x1b[0m`, `==================================================\n`);

  if (missedBooksList.length > 0) {
    console.log(`\x1b[33m%s\x1b[0m`, `⚠️ متبقي فقط (${missedBooksList.length}) كتب لم تتطابق لعدم وجودها الفعلي في ملف الـ CSV.`);
    const missedPath = pathModule.join(pathModule.dirname(jsonPath), 'missed_books.json');
    fs.writeFileSync(missedPath, JSON.stringify(missedBooksList, null, 2), 'utf8');
  } else {
    console.log(`\x1b[35m%s\x1b[0m`, `🎉 أهنئك! تم إنهاء المطابقة بنسبة 100% بنجاح تام! مبروك لـ "منهجي" 🎓✨`);
  }

} catch (error) {
  console.error(`\x1b[31m%s\x1b[0m`, `\n⚠️ حدث خطأ: ${error.message}`);
}