# تعيين المسار
$sourcePath = "public\books"
$files = Get-ChildItem -Path $sourcePath -Filter *.webp

# تحميل بيانات الكتب من المرجع
$booksData = Get-Content "booksData_Complete.json" | ConvertFrom-Json

Write-Host "بدء عملية إعادة التسمية التلقائية بناءً على booksData_Complete.json..." -ForegroundColor Cyan

foreach ($file in $files) {
    $fileName = $file.Name
    $bestMatch = $null
    $maxMatches = 0

    foreach ($book in $booksData) {
        # keywords موجودة في كل كائن من json مثل: "keywords": ["الأحياء", "الأول", "ثانوي"]
        if ($null -eq $book.keywords -or $book.keywords.Count -eq 0) { continue }
        $matches = 0
        foreach ($kw in $book.keywords) {
            if ($fileName -like "*$kw*") {
                $matches++
            }
        }
        if ($matches -gt $maxMatches) {
            $maxMatches = $matches
            $bestMatch = $book
        }
    }

    if ($bestMatch -and $maxMatches -ge 2) { # على الأقل تطابق كلمتين لضمان التطابق
        $newName = $bestMatch.targetName
        if (-not ($newName -like "*.webp")) {
            $newName = "$newName.webp"
        }
        Rename-Item -Path $file.FullName -NewName $newName -ErrorAction SilentlyContinue
        Write-Host "تم بنجاح: $($file.Name) → $newName" -ForegroundColor Green
    }
    else {
        Write-Host "لم يُطابق: $($file.Name)" -ForegroundColor Yellow
    }
}
Write-Host "اكتملت العملية!" -ForegroundColor Cyan