const loginScreen = document.getElementById('login-screen');
const adminScreen = document.getElementById('admin-screen');
const loginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');
const revenueModal = document.getElementById('revenue-modal');
const revenueForm = document.getElementById('revenue-form');
const revenueError = document.getElementById('revenue-error');
const monthFormatter = new Intl.DateTimeFormat('vi-VN', { month: 'short', year: 'numeric' });

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers
        }
    });
    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('Máy chủ trả về dữ liệu không hợp lệ.');
    }
    if (!response.ok) throw new Error(result.error || 'Yêu cầu không thành công.');
    return result;
}

function showLoginScreen(message = '') {
    loginScreen.classList.remove('hidden');
    adminScreen.classList.add('hidden');
    loginError.textContent = message;
    loginError.style.display = message ? 'block' : 'none';
}

function showAdminScreen() {
    loginScreen.classList.add('hidden');
    adminScreen.classList.remove('hidden');
}

function renderRevenueChart(months) {
    const chart = document.getElementById('revenueChart');
    chart.replaceChildren();
    const maximum = Math.max(0, ...months.map((item) => item.amount));

    for (const item of months) {
        const monthDate = new Date(`${item.month}-01T12:00:00`);
        const column = document.createElement('div');
        column.className = 'bar-column';
        const wrap = document.createElement('div');
        wrap.className = 'bar-wrap';
        const bar = document.createElement('div');
        bar.className = 'bar';
        const percentage = maximum > 0 ? (item.amount / maximum) * 100 : 0;
        bar.style.height = `${percentage}%`;
        if (item.amount === 0) bar.style.minHeight = '0';
        bar.setAttribute('aria-label', `${monthFormatter.format(monthDate)}: ${formatCurrency(item.amount)}`);
        wrap.appendChild(bar);

        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = formatCurrency(item.amount);
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = monthFormatter.format(monthDate);
        column.append(wrap, value, label);
        chart.appendChild(column);
    }
}

function renderRegistrations(registrations) {
    const body = document.getElementById('registrationsTable');
    body.replaceChildren();

    if (!registrations.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'Chưa có yêu cầu tư vấn nào.';
        row.appendChild(cell);
        body.appendChild(row);
        return;
    }

    for (const registration of registrations) {
        const row = document.createElement('tr');
        const name = document.createElement('td');
        name.textContent = registration.name;
        const goal = document.createElement('td');
        goal.textContent = goalLabel(registration.goal);
        const phoneCell = document.createElement('td');
        const phone = document.createElement('a');
        phone.href = `tel:${registration.phone}`;
        phone.textContent = registration.phone;
        phoneCell.appendChild(phone);
        const date = document.createElement('td');
        date.textContent = new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(new Date(registration.submittedAt));
        row.append(name, goal, phoneCell, date);
        body.appendChild(row);
    }
}

function goalLabel(goal) {
    const labels = {
        fat_loss: 'Giảm mỡ',
        muscle_gain: 'Tăng cơ',
        general_health: 'Sức khỏe tổng thể',
        cardio: 'Chạy bộ / cardio',
        unspecified: 'Chưa ghi mục tiêu'
    };
    return labels[goal] || goal || labels.unspecified;
}

function renderGoals(goals) {
    const list = document.getElementById('packageList');
    list.replaceChildren();

    if (!goals.length) {
        const empty = document.createElement('p');
        empty.className = 'stat-meta';
        empty.textContent = 'Chưa có dữ liệu mục tiêu.';
        list.appendChild(empty);
        return;
    }

    const maximum = Math.max(1, ...goals.map((item) => item.count));
    for (const item of goals) {
        const row = document.createElement('div');
        row.className = 'package-item';
        const summary = document.createElement('div');
        summary.className = 'package-row';
        const title = document.createElement('span');
        title.textContent = goalLabel(item.goal);
        const count = document.createElement('strong');
        count.textContent = `${item.count} yêu cầu`;
        summary.append(title, count);

        const progress = document.createElement('div');
        progress.className = 'progress';
        const bar = document.createElement('span');
        bar.style.width = `${(item.count / maximum) * 100}%`;
        progress.appendChild(bar);
        row.append(summary, progress);
        list.appendChild(row);
    }
}

async function renderDashboard() {
    const data = await apiRequest('/api/admin/dashboard');
    document.getElementById('monthlyRevenue').textContent = formatCurrency(data.revenueCurrentMonth);
    document.getElementById('registrationCount').textContent = String(data.registrationsTotal);
    document.getElementById('todayRegistrations').textContent = String(data.registrationsToday);
    const now = new Date();
    document.getElementById('currentMonthLabel').textContent = new Intl.DateTimeFormat('vi-VN', {
        month: 'long',
        year: 'numeric'
    }).format(now);
    document.getElementById('chart-period').textContent =
        `${monthFormatter.format(new Date(`${data.revenueByMonth[0].month}-01T12:00:00`))} – ${monthFormatter.format(now)}`;
    renderRevenueChart(data.revenueByMonth);
    renderRegistrations(data.recentRegistrations);
    renderGoals(data.registrationGoals);
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    loginError.style.display = 'none';
    try {
        await apiRequest('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({
                email: document.getElementById('admin-email').value.trim(),
                password: document.getElementById('admin-password').value
            })
        });
        loginForm.reset();
        showAdminScreen();
        await renderDashboard();
    } catch (error) {
        showLoginScreen(error.message);
    } finally {
        submit.disabled = false;
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await apiRequest('/api/admin/logout', { method: 'POST' });
        showLoginScreen();
    } catch (error) {
        showLoginScreen(error.message);
    }
});

document.getElementById('add-revenue-btn').addEventListener('click', () => {
    revenueError.style.display = 'none';
    revenueError.textContent = '';
    revenueForm.reset();
    revenueModal.classList.remove('hidden');
    document.getElementById('revenue-amount').focus();
});

function closeRevenueModal() {
    revenueModal.classList.add('hidden');
}

document.getElementById('cancel-revenue-btn').addEventListener('click', closeRevenueModal);
revenueModal.addEventListener('click', (event) => {
    if (event.target === revenueModal) closeRevenueModal();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeRevenueModal();
});

revenueForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = revenueForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    revenueError.style.display = 'none';
    try {
        await apiRequest('/api/admin/revenue', {
            method: 'POST',
            body: JSON.stringify({ amount: Number(revenueForm.elements.amount.value) })
        });
        closeRevenueModal();
        await renderDashboard();
    } catch (error) {
        revenueError.textContent = error.message;
        revenueError.style.display = 'block';
    } finally {
        submit.disabled = false;
    }
});

(async function initializeAdmin() {
    try {
        const session = await apiRequest('/api/admin/session');
        if (!session.authenticated) {
            showLoginScreen();
            return;
        }
        showAdminScreen();
        await renderDashboard();
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            showLoginScreen('Không kết nối được máy chủ. Hãy khởi động server.ps1.');
            return;
        }
        showLoginScreen();
    }
})();
