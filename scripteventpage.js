// script.js

// 🌐 Smooth Scroll for Navigation Links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 🧭 Highlight Current Section in Nav on Scroll
const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ✅ Form Validation and LocalStorage for Student Assistance
const contactForm = document.querySelector('#contact form');
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  const assistance = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  let stored = JSON.parse(localStorage.getItem('studentAssistance')) || [];
  stored.push(assistance);
  localStorage.setItem('studentAssistance', JSON.stringify(stored));

  alert('Your message has been sent. Admin will review it shortly.');
  contactForm.reset();
});

// 🗓️ Dynamic Update of Upcoming Events
const eventsTable = document.querySelector('#schedule tbody');
function addEvent(date, schoolEvent, trip) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${date}</td>
    <td>${schoolEvent}</td>
    <td>${trip}</td>
  `;
  eventsTable.appendChild(row);
}

// Example usage (admin can call this function dynamically)
addEvent('1 July,2026, Tuesday', 'Science Fair', 'Science Club Trip');

// 🔐 Student Login/Register Form
function createAuthForm() {
  const authSection = document.createElement('section');
  authSection.id = 'auth';
  authSection.innerHTML = `
    <h2>Student Login / Register</h2>
    <form id="authForm">
      <label for="username">Username:</label>
      <input type="text" id="username" required>
      <label for="password">Password:</label>
      <input type="password" id="password" required>
      <button type="submit">Login / Register</button>
    </form>
  `;
  document.body.insertBefore(authSection, document.body.firstChild);

  const authForm = document.querySelector('#authForm');
  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    localStorage.setItem('studentUser', JSON.stringify({ username, password }));
    alert(`Welcome ${username}! Redirecting to UniVoteHub...`);
    authSection.style.display = 'none';
    document.querySelector('main').style.display = 'block';
  });

  // Hide main content until login
  document.querySelector('main').style.display = 'none';
}
createAuthForm();

// 🧾 Load and Display Student Assistance Messages
function loadMessages() {
  const messageList = document.getElementById('messageList');
  messageList.innerHTML = '';
  const messages = JSON.parse(localStorage.getItem('studentAssistance')) || [];

  messages.forEach((msg, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${msg.name}</strong> (${msg.email})<br>
      <em>${new Date(msg.timestamp).toLocaleString()}</em><br>
      <p>${msg.message}</p>
      <textarea placeholder="Reply to ${msg.name}" data-index="${index}"></textarea>
      <button onclick="saveReply(${index})">Save Reply</button>
      <hr>
    `;
    messageList.appendChild(li);
  });
}


function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}
// 🔐 Admin Login with sessionStorage
const adminLoginForm = document.getElementById('adminLoginForm');
const adminDashboard = document.getElementById('admin-dashboard');
const adminLoginSection = document.getElementById('admin-login');

// Check sessionStorage on page load
if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
  adminLoginSection.style.display = 'none';
  adminDashboard.style.display = 'block';
  loadMessages();
} else {
  adminDashboard.style.display = 'none';
}

// 🔐 Admin Login with Cookies
if (getCookie('isAdminLoggedIn') === 'true') {
  adminLoginSection.style.display = 'none';
  adminDashboard.style.display = 'block';
  loadMessages();
} else {
  adminDashboard.style.display = 'none';
}

adminLoginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  const validAdmin = {
    username: 'admin',
    password: 'univote123'
  };

  if (username === validAdmin.username && password === validAdmin.password) {
    setCookie('isAdminLoggedIn', 'true', 7); // persists for 7 days
    alert('Admin login successful!');
    adminLoginSection.style.display = 'none';
    adminDashboard.style.display = 'block';
    loadMessages();
  } else {
    alert('Invalid credentials. Please try again.');
  }
});

document.getElementById('adminLogout').addEventListener('click', () => {
  sessionStorage.removeItem('isAdminLoggedIn'); // if using sessionStorage
  setCookie('isAdminLoggedIn', '', -1); // if using cookies
  location.reload();
});