import os
import json

# المسار الذي توجد به الكتب الآن داخل public
BOOKS_DIR = os.path.join('public', 'الكتب_المدرسية_اليمنية')
OUTPUT_JSON = os.path.join('src', 'booksData.json')

def get_book_priority(title):
    if 'القرآن' in title or 'قرآن' in title: return 0
    if 'اللغة العربية' in title or 'العربية' in title: return 1
    if 'الرياضيات' in title: return 2
    if 'العلوم' in title or 'الفيزياء' in title or 'الكيمياء' in title or 'الأحياء' in title: return 3
    if 'الاجتماعيات' in title or 'التاريخ' in title or 'الجغرافيا' in title: return 4
    if 'الإنجليزية' in title or 'الانجليزية' in title: return 5
    if 'التربية' in title or 'الإسلامية' in title or 'الوطنية' in title: return 6
    return 100

def generate_database():
    if not os.path.exists(BOOKS_DIR):
        print(f"❌ لم يتم العثور على المجلد في المسار: {BOOKS_DIR}")
        return

    all_books = []
    counter = 1

    # الفولدرات الفرعية للمراحل
    stages_mapping = {
        'المرحلة_الابتدائية': {'category': 'ابتدائي', 'categoryEn': 'primary'},
        'المرحلة_الاساسية': {'category': 'أساسي', 'categoryEn': 'intermediate'},
        'المرحلة_الاعدادية': {'category': 'إعدادي', 'categoryEn': 'preparatory'},
        'المرحلة_الثانوية': {'category': 'ثانوي', 'categoryEn': 'secondary'}
    }

    for stage_folder, meta in stages_mapping.items():
        stage_path = os.path.join(BOOKS_DIR, stage_folder)
        if not os.path.exists(stage_path):
            continue

        for filename in os.listdir(stage_path):
            if filename.endswith('.pdf'):
                # تنظيف الاسم للعرض
                title = filename.replace('.pdf', '')
                
                # تخمين الصف
                grade_display = "أخرى"
                if "الأول الثانوي" in filename or "الاول الثانوي" in filename: grade_display = "الأول الثانوي"
                elif "الثاني الثانوي" in filename: grade_display = "الثاني الثانوي"
                elif "الثالث الثانوي" in filename: grade_display = "الثالث الثانوي"
                elif "التاسع" in filename: grade_display = "التاسع"
                elif "الثامن" in filename: grade_display = "الثامن"
                elif "السابع" in filename: grade_display = "السابع"
                elif "السادس" in filename: grade_display = "السادس"
                elif "الخامس" in filename: grade_display = "الخامس"
                elif "الرابع" in filename: grade_display = "الرابع"
                elif "الثالث" in filename: grade_display = "الثالث"
                elif "الثاني" in filename: grade_display = "الثاني"
                elif "الأول" in filename: grade_display = "الأول"

                # تحديد الرابط المباشر للـ PDF لتصفحه وتحميله
                pdf_url = f"/الكتب_المدرسية_اليمنية/{stage_folder}/{filename}"

                all_books.append({
                    "id": counter,
                    "title": title,
                    "category": meta['category'],
                    "categoryEn": meta['categoryEn'],
                    "gradeDisplay": grade_display,
                    "pdfUrl": pdf_url,
                    "priority": get_book_priority(title)
                })
                counter += 1

    # ترتيب الكتب حسب الأولوية المحددة للمواد
    all_books.sort(key=lambda x: (x['priority'], x['title']))

    # التأكد من وجود مجلد src وحفظ الملف بداخله
    os.makedirs('src', exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)

    print(f"✅ تم بنجاح إنشاء قاعدة البيانات وتجهيز {len(all_books)} كتاباً في ملف: {OUTPUT_JSON}")

if __name__ == '__main__':
    generate_database()