import fs from 'fs';
import path from 'path';

// تحديد المسارات المحتملة لملف الـ JSON
const possibleJsonPaths = [
    path.join(process.cwd(), 'booksData_Complete.json'),
    path.join(process.cwd(), 'src', 'booksData_Complete.json'),
    path.join(process.cwd(), 'src', 'data', 'booksData_Complete.json')
];

let jsonPath = null;

// البحث عن الملف في المسارات المحتملة
for (const p of possibleJsonPaths) {
    if (fs.existsSync(p)) {
        jsonPath = p;
        break;
    }
}

const imagesDir = path.join(process.cwd(), 'public', 'books');

// 1. التحقق النهائي من وجود الملفات
if (!jsonPath) {
    console.error("\n❌ خطأ قاتل: لم نجد ملف 'booksData_Complete.json' في المجلد الرئيسي ولا داخل src أو src/data!");
    console.log("💡 الحل: يرجى التأكد من إنشاء الملف يدويًا ونقل البيانات النظيفة إليه أولاً.");
    process.exit(1);
}

if (!fs.existsSync(imagesDir)) {
    console.error(`\n❌ خطأ: مجلد الصور غير موجود في المسار: ${imagesDir}`);
    process.exit(1);
}

console.log(`\n🎯 تم العثور على ملف البيانات بنجاح في المسار:\n📍 ${jsonPath}\n`);

// 2. قراءة أسماء صور webp الحقيقية من الهاردسك
const realImages = fs.readdirSync(imagesDir).filter(file => file.endsWith('.webp'));
let booksData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 3. دالة البحث الذكي عن الصورة بناءً على الكلمات المفتاحية
function findBestImage(pdfName) {
    const keywords = pdfName.replace('.pdf', '').split('_')
        .filter(word => word.length > 2 && word !== 'كتاب' && word !== 'الطبعة');

    let bestMatch = null;
    let maxMatches = 0;

    for (const img of realImages) {
        let matches = 0;
        keywords.forEach(word => {
            const normalizedWord = word.replace(/^ل+/, ''); 
            if (img.includes(normalizedWord)) {
                matches++;
            }
        });

        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = img;
        }
    }

    return maxMatches >= 3 ? `/books/${bestMatch}` : `/books/default-cover.webp`;
}

// 4. المرور على كافة المراحل والصفوف داخل الـ JSON وتحديثها
let updatedCount = 0;
for (const phase in booksData) {
    for (const grade in booksData[phase]) {
        booksData[phase][grade] = booksData[phase][grade].map(book => {
            book.image = findBestImage(book.name);
            if (book.image !== `/books/default-cover.webp`) {
                updatedCount++;
            }
            return book;
        });
    }
}

// 5. حفظ الملف النهائي في مكانه الصحيح الذي عثرنا عليه
fs.writeFileSync(jsonPath, JSON.stringify(booksData, null, 2), 'utf8');
console.log(`==================================================`);
console.log(`✅ أتمتة بنجاح! تم ربط ومطابقة (${updatedCount}) كتاب بالصور الحقيقية وبامتداد .webp`);
console.log(`==================================================\n`);