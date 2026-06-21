import os

images_folder = 'public/books'
count = 0

print("⏳ جاري تنظيف أسماء الصور...\n")

for filename in os.listdir(images_folder):
    if filename.endswith('_1.jpg') or filename.endswith('_2.jpg'):
        new_name = filename.replace('_1.jpg', '.jpg').replace('_2.jpg', '.jpg')
        old_path = os.path.join(images_folder, filename)
        new_path = os.path.join(images_folder, new_name)
        
        # التأكد من أن الملف بالاسم الجديد غير موجود مسبقاً لتجنب الخطأ
        if os.path.exists(new_path):
            print(f"⚠️ تنبيه: تم تجاوز '{filename}' لأن الاسم النهائي موجود بالفعل (يبدو أن هناك نسختين).")
        else:
            os.rename(old_path, new_path)
            count += 1

print(f"\n✅ اكتمل العمل! تم تعديل أسماء {count} غلاف لتصبح جاهزة للتطبيق.")