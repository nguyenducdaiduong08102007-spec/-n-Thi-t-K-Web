// FLOORS SHOWCASE DATA & LOGIC
const floorsData = [
    {
        title: "Tầng 1: Khu Khởi Động & Cardio Đa Năng",
        badge: "FLOOR 01",
        img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
        desc: "Sở hữu hệ thống máy chạy Technogym cao cấp, khu vực giãn cơ, quầy Refuel Bar tiếp năng lượng.",
        features: ["Máy Cardio đo chỉ số tim mạch thông minh", "Refuel Bar phục vụ Whey Protein & Cold Brew"]
    },
    {
        title: "Tầng 2: Heavy Lifting & Free Weights Zone",
        badge: "FLOOR 02",
        img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        desc: "Trang bị tạ đơn Rogue, Squat Racks, máy tập cơ chuyên sâu chuẩn Olympic cho dân tập tạ nặng.",
        features: ["Khu vực Powerlifting chuyên nghiệp", "Hệ thống sàn giảm chấn cao su 30mm"]
    },
    {
        title: "Tầng 3: Private Coaching VIP (1 kèm 1)",
        badge: "FLOOR 03",
        img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        desc: "Tầng tập hoàn toàn riêng tư cho khách hàng Private 1:1, không lo bị soi xét hay làm phiền.",
        features: ["100% Không gian riêng tư dành riêng cho PT 1:1", "Trang thiết bị nắn chỉnh cột sống chuyên dụng"]
    },
    {
        title: "Tầng 4: Recovery, Sauna & Locker Cao Cấp",
        badge: "FLOOR 04",
        img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
        desc: "Phòng xông hơi đá muối Himalaya, bể ngâm lạnh hồi phục cơ bắp và locker khóa từ bảo mật.",
        features: ["Phòng xông hơi Sauna chuẩn Thụy Điển", "Khu tắm nóng lạnh & khăn tắm miễn phí"]
    }
];

function switchFloor(index) {
    const data = floorsData[index - 1];
    
    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`tab-floor-${i}`);
        btn.classList.remove('active-tab', 'bg-cyan-500', 'text-black', 'font-bold');
        btn.classList.add('bg-white/5', 'text-gray-300');
    }

    const activeBtn = document.getElementById(`tab-floor-${index}`);
    activeBtn.classList.add('active-tab', 'bg-cyan-500', 'text-black', 'font-bold');

    document.getElementById('floor-img').src = data.img;
    document.getElementById('floor-badge').innerText = data.badge;
    document.getElementById('floor-title').innerText = data.title;
    document.getElementById('floor-desc').innerText = data.desc;

    const listHtml = data.features.map(f => `<li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> ${f}</li>`).join('');
    document.getElementById('floor-features').innerHTML = listHtml;
}