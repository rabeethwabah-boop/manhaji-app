import json
import os
import fitz  # مكتبة PyMuPDF

data_path = 'src/booksData_Complete.json'
images_folder = 'public/books'
pdf_source_folder = r'C:\Users\pc\Desktop\المنهج اليمني'

os.makedirs(images_folder, exist_ok=True)

with open(data_path, 'r', encoding='utf-8') as f:
    books_data = json.load(f)

print("🔍 جاري فحص جميع المجلدات الفرعية لجمع ملفات الـ PDF...")

# 1. البحث العميق: جمع مسارات جميع ملفات PDF من كل المجلدات
all_pdfs = {}
for root, dirs, files in os.walk(pdf_source_folder):
    for file in files:
        if file.lower().endswith('.pdf'):
            # حفظ اسم الملف مع مساره الكامل
            all_pdfs[file] = os.path.join(root, file)

print(f"✅ تم العثور على {len(all_pdfs)} ملف PDF في جميع المجلدات.")
print("⏳ بدء عملية استخراج الأغلفة...\n")

def extract_cover(book_name, book_id):
    target_pdf_path = None
    # تنظيف الاسم من الشرطات لتسهيل المطابقة
    clean_book_name = book_name.replace('_', ' ').replace('.pdf', '').strip()

    # 2. مطابقة اسم الكتاب مع قائمة الملفات التي جمعناها
    for pdf_name, pdf_full_path in all_pdfs.items():
        clean_pdf_name = pdf_name.replace('_', ' ').replace('.pdf', '').strip()
        
        # إذا كان الاسم متطابقاً جزئياً
        if clean_pdf_name in clean_book_name or clean_book_name in clean_pdf_name:
            target_pdf_path = pdf_full_path
            break

    if not target_pdf_path:
        print(f"⚠️ لم أجد ملف PDF مطابق للكتاب: {book_name}")
        return False

    try:
        doc = fitz.open(target_pdf_path)
        
        if len(doc) > 0:
            doc.load_page(0).get_pixmap(dpi=150).save(os.path.join(images_folder, f"{book_id}_1.jpg"))
        if len(doc) > 1:
            doc.load_page(1).get_pixmap(dpi=150).save(os.path.join(images_folder, f"{book_id}_2.jpg"))

        print(f"✅ تم الاستخراج: {book_name}")
        return True
    except Exception as e:
        print(f"❌ فشل الاستخراج لـ {book_name}: {str(e)}")
        return False

def process_books():
    target_stage = 'الابتدائية'
    target_grade = 'الأول'

    if target_stage in books_data and target_grade in books_data[target_stage]:
        books = books_data[target_stage][target_grade]
        print(f"📚 جاري معالجة {len(books)} كتاب للصف الثالث الثانوي...\n")

        for book in books:
            extract_cover(book['name'], book['id'])
    else:
        print(f"لم يتم العثور على بيانات لـ {target_grade}")
        
    print("\n🎉 انتهت عملية الاستخراج. تفقد مجلد public/books.")

if __name__ == "__main__":
    process_books()