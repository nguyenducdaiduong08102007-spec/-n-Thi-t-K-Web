// MODAL & QUIZ CONTROLS
function openBookingModal(serviceName = 'Đăng ký nhận ưu đãi 7 ngày') {
    document.getElementById('selectedServiceInput').value = serviceName;
    document.getElementById('bookingModal').classList.remove('hidden');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.add('hidden');
}

function openQuizModal() {
    document.getElementById('quizModal').classList.remove('hidden');
}

function closeQuizModal() {
    document.getElementById('quizModal').classList.add('hidden');
}

function nextQuizStep(selectedGoal) {
    closeQuizModal();
    openBookingModal(`Tư vấn lộ trình: ${selectedGoal}`);
}

function handleBookingSubmit(event) {
    event.preventDefault();
    alert('🎉 Đăng ký thành công! Đội ngũ The Ocean Gym sẽ gọi điện tư vấn cho bạn trong vòng 15 phút.');
    closeBookingModal();
}