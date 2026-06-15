import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, unquote

# 1. روابط المراحل الدراسية الأساسية بـ بوابة المنهج
STAGES = {
    "المرحلة_الابتدائية": "https://yembooks.com/books/stage-primary",
    "المرحلة_الاساسية": "https://yembooks.com/books/stage-basic",
    "المرحلة_الاعدادية": "https://yembooks.com/books/stage-preparatory",
    "المرحلة_الثانوية": "https://yembooks.com/books/stage-secondary"
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_filename(filename):
    """تطهير وتنظيف اسم الملف بالكامل من الأسطر الجديدة، الرموز، والمسافات الزائدة لمنع أخطاء نظام التشغيل"""
    if not filename:
        return "كتاب_مدرسي"
    
    # 1. استبدال الأسطر الجديدة والرجوع بمسافات عادية
    filename = filename.replace('\n', ' ').replace('\r', ' ')
    
    # 2. إزالة الرموز الممنوعة في نظام ويندوز
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    
    # 3. دمج المسافات المتعددة لتصبح مسافة واحدة وتنظيف الأطراف
    filename = " ".join(filename.split())
    
    # 4. تقصير الاسم إذا كان طويلًا جدًا ومبعثراً لتفادي مشاكل نظام ويندوز
    if len(filename) > 70:
        filename = filename[:70].strip()
        
    return filename

def download_file(url, folder_path, title):
    """تحميل الملف الفعلي وحفظه بصيغة PDF داخل مجلد المرحلة"""
    clean_title = clean_filename(title)
    if not clean_title.endswith('.pdf'):
        clean_title += '.pdf'
        
    file_path = os.path.join(folder_path, clean_title)
    
    if os.path.exists(file_path):
        print(f"   [موجود مسبقاً] تم تخطي: {clean_title}")
        return True

    try:
        print(f"   [جاري التحميل الفعلي...] {clean_title}")
        response = requests.get(url, headers=HEADERS, stream=True, timeout=40)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            print(f"   ✅ تم تحميل المادة بنجاح!")
            return True
        else:
            print(f"   ❌ فشل تحميل الملف، رمز الاستجابة: {response.status_code}")
    except Exception as e:
        print(f"   ❌ خطأ أثناء سحب الملف: {e}")
    return False

def scrape_and_download():
    print("🚀 بدء تشغيل محرك التحميل الذكي (نسخة مطهرة الأسماء)...")
    
    main_folder = "الكتب_المدرسية_اليمنية"
    os.makedirs(main_folder, exist_ok=True)

    for stage_name, stage_url in STAGES.items():
        print(f"\n================ [{stage_name}] ================")
        stage_folder = os.path.join(main_folder, stage_name)
        os.makedirs(stage_folder, exist_ok=True)
            
        page = 1
        while True:
            current_url = f"{stage_url}/page/{page}" if page > 1 else stage_url
            print(f"🔍 فحص الصفحة {page} واستخراج الروابط المبطنة...")
            
            try:
                response = requests.get(current_url, headers=HEADERS, timeout=15)
                if response.status_code != 200:
                    print("🏁 تم الانتهاء من فحص صفحات هذه المرحلة.")
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                links = soup.find_all('a')
                
                detected_books = []
                for link in links:
                    href = link.get('href', '').strip()
                    full_link = urljoin(stage_url, href)
                    if '/item/' in href:
                        # أخذ النص المبدئي للكتاب
                        title = link.text.strip() or link.get('title', '').strip()
                        detected_books.append((full_link, title))
                
                # إزالة التكرار
                seen = set()
                unique_books = []
                for fl, t in detected_books:
                    if fl not in seen:
                        seen.add(fl)
                        unique_books.append((fl, t))
                
                if not unique_books:
                    print("🏁 لا توجد كتب أخرى في هذه المرحلة.")
                    break
                    
                print(f"📦 وجدنا {len(unique_books)} كتاب في الصفحة {page}. جاري الدخول وتطهير الأسماء للتحميل...")
                
                for book_url, book_title in unique_books:
                    # إذا كان الاسم المستخرج مبعثراً جداً أو فارغاً نعتمد على اسم الرابط كبديل احتياطي
                    if not book_title or len(book_title) < 5:
                        book_title = unquote(book_url.split('/')[-1])
                        
                    try:
                        item_resp = requests.get(book_url, headers=HEADERS, timeout=15)
                        if item_resp.status_code == 200:
                            item_soup = BeautifulSoup(item_resp.text, 'html.parser')
                            inner_links = item_soup.find_all('a')
                            
                            download_url = None
                            for ilink in inner_links:
                                ihref = ilink.get('href', '').strip()
                                itext = ilink.text.strip().lower()
                                i_full = urljoin(book_url, ihref)
                                
                                if '.pdf' in i_full.lower() or any(k in itext for k in ['تحميل', 'تحميل الكتاب', 'ملف', 'download', 'pdf']):
                                    if not any(x in ihref for x in ['/terms', '/privacy', '/books', '/explorer', 'stage-']):
                                        download_url = i_full
                                        break
                            
                            if download_url:
                                download_file(download_url, stage_folder, book_title)
                                time.sleep(1) # حماية من الحظر
                            else:
                                print(f"   ⚠️ تعذر العثور على زر تحميل مباشر لكتاب: {clean_filename(book_title)}")
                                
                    except Exception as e:
                        print(f"   ❌ خطأ في معالجة صفحة الكتاب: {e}")
                        
                page += 1
                
            except Exception as e:
                print(f"❌ حدث خطأ غير متوقع: {e}")
                break

    print("\n🎉 تم اكتمال تحميل كافة الكتب المدرسية بنجاح تام وتصنيفها بمجلدات مشروعك!")

if __name__ == "__main__":
    scrape_and_download()