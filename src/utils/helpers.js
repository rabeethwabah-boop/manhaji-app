// src/utils/helpers.js

export const cleanBookName = (name) => {
  if (!name) return '';
  return name.replace(/\.pdf$/, '').replace(/_/g, ' ');
};

export const getBookCoverPath = (book) => {
  if (!book || !book.id) return '/books/default-cover.webp';
  return `/books/${book.id}.jpg`;
};

export const sortBooksBySubject = (booksArray, isSecondary = false) => {
  if (!Array.isArray(booksArray)) return []; // حماية ضد البيانات الفارغة

  const officialOrder = [
    "القران", "القرآن", "الاسلامية", "الإسلامية", "الايمان", "الإيمان",
    "الحديث", "السيرة", "الفقه", "لغتي", "القراءة", "العربية", "الادب", "الأدب",
    "النحو", "البلاغة", "الرياضيات", "التفاضل", "الجبر", "الهندسة", "العلوم",
    "الفيزياء", "الكيمياء", "الاحياء", "الأحياء", "الاجتماعيات", "التاريخ",
    "الجغرافيا", "الوطنية", "الانجليزية", "الإنجليزية", "English", "الحاسوب",
    "المجتمع", "الخرائط", "الفلسفة", "النفس"
  ];

  return [...booksArray].sort((a, b) => {
    // 🛡️ حماية: استخدام ? للتأكد من وجود الاسم
    const nameA = (a?.name || "").replace(/_/g, " ");
    const nameB = (b?.name || "").replace(/_/g, " ");

    let indexA = officialOrder.findIndex(subject => nameA.includes(subject));
    let indexB = officialOrder.findIndex(subject => nameB.includes(subject));

    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;

    if (indexA === indexB) {
      const isPartOneA = nameA.includes("الاول") || nameA.includes("الأول") || nameA.includes("الجزء الاول");
      const isPartOneB = nameB.includes("الاول") || nameB.includes("الأول") || nameB.includes("الجزء الاول");
      
      if (isPartOneA && !isPartOneB) return -1;
      if (!isPartOneA && isPartOneB) return 1;
      
      const isSanaaA = nameA.includes("صنعاء");
      const isSanaaB = nameB.includes("صنعاء");
      if (isSanaaA && !isSanaaB) return -1;
      if (!isSanaaA && isSanaaB) return 1;

      return nameA.localeCompare(nameB, 'ar');
    }

    return indexA - indexB;
  });
};