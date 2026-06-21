import json

data_path = 'src/booksData_Complete.json'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# تنظيف التكرارات في قسم الثالث الثانوي
if "الثانوية" in data and "الثالث الثانوي" in data["الثانوية"]:
    books = data["الثانوية"]["الثالث الثانوي"]
    unique_books = []
    seen_ids = set()
    
    for book in books:
        if book['id'] not in seen_ids:
            unique_books.append(book)
            seen_ids.add(book['id'])
    
    data["الثانوية"]["الثالث الثانوي"] = unique_books
    
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"✅ تم التنظيف بنجاح! كان هناك {len(books) - len(unique_books)} تكراراً وتمت إزالتها.")
else:
    print("لم يتم العثور على القسم المطلوب للتنظيف.")