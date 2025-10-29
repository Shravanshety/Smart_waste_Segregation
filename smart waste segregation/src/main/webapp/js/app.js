// Mock user data for demo
const users = [
    { username: 'admin', password: 'admin123', role: 'ADMIN' },
    { username: 'collector1', password: 'collect123', role: 'COLLECTOR' },
    { username: 'john_doe', password: 'password123', role: 'USER' }
];

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        switch(user.role) {
            case 'ADMIN':
                window.location.href = 'dashboard-admin.html';
                break;
            case 'COLLECTOR':
                window.location.href = 'dashboard-collector.html';
                break;
            default:
                window.location.href = 'dashboard-user.html';
        }
    } else {
        alert('Invalid credentials');
    }
}