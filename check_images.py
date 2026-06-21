import json
import os

data_path = 'src/booksData_Complete.json'
images_folder = 'public/books'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

existing_images = os.listdir(images_folder)
print("🔍 فحص تطابق الصور مع البيانات للصف الثاني الثانوي:\n")

target_stage = 'الثانوية'
target_grade = 'الثاني الثانوي'

if target_stage in data and target_grade in data[target_stage]:
    for book in data[target_stage][target_grade]:
        # جلب الـ ID، وإذا لم يكن موجوداً نطبع تحذيراً
        book_id = book.get('id', 'بدون_ID')
        image_name = f"{book_id}.jpg"
        
        if image_name not in existing_images:
            print(f"❌ مفقودة: {book['name']} (يبحث عن صورة باسم: {image_name})")
        else:
            print(f"✅ موجودة: {book['name']}")
else:
    print("خطأ في قراءة بيانات الصف.")