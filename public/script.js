// --- Existing data and functions from the original script.js ---
const matchesData = [[{"id":1,"name":"Jordan Chen","major":"Computer Science","year":"Junior","score":94,"tags":["Same Hours","Verified","4.8⭐"],"schedule":"mwf","rating":4.8,"neighborhood":true,"avatar":"👤","location":"Diamond Bar"},{"id":2,"name":"Marcus Johnson","major":"Engineering","year":"Senior","score":82,"tags":["Similar Route","Verified","4.6⭐"],"schedule":"other","rating":4.6,"neighborhood":false,"avatar":"👤","location":"Walnut"},{"id":3,"name":"Sophia Rodriguez","major":"Business","year":"Sophomore","score":78,"tags":["TTh Schedule","Verified","4.7⭐"],"schedule":"tth","rating":4.7,"neighborhood":false,"avatar":"👤","location":"Chino"},{"id":4,"name":"David Park","major":"Data Science","year":"Junior","score":76,"tags":["MWF Schedule","Verified","4.5⭐"],"schedule":"mwf","rating":4.5,"neighborhood":false,"avatar":"👤","location":"Diamond Bar"},{"id":5,"name":"Emily Zhang","major":"Art History","year":"Freshman","score":71,"tags":["Same Dorm","Verified","4.9⭐"],"schedule":"mwf","rating":4.9,"neighborhood":true,"avatar":"👤","location":"Ontario"},{"id":6,"name":"James Wilson","major":"Pre-Med","year":"Sophomore","score":68,"tags":["Early Morning","Verified","4.4⭐"],"schedule":"mwf","rating":4.4,"neighborhood":false,"avatar":"👤","location":"Fontana"}]];
const conversations = { 1: { name: 'Jordan Chen', avatar: '👩‍🎓', messages: [ { type: 'them', text: 'Hey! I saw your profile and we have the same schedule', time: '10:30 AM' }, { type: 'them', text: 'MWF 8-5, right?', time: '10:31 AM' }, { type: 'me', text: 'Yes! That would be perfect for my commute', time: '10:35 AM' }, { type: 'them', text: 'Cool! When do you usually leave campus?', time: '10:40 AM' }, { type: 'me', text: 'Around 5:00 PM. You?', time: '10:42 AM' }, { type: 'them', text: 'Same here! Let\'s meet at Starbucks on Monday at 7:40 AM', time: '10:45 AM' }, { type: 'me', text: 'Sounds good! See you Monday 🚗', time: '10:47 AM' }, { type: 'them', text: 'See you Monday morning at 7:40!', time: '2 min ago' } ] }, 2: { name: 'Marcus Johnson', avatar: '👨‍💼', messages: [ { type: 'them', text: 'Thanks for the ride yesterday!', time: '1 hour ago' }, { type: 'me', text: 'No problem! Anytime', time: '58 min ago' } ] }, 3: { name: 'Sophia Rodriguez', avatar: '👩‍🰳', messages: [ { type: 'them', text: 'Are you available for Thursday morning?', time: 'Yesterday' } ] }, 4: { name: 'David Park', avatar: '👨‍💻', messages: [ { type: 'them', text: 'Great match! Let\'s confirm the first ride', time: '2 days ago' } ] } };
const rideDetails = { 1: { name: 'Jordan Chen', avatar: '👩‍🎓', role: 'Driver', days: 'Mon, Wed, Fri', route: 'Diamond Bar → Cal Poly Pomona', depart: '7:20 AM', pickup: '7:40 AM · Starbucks, Diamond Bar Blvd', arrival: '8:10 AM · Campus Lot H (~30 min)', status: 'Confirmed', car: '2022 Toyota Camry · Silver', seats: '2 seats available', phone: '(909) 555-0194' }, 2: { name: 'Marcus Johnson', avatar: '👨‍💼', role: 'Driver', days: 'Wednesday', route: 'Walnut → Cal Poly Pomona', depart: '7:45 AM', pickup: '8:00 AM · Grand Ave & Nogales St, Walnut', arrival: '8:22 AM · Campus Lot B (~22 min)', status: 'Pending', car: '2020 Honda Accord · White', seats: '1 seat available', phone: '(909) 555-0137' }, 3: { name: 'Sophia Rodriguez', avatar: '👩‍🰳', role: 'Rider (you\'re driving)', days: 'Friday', route: 'Your Home → Chino → Cal Poly Pomona', depart: '7:05 AM', pickup: '7:25 AM · Sophia\'s Home, Chino', arrival: '8:05 AM · Campus Lot G (~40 min)', status: 'Active', car: 'You are driving', seats: '—', phone: '(909) 555-0281' } };

let isLoggedIn = false;
let currentConversationId = null;
let currentFilter = 'all';
let searchTerm = '';
let selectedStartLocation = '';
let cancelTargetId = null;
let currentRating = 0;
let ratingTargetHistory = null;

