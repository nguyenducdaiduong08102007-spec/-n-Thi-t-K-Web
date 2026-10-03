// BILINGUAL DICTIONARY
const i18n = {
    vi: {
        nav_about: "Về Chúng Tôi",
        nav_modes: "4 Mô Hình",
        nav_programs: "Lộ Trình Tập",
        nav_floors: "4 Tầng Không Gian",
        nav_pricing: "Bảng Giá",
        btn_book_now: "Đăng ký trải nghiệm",
        hero_badge: "RIÊNG TƯ HƠN CHO MỖI BUỔI TẬP",
        hero_title_1: "PRIVATE GYM TẠI TPHCM.",
        hero_desc: "Tập trong một không gian riêng tư, cùng coach thật sự hiểu bạn và một cộng đồng khiến bạn muốn quay lại mỗi ngày.",
        hero_btn_explore: "KHÁM PHÁ THE OCEAN",
        hero_btn_register: "Đăng ký trải nghiệm",
        hero_btn_quiz: "Tìm cách tập phù hợp",
        tag_floors: "KHÔNG GIAN TẬP LUYỆN",
        heading_floors: "4 Tầng Độc Lập - Đẳng Cấp Tại Thủ Đức"
    },
    en: {
        nav_about: "About Us",
        nav_modes: "4 Modes",
        nav_programs: "Programs",
        nav_floors: "4 Floors",
        nav_pricing: "Pricing",
        btn_book_now: "Book Free Trial",
        hero_badge: "MORE PRIVACY FOR EVERY WORKOUT",
        hero_title_1: "PRIVATE GYM IN HCMC.",
        hero_desc: "Train in a private space with a dedicated coach who truly understands your goals.",
        hero_btn_explore: "EXPLORE THE OCEAN",
        hero_btn_register: "Book Free Trial",
        hero_btn_quiz: "Find Your Best Fit",
        tag_floors: "TRAINING FACILITY",
        heading_floors: "4 Premium Floors in Thu Duc"
    }
};

let currentLang = 'vi';

function toggleLanguage() {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    document.getElementById('langText').innerText = currentLang === 'vi' ? 'VI | EN' : 'EN | VI';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            el.innerText = i18n[currentLang][key];
        }
    });
}