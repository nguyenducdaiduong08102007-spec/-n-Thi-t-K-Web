const ADMIN_EMAIL = 'admin@theocean.com';
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'theOceanAdminSession';
const DATA_KEY = 'theOceanAdminData';

const defaultData = {
    members: [
        { name: 'Nguyễn Văn Anh', package: 'Premium 12M', joined: '2026-09-14', value: 4800000 },
        { name: 'Trần Thị Lệ', package: 'Classic 6M', joined: '2026-09-11', value: 2600000 },
        { name: 'Đặng Minh Khoa', package: 'Private PT 3M', joined: '2026-09-08', value: 7800000 },
        { name: 'Hoàng Phúc', package: 'Premium 12M', joined: '2026-09-02', value: 4800000 },
        { name: 'Lê Kim Ngân', package: 'Flex 1M', joined: '2026-08-29', value: 1350000 }
    ],
    revenueByMonth: [
        { month: 'Jan', amount: 42000000 },
        { month: 'Feb', amount: 45000000 },
        { month: 'Mar', amount: 51800000 },
        { month: 'Apr', amount: 56500000 },
        { month: 'May', amount: 61000000 },
        { month: 'Jun', amount: 64500000 }
    ],
    packageStats: [
        { name: 'Premium 12M', count: 54, percent: 78 },
        { name: 'Private PT 3M', count: 23, percent: 58 },
        { name: 'Classic 6M', count: 18, percent: 44 },
        { name: 'Flex 1M', count: 14, percent: 32 }
    ]
};

const loginScreen = document.getElementById('login-screen');
const adminScreen = document.getElementById('admin-screen');
const loginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');
const membersTable = document.getElementById('membersTable');
const revenueChart = document.getElementById('revenueChart');
const packageList = document.getElementById('packageList');

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
}

function getStoredData() {
    const savedData = localStorage.getItem(DATA_KEY);
    if (!savedData) {
        localStorage.setItem(DATA_KEY, JSON.stringify(defaultData));
        return JSON.parse(JSON.stringify(defaultData));
    }
    return JSON.parse(savedData);
}

function setSession(value) {
    localStorage.setItem(SESSION_KEY, String(value));
}

function isAuthenticated() {
    return localStorage.getItem(SESSION_KEY) === 'true';
}

function renderRevenueChart(data) {
    const max = Math.max(...data.map(item => item.amount));
    revenueChart.innerHTML = data.map(item => {
        const percentage = (item.amount / max) * 100;
        return `
            <div class="bar-column">
                <div class="bar-wrap">
                    <div class="bar" style="height: ${percentage}%"></div>
                </div>
                <div class="bar-value">${formatCurrency(item.amount)}</div>
                <div class="bar-label">${item.month}</div>
            </div>
        `;
    }).join('');
}

function renderMembers(data) {
    membersTable.innerHTML = data.members.slice(0, 5).map(member => `
        <tr>
            <td>${member.name}</td>
            <td><span class="tag">${member.package}</span></td>
            <td>${member.joined}</td>
            <td>${formatCurrency(member.value)}</td>
        </tr>
    `).join('');
}

function renderPackages(data) {
    packageList.innerHTML = data.packageStats.map(pkg => `
        <div class="package-item">
            <div class="package-row">
                <span>${pkg.name}</span>
                <strong>${pkg.count} người</strong>
            </div>
            <div class="progress"><span style="width: ${pkg.percent}%"></span></div>
        </div>
    `).join('');
}

function renderDashboard() {
    const data = getStoredData();

    const totalRevenue = data.revenueByMonth.reduce((sum, item) => sum + item.amount, 0);
    const membersCount = data.members.length;
    const activeRate = Math.round((membersCount / (membersCount + 6)) * 100);
    const todayBookings = 12;

    document.getElementById('monthlyRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('activeMembers').textContent = String(membersCount);
    document.getElementById('retention').textContent = `${activeRate}%`;
    document.getElementById('todayBookings').textContent = String(todayBookings);

    renderRevenueChart(data.revenueByMonth);
    renderMembers(data);
    renderPackages(data);
}

function showLoginScreen() {
    loginScreen.classList.remove('hidden');
    adminScreen.classList.add('hidden');
}

function showAdminScreen() {
    loginScreen.classList.add('hidden');
    adminScreen.classList.remove('hidden');
    renderDashboard();
}

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setSession(true);
        loginError.style.display = 'none';
        showAdminScreen();
        return;
    }

    loginError.style.display = 'block';
});

document.getElementById('logout-btn').addEventListener('click', function () {
    setSession(false);
    showLoginScreen();
});

document.getElementById('add-revenue-btn').addEventListener('click', function () {
    const amount = Number(window.prompt('Nhập số tiền doanh thu mới (VNĐ):', '2500000'));
    if (!amount || amount <= 0) return;

    const data = getStoredData();
    const lastMonth = data.revenueByMonth[data.revenueByMonth.length - 1];
    lastMonth.amount += amount;

    localStorage.setItem(DATA_KEY, JSON.stringify(data));
    renderDashboard();
});

if (isAuthenticated()) {
    showAdminScreen();
} else {
    showLoginScreen();
}