// --- Utility Functions ---
function getInitials(name) { return name .split(' ') .filter(Boolean) .slice(0, 2) .map(part => part[0].toUpperCase()) .join(''); }
function showToast(message) { /* Implementation from original script */ }
function openModal(modalId) { /* Implementation from original script */ }
function closeModal(modalId) { /* Implementation from original script */ }
function closeModalOnOverlay(event, modalId) { /* Implementation from original script */ }

// --- Page Navigation ---
function showPage(pageId) {
    if (!isLoggedIn && pageId !== 'login' && pageId !== 'splash') {
        pageId = 'login';
    }
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
    setAppShellVisibility();
    window.scrollTo(0, 0);
}

function goBack() { showPage('dashboard'); }

function setAppShellVisibility() {
    const header = document.getElementById('app-header');
    const currentPage = document.querySelector('.page.active');
    const shouldHide = !isLoggedIn || (currentPage && (currentPage.id === 'login' || currentPage.id === 'splash'));
    if(header) header.classList.toggle('hidden', shouldHide);
}

// --- Auth Tab Switching ---
function switchAuthTab(tabName, clickedBtn) {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
    const formToShow = document.getElementById(`${tabName}-form`);
    if(formToShow) formToShow.classList.add('active');
    if(clickedBtn) clickedBtn.classList.add('active');
}

// --- Event Handlers ---
async function handleRegister(event) {
    event.preventDefault();
    const messageDiv = document.getElementById('register-message');
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const isDriver = document.getElementById('register-is-driver').checked;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, is_driver: isDriver }),
        });
        const result = await response.json();
        messageDiv.className = 'auth-message';
        if (response.ok) {
            messageDiv.classList.add('success');
            messageDiv.textContent = result.message + " Please log in.";
            document.getElementById('register-form').reset();
            setTimeout(() => {
                switchAuthTab('login', document.querySelector('.auth-tab-btn'));
                const loginEmailInput = document.getElementById('login-email');
                if(loginEmailInput) loginEmailInput.value = email;
            }, 2000);
        } else {
            messageDiv.classList.add('error');
            messageDiv.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        messageDiv.className = 'auth-message error';
        messageDiv.textContent = 'An error occurred. Please try again.';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('login-message');
    
    // Basic validation
    if (!email || !password) {
        messageDiv.className = 'auth-message error';
        messageDiv.textContent = 'Please enter both email and password.';
        return;
    }
    
    // NOTE: This is still demo logic. We will replace this with a real API call next.
    if (email.toLowerCase().endsWith('@cpp.edu')) {
        isLoggedIn = true;
        // Mock user data population
        const name = "Alex Johnson"; // Placeholder name
        document.getElementById('user-avatar').textContent = getInitials(name) || 'CR';
        document.getElementById('greeting-name').textContent = name.split(' ')[0];
        document.getElementById('dropdown-name').textContent = name;
        document.getElementById('dropdown-email').textContent = email;
        showPage('dashboard');
    } else {
        messageDiv.className = 'auth-message error';
        messageDiv.textContent = 'Please use a valid @cpp.edu email address.';
    }
}

function logoutUser() {
    isLoggedIn = false;
    showPage('login');
}

// --- Other functions from original script ---
function toggleUserDropdown() { const dropdown = document.getElementById('user-dropdown'); if(dropdown) dropdown.classList.toggle('hidden'); }
function openNotificationsPanel() { openModal('notifications-modal'); }
function viewSampleProfile(name, major, avatar, rating, bio) { /* Implementation */ }
function saveMyProfile() { /* Implementation */ }
function removeFriend(btn) { /* Implementation */ }
function filterMatches(filterType) { /* Implementation */ }
function updateLocationFilter() { /* Implementation */ }
function updateMatchDisplay() { /* Implementation */ }
function openChat(conversationId) { /* Implementation */ }
function sendMessage() { /* Implementation */ }
function switchRidesTab(tab, btn) { /* Implementation */ }
function openRideDetail(id) { /* Implementation */ }
function openCancelModal(id) { /* Implementation */ }
function confirmCancelRide() { /* Implementation */ }
function openRateModal(id, name, avatar) { /* Implementation */ }
function setRating(stars) { /* Implementation */ }
function submitRating() { /* Implementation */ }
function switchFriendsTab(tab, btn) { /* Implementation */ }
function openAddFriendModal() { /* Implementation */ }
function addFriend() { /* Implementation */ }


// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    // Initial page setup
    const hasSeenSplash = sessionStorage.getItem('campusRideSplashSeen');
    if (hasSeenSplash) {
        showPage('login');
    } else {
        showPage('splash');
        setTimeout(() => {
            const splashPage = document.getElementById('splash');
            if (splashPage && splashPage.classList.contains('active')) {
                 showPage('login');
                 sessionStorage.setItem('campusRideSplashSeen', 'true');
            }
        }, 4000); // Show splash for 4 seconds
    }
    
    // Add event listeners if elements exist
    const getStartedBtn = document.querySelector('#splash .btn-primary');
    if(getStartedBtn) {
        getStartedBtn.onclick = () => {
            showPage('login');
            sessionStorage.setItem('campusRideSplashSeen', 'true');
        };
    }
});
