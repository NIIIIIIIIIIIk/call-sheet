// Ключи для хранения данных
const STORAGE_KEYS = {
    APP_STATE: 'call_sheet_state',
    ANALYTICS: 'call_sheet_analytics',
    ONBOARDING: 'has_seen_onboarding',
    EASTER_EGGS: 'shown_easter_eggs'
};

// Инициализация аналитики
function initAnalytics() {
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
        const analytics = {
            visits: [],
            totalVisits: 0,
            unlockCount: 0,
            eventsCreated: 0,
            commentsCount: 0,
            devices: {},
            browsers: {},
            os: {},
            dailyStats: {}
        };
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
    }
}

// Получение аналитики
function getAnalytics() {
    initAnalytics();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS));
}

// Сохранение аналитики
function saveAnalytics(analytics) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
}

// Определение устройства
function detectDevice() {
    const ua = navigator.userAgent;
    const mobile = /Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
    const tablet = /Tablet|iPad/i.test(ua);
    const desktop = !mobile && !tablet;
    
    if (tablet) return 'Tablet';
    if (mobile) return 'Mobile';
    return 'Desktop';
}

// Определение браузера
function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Opera')) return 'Opera';
    return 'Other';
}

// Определение ОС
function detectOS() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Other';
}

// Получение IP (через сервис)
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return 'unknown';
    }
}

// Запись визита
async function trackVisit(action = 'visit') {
    const analytics = getAnalytics();
    const today = new Date().toISOString().split('T')[0];
    
    const ip = await getIP();
    const device = detectDevice();
    const browser = detectBrowser();
    const os = detectOS();
    
    const visit = {
        timestamp: new Date().toISOString(),
        ip: ip,
        device: device,
        browser: browser,
        os: os,
        action: action
    };
    
    analytics.visits.push(visit);
    analytics.totalVisits++;
    
    // Статистика по устройствам
    analytics.devices[device] = (analytics.devices[device] || 0) + 1;
    analytics.browsers[browser] = (analytics.browsers[browser] || 0) + 1;
    analytics.os[os] = (analytics.os[os] || 0) + 1;
    
    // Статистика по дням
    analytics.dailyStats[today] = (analytics.dailyStats[today] || 0) + 1;
    
    // Специфичные действия
    if (action === 'unlock') analytics.unlockCount++;
    if (action === 'create_event') analytics.eventsCreated++;
    if (action === 'add_comment') analytics.commentsCount++;
    
    saveAnalytics(analytics);
}

// Отображение статистики
function displayStats() {
    const analytics = getAnalytics();
    
    document.getElementById('totalVisits').textContent = analytics.totalVisits;
    document.getElementById('unlockCount').textContent = analytics.unlockCount;
    document.getElementById('eventsCreated').textContent = analytics.eventsCreated;
    document.getElementById('commentsCount').textContent = analytics.commentsCount;
}

// Отображение статистики по устройствам
function displayDeviceStats() {
    const analytics = getAnalytics();
    const total = analytics.totalVisits || 1;
    
    const devices = Object.entries(analytics.devices).sort((a, b) => b[1] - a[1]);
    const browsers = Object.entries(analytics.browsers).sort((a, b) => b[1] - a[1]);
    const os = Object.entries(analytics.os).sort((a, b) => b[1] - a[1]);
    
    displayStatList('deviceStats', devices, total);
    displayStatList('browserStats', browsers, total);
    displayStatList('osStats', os, total);
}

function displayStatList(elementId, data, total) {
    const element = document.getElementById(elementId);
    
    if (data.length === 0) {
        element.innerHTML = '<div class="stat-item">Нет данных</div>';
        return;
    }
    
    element.innerHTML = data.map(([name, count]) => `
        <div class="stat-item">
            <span class="stat-name">${name}</span>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${(count / total) * 100}%"></div>
            </div>
            <span class="stat-count">${count}</span>
        </div>
    `).join('');
}

// Отображение графика
function displayChart() {
    const analytics = getAnalytics();
    const dailyStats = analytics.dailyStats;
    
    const dates = Object.keys(dailyStats).sort();
    const values = dates.map(date => dailyStats[date]);
    
    const ctx = document.getElementById('visitsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Посещения',
                data: values,
                borderColor: '#e50914',
                backgroundColor: 'rgba(229, 9, 20, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#333333'
                    },
                    ticks: {
                        color: '#888888'
                    }
                },
                x: {
                    grid: {
                        color: '#333333'
                    },
                    ticks: {
                        color: '#888888'
                    }
                }
            }
        }
    });
}

// Отображение таблицы визитов
function displayVisitsTable() {
    const analytics = getAnalytics();
    const visits = [...analytics.visits].reverse().slice(0, 50);
    
    const tbody = document.getElementById('visitsTableBody');
    
    if (visits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Нет данных</td></tr>';
        return;
    }
    
    tbody.innerHTML = visits.map(visit => `
        <tr>
            <td>${new Date(visit.timestamp).toLocaleString('ru-RU')}</td>
            <td>${visit.ip}</td>
            <td>${visit.device}</td>
            <td>${visit.browser}</td>
            <td>${visit.os}</td>
            <td>${getActionText(visit.action)}</td>
        </tr>
    `).join('');
}

function getActionText(action) {
    const actions = {
        'visit': '🌐 Заход',
        'unlock': '🔓 Разблокировка',
        'create_event': '📅 Создание события',
        'add_comment': '💬 Комментарий'
    };
    return actions[action] || action;
}

// Функции управления
function resetApp() {
    if (confirm('Вы уверены? Это сбросит все данные приложения (события, комментарии).')) {
        localStorage.removeItem(STORAGE_KEYS.APP_STATE);
        localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
        localStorage.removeItem(STORAGE_KEYS.EASTER_EGGS);
        showStatus('Данные приложения сброшены', 'success');
        setTimeout(() => location.reload(), 1500);
    }
}

function resetAnalytics() {
    if (confirm('Сбросить только аналитику?')) {
        localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
        showStatus('Аналитика сброшена', 'success');
        setTimeout(() => location.reload(), 1500);
    }
}

function clearLocalStorage() {
    if (confirm('⚠️ ПОЛНАЯ ОЧИСТКА ВСЕХ ДАННЫХ! Вы уверены?')) {
        localStorage.clear();
        showStatus('Все данные очищены', 'success');
        setTimeout(() => location.reload(), 1500);
    }
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
}

function toggleDataView() {
    const view = document.getElementById('dataView');
    if (view.style.display === 'none') {
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            allData[key] = JSON.parse(localStorage.getItem(key));
        }
        view.textContent = JSON.stringify(allData, null, 2);
        view.style.display = 'block';
    } else {
        view.style.display = 'none';
    }
}

function exportData() {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = JSON.parse(localStorage.getItem(key));
    }
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-sheet-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showStatus('Данные экспортированы', 'success');
}

// Инициализация
window.onload = async function() {
    initAnalytics();
    await trackVisit('admin_visit');
    displayStats();
    displayDeviceStats();
    displayChart();
    displayVisitsTable();
};

// Автообновление каждые 30 секунд
setInterval(() => {
    displayStats();
    displayDeviceStats();
    displayVisitsTable();
}, 30000);