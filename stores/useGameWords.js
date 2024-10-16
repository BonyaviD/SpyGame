import { defineStore } from "pinia";
import { ref } from "vue";
export const useGameWords = defineStore("words", () => {

    const persianWords = [
        "هتل",
        "هواپیما",
        "آسمان",
        "توپ",
        "پنیر",
        "پیاز",
        "کتاب",
        "صندلی",
        "مداد",
        "ماشین",
        "میز",
        "خانه",
        "آب",
        "نان",
        "دوچرخه",
        "ساعت",
        "دست",
        "پا",
        "چشم",
        "گوش",
        "دریا",
        "کوه",
        "رود",
        "جنگل",
        "درخت",
        "خورشید",
        "ماه",
        "ستاره",
        "گل",
        "باران",
        "باد",
        "برف",
        "کویر",
        "پروانه",
        "سیب",
        "گلابی",
        "موز",
        "نارنگی",
        "پرتقال",
        "تلفن",
        "رادیو",
        "تلویزیون",
        "کامپیوتر",
        "لپتاپ",
        "کیبورد",
        "ماوس",
        "پنجره",
        "دیوار",
        "در",
        "آینه",
        "یخچال",
        "فرش",
        "لباس",
        "کفش",
        "کلاه",
        "شال",
        "دستکش",
        "کت",
        "پیراهن",
        "شلوار",
        "جوراب",
        "چتر",
        "قاشق",
        "چنگال",
        "چاقو",
        "بشقاب",
        "لیوان",
        "کتابخانه",
        "موزه",
        "سینما",
        "تئاتر",
        "بیمارستان",
        "داروخانه",
        "مدرسه",
        "دانشگاه",
        "کتابفروشی",
        "فروشگاه",
        "بازار",
        "نانوایی",
        "قنادی",
        "رستوران",
        "کافه",
        "پمپ‌بنزین",
        "ایستگاه",
        "قطار",
        "اتوبوس",
        "تاکسی",
        "مترو",
        "کشتی",
        "چراغ",
        "مبل",
        "تخت",
        "بالش",
        "پتو",
        "ملافه",
        "کاغذ",
        "دفتر",
        "پاکت",
        "نامه",
        "تمبر",
        "خودکار",
        "روغن",
        "شکر",
        "نمک",
        "فلفل",
        "برنج",
        "ماکارونی",
        "پیتزا",
        "ساندویچ",
        "سالاد",
        "سوپ",
        "چای",
        "قهوه",
        "آبمیوه",
        "نوشابه",
        "یخ",
        "شیر",
        "ماست",
        "کره",
        "خامه",
        "بستنی",
        "شکلات",
        "کیک",
        "بیسکویت",
        "آجیل",
        "بادام",
        "فندق",
        "گردو",
        "پسته",
        "تخمه",
        "کشمش",
        "خرما",
        "زیتون",
        "عسل",
        "مربا",
        "ترشی",
        "سس",
        "نخود",
        "عدس",
        "لوبیا",
        "بادمجان",
        "سیب‌زمینی",
        "گوجه‌فرنگی",
        "خیار",
        "هویج",
        "کاهو",
        "کلم",
        "سبزی",
        "جعفری",
        "گشنیز",
        "نعناع",
        "ریحان",
        "شاهی",
        "ترخون",
        "شنبلیله",
        "هندوانه",
        "خربزه",
        "طالبی",
        "انگور",
        "توت",
        "توت‌فرنگی",
        "آلبالو",
        "گیلاس",
        "زردآلو",
        "هلو",
        "شلیل",
        "آلو",
        "انار",
        "کیوی",
        "آناناس",
        "نارگیل",
        "انجیر",
        "زیتون",
        "بلوط",
        "پسته",
        "کنجد",
        "ذرت",
        "گندم",
        "جو",
        "سبوس",
        "آرد",
        "پودر",
        "شیره",
        "کچاپ",
        "سس مایونز",
        "خردل",
        "کچاپ",
        "نمک",
        "فلفل"
    ]

    const wordGame = ref('')
    
    const getRandomWord = () => {

        const randomIndex = Math.floor(Math.random() * persianWords.length);
        wordGame.value = persianWords[randomIndex];
    }

    const resetWord = ()=> {
        wordGame.value = ''
    }
    
    return { persianWords, wordGame, getRandomWord, resetWord }
})

