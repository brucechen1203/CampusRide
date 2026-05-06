// Match data for search and filtering
        const matchesData = [[{"id":1,"name":"Jordan Chen","major":"Computer Science","year":"Junior","score":94,"tags":["Same Hours","Verified","4.8⭐"],"schedule":"mwf","rating":4.8,"neighborhood":true,"avatar":"👤","location":"Diamond Bar"},{"id":2,"name":"Marcus Johnson","major":"Engineering","year":"Senior","score":82,"tags":["Similar Route","Verified","4.6⭐"],"schedule":"other","rating":4.6,"neighborhood":false,"avatar":"👤","location":"Walnut"},{"id":3,"name":"Sophia Rodriguez","major":"Business","year":"Sophomore","score":78,"tags":["TTh Schedule","Verified","4.7⭐"],"schedule":"tth","rating":4.7,"neighborhood":false,"avatar":"👤","location":"Chino"},{"id":4,"name":"David Park","major":"Data Science","year":"Junior","score":76,"tags":["MWF Schedule","Verified","4.5⭐"],"schedule":"mwf","rating":4.5,"neighborhood":false,"avatar":"👤","location":"Diamond Bar"},{"id":5,"name":"Emily Zhang","major":"Art History","year":"Freshman","score":71,"tags":["Same Dorm","Verified","4.9⭐"],"schedule":"mwf","rating":4.9,"neighborhood":true,"avatar":"👤","location":"Ontario"},{"id":6,"name":"James Wilson","major":"Pre-Med","year":"Sophomore","score":68,"tags":["Early Morning","Verified","4.4⭐"],"schedule":"mwf","rating":4.4,"neighborhood":false,"avatar":"👤","location":"Fontana"}]];

        // Conversation data
        const conversations = {
            1: {
                name: 'Jordan Chen',
                avatar: '👩‍🎓',
                messages: [
                    { type: 'them', text: 'Hey! I saw your profile and we have the same schedule', time: '10:30 AM' },
                    { type: 'them', text: 'MWF 8-5, right?', time: '10:31 AM' },
                    { type: 'me', text: 'Yes! That would be perfect for my commute', time: '10:35 AM' },
                    { type: 'them', text: 'Cool! When do you usually leave campus?', time: '10:40 AM' },
                    { type: 'me', text: 'Around 5:00 PM. You?', time: '10:42 AM' },
                    { type: 'them', text: 'Same here! Let\'s meet at Starbucks on Monday at 7:40 AM', time: '10:45 AM' },
                    { type: 'me', text: 'Sounds good! See you Monday 🚗', time: '10:47 AM' },
                    { type: 'them', text: 'See you Monday morning at 7:40!', time: '2 min ago' }
                ]
            },
            2: {
                name: 'Marcus Johnson',
                avatar: '👨‍💼',
                messages: [
                    { type: 'them', text: 'Thanks for the ride yesterday!', time: '1 hour ago' },
                    { type: 'me', text: 'No problem! Anytime', time: '58 min ago' }
                ]
            },
            3: {
                name: 'Sophia Rodriguez',
                avatar: '👩‍🰳',
                messages: [
                    { type: 'them', text: 'Are you available for Thursday morning?', time: 'Yesterday' }
                ]
            },
            4: {
                name: 'David Park',
                avatar: '👨‍💻',
                messages: [
                    { type: 'them', text: 'Great match! Let\'s confirm the first ride', time: '2 days ago' }
                ]
            }
        };

        let isLoggedIn = false;
        let currentConversationId = null;
        let currentFilter = 'all';
        let searchTerm = '';
        let selectedStartLocation = '';

        function toggleUserDropdown() {
            const dropdown = document.getElementById('user-dropdown');
            dropdown.classList.toggle('hidden');
        }

        function openNotificationsPanel() {
            openModal('notifications-modal');
        }

        function viewSampleProfile(name, major, avatar, rating, bio) {
            document.getElementById('sample-profile-name').textContent = name;
            document.getElementById('sample-profile-major').textContent = major;
            document.getElementById('sample-profile-avatar').textContent = avatar;
            document.getElementById('sample-profile-rating').textContent = rating;
            document.getElementById('sample-profile-bio').textContent = bio;
            showPage('profile');
        }
        
        function saveMyProfile() {
            const name = document.getElementById('my-profile-name').value;
            const pronouns = document.getElementById('my-profile-pronouns').value;
            const car = document.getElementById('my-profile-car').value;
            
            document.getElementById('dropdown-name').textContent = name;
            document.getElementById('greeting-name').textContent = name.split(' ')[0];
            document.getElementById('user-avatar').textContent = getInitials(name) || 'CR';
            document.getElementById('my-profile-avatar-display').textContent = getInitials(name) || 'CR';
            
            showToast('Profile saved successfully!');
            showPage('dashboard');
        }

        function removeFriend(btn) {
            if (confirm("Are you sure you want to remove this friend?")) {
                const card = btn.closest('.friend-card');
                card.style.transition = 'opacity 0.3s, transform 0.3s';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.remove(), 300);
                showToast("Friend removed.");
            }
        }

        function setAppShellVisibility() {
            const header = document.getElementById('app-header');
            const currentPage = document.querySelector('.page.active');
            const shouldHide = !isLoggedIn || (currentPage && currentPage.id === 'login');
            header.classList.toggle('hidden', shouldHide);
        }

        function getInitials(name) {
            return name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map(part => part[0].toUpperCase())
                .join('');
        }

        function showLoginError(message) {
            const err = document.getElementById('login-error');
            const ok = document.getElementById('login-success');
            ok.style.display = 'none';
            err.textContent = message;
            err.style.display = 'block';
        }

        function showLoginSuccess(message) {
            const err = document.getElementById('login-error');
            const ok = document.getElementById('login-success');
            err.style.display = 'none';
            ok.textContent = message;
            ok.style.display = 'block';
        }

        function handleLogin(event) {
            event.preventDefault();

            const name = document.getElementById('login-name').value.trim();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember-me').checked;

            if (!name || !email || !password) {
                showLoginError('Please complete all fields.');
                return;
            }

            if (!email.toLowerCase().endsWith('@cpp.edu')) {
                showLoginError('Please use a valid @cpp.edu email address.');
                return;
            }

            if (password.length < 6) {
                showLoginError('Password must be at least 6 characters.');
                return;
            }

            isLoggedIn = true;
            document.getElementById('user-avatar').textContent = getInitials(name) || 'CR';
            document.getElementById('greeting-name').textContent = name.split(' ')[0];
            document.getElementById('dropdown-name').textContent = name;
            document.getElementById('dropdown-email').textContent = email;
            document.getElementById('my-profile-name').value = name;
            document.getElementById('my-profile-avatar-display').textContent = getInitials(name) || 'CR';

            if (remember) {
                localStorage.setItem('campusRideUserName', name);
                localStorage.setItem('campusRideUserEmail', email);
            } else {
                localStorage.removeItem('campusRideUserName');
                localStorage.removeItem('campusRideUserEmail');
            }

            showLoginSuccess('Login successful. Redirecting to Dashboard...');
            setTimeout(() => {
                showPage('dashboard');
            }, 450);
        }

        function logoutUser() {
            isLoggedIn = false;
            document.getElementById('login-password').value = '';
            document.getElementById('login-error').style.display = 'none';
            document.getElementById('login-success').style.display = 'none';
            showPage('login');
        }

        function filterMatches(filterType) {
            currentFilter = filterType;
            
            // Update active filter button
            document.querySelectorAll('.filter-tag').forEach(tag => {
                tag.classList.remove('active');
                if (tag.getAttribute('data-filter') === filterType) {
                    tag.classList.add('active');
                }
            });

            updateMatchDisplay();
        }

        function updateLocationFilter() {
            selectedStartLocation = document.getElementById('start-location').value;
            updateMatchDisplay();
        }

        function updateMatchDisplay() {
            const matchCards = document.querySelectorAll('.match-card');
            let visibleCount = 0;

            matchCards.forEach((card, index) => {
                const match = matchesData[index];
                if (!match) return;

                let shouldShow = true;

                // Apply search filter
                if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    shouldShow = match.name.toLowerCase().includes(searchLower) ||
                                match.major.toLowerCase().includes(searchLower) ||
                                match.year.toLowerCase().includes(searchLower);
                }

                // Apply location filter
                if (shouldShow && selectedStartLocation) {
                    shouldShow = match.location === selectedStartLocation;
                }

                // Apply category filter
                if (shouldShow && currentFilter !== 'all') {
                    switch(currentFilter) {
                        case 'mwf':
                            shouldShow = match.schedule === 'mwf';
                            break;
                        case 'verified':
                            shouldShow = match.tags.includes('Verified');
                            break;
                        case 'rating':
                            shouldShow = match.rating >= 4;
                            break;
                        case 'neighborhood':
                            shouldShow = match.neighborhood;
                            break;
                    }
                }

                card.style.display = shouldShow ? 'block' : 'none';
                if (shouldShow) visibleCount++;
            });

            // Show no results message if needed
            const grid = document.querySelector('.matches-grid');
            let noResultsMsg = grid.querySelector('.no-results-msg');
            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-msg';
                    noResultsMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--muted); font-size: 16px;';
                    noResultsMsg.textContent = 'No matches found. Try adjusting your search or filters.';
                    grid.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        function openChat(conversationId) {
            currentConversationId = conversationId;
            const conv = conversations[conversationId];
            
            if (!conv) return;
            
            // Update chat header
            document.getElementById('chat-name').textContent = conv.name;
            document.getElementById('chat-avatar').textContent = conv.avatar;
            
            // Load messages
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = '';
            
            conv.messages.forEach((msg, index) => {
                const msgGroup = document.createElement('div');
                msgGroup.className = `message-group ${msg.type}`;
                
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble';
                bubble.textContent = msg.text;
                
                msgGroup.appendChild(bubble);
                messagesContainer.appendChild(msgGroup);
            });
            
            // Scroll to bottom and focus input
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                document.getElementById('chat-input').focus();
            }, 0);
            
            showPage('chat');
        }

        function sendMessage() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            
            if (!message || !currentConversationId) return;
            
            const conv = conversations[currentConversationId];
            const messagesContainer = document.getElementById('chat-messages');
            
            // Add new message
            const msgGroup = document.createElement('div');
            msgGroup.className = 'message-group me';
            
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble';
            bubble.textContent = message;
            
            msgGroup.appendChild(bubble);
            messagesContainer.appendChild(msgGroup);
            
            // Add to conversation data
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            conv.messages.push({ type: 'me', text: message, time: timeStr });
            
            // Clear input and reset height
            input.value = '';
            input.style.height = 'auto';
            
            // Scroll to bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 0);
        }

        // Auto-resize textarea
        document.addEventListener('DOMContentLoaded', function() {
            const savedEmail = localStorage.getItem('campusRideUserEmail');
            const savedName = localStorage.getItem('campusRideUserName');
            if (savedEmail) {
                document.getElementById('login-email').value = savedEmail;
                document.getElementById('login-name').value = savedName || '';
                document.getElementById('remember-me').checked = true;
            }

            const chatInput = document.getElementById('chat-input');
            
            if (chatInput) {
                chatInput.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
                });
                
                chatInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
            }
            
            // Search input handler
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    searchTerm = e.target.value;
                    updateMatchDisplay();
                });
            }

            // Message item click handlers
            document.querySelectorAll('.message-item').forEach((item, index) => {
                item.addEventListener('click', function() {
                    const conversationId = index + 1;
                    openChat(conversationId);
                });
            });

            // Match card view profile buttons
            document.querySelectorAll('.match-card .view-profile').forEach(btn => {
                btn.addEventListener('click', function() {
                    showPage('profile');
                });
            });
        });

        function showPage(pageId) {
            if (!isLoggedIn && pageId !== 'login') {
                pageId = 'login';
            }

            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            const page = document.getElementById(pageId);
            if (page) {
                page.classList.add('active');
            }

            // Update nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Handle specific page nav buttons
            if (pageId === 'dashboard') {
                document.querySelectorAll('.nav-btn')[0].classList.add('active');
            } else if (pageId === 'matches') {
                document.querySelectorAll('.nav-btn')[1].classList.add('active');
            } else if (pageId === 'messages') {
                document.querySelectorAll('.nav-btn')[2].classList.add('active');
            } else if (pageId === 'my-rides') {
                document.querySelectorAll('.nav-btn')[3].classList.add('active');
            }

            setAppShellVisibility();

            // Scroll to top
            window.scrollTo(0, 0);
        }

        function goBack() {
            showPage('dashboard');
        }

        /* ─── MY RIDES ─── */
        const rideDetails = {
            1: {
                name: 'Jordan Chen', avatar: '👩‍🎓', role: 'Driver',
                days: 'Mon, Wed, Fri', route: 'Diamond Bar → Cal Poly Pomona',
                depart: '7:20 AM', pickup: '7:40 AM · Starbucks, Diamond Bar Blvd',
                arrival: '8:10 AM · Campus Lot H (~30 min)', status: 'Confirmed',
                car: '2022 Toyota Camry · Silver', seats: '2 seats available', phone: '(909) 555-0194'
            },
            2: {
                name: 'Marcus Johnson', avatar: '👨‍💼', role: 'Driver',
                days: 'Wednesday', route: 'Walnut → Cal Poly Pomona',
                depart: '7:45 AM', pickup: '8:00 AM · Grand Ave & Nogales St, Walnut',
                arrival: '8:22 AM · Campus Lot B (~22 min)', status: 'Pending',
                car: '2020 Honda Accord · White', seats: '1 seat available', phone: '(909) 555-0137'
            },
            3: {
                name: 'Sophia Rodriguez', avatar: '👩‍🰳', role: 'Rider (you\'re driving)',
                days: 'Friday', route: 'Your Home → Chino → Cal Poly Pomona',
                depart: '7:05 AM', pickup: '7:25 AM · Sophia\'s Home, Chino',
                arrival: '8:05 AM · Campus Lot G (~40 min)', status: 'Active',
                car: 'You are driving', seats: '—', phone: '(909) 555-0281'
            }
        };

        let cancelTargetId = null;
        let currentRating = 0;
        let ratingTargetHistory = null;

        function switchRidesTab(tab, btn) {
            document.querySelectorAll('#my-rides .rides-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('rides-upcoming').style.display = tab === 'upcoming' ? 'block' : 'none';
            document.getElementById('rides-requests').style.display = tab === 'requests' ? 'block' : 'none';
            document.getElementById('rides-history').style.display  = tab === 'history'  ? 'block' : 'none';
        }

        function openRideDetail(id) {
            const r = rideDetails[id];
            if (!r) return;
            document.getElementById('detail-modal-title').textContent = 'Ride with ' + r.name;
            document.getElementById('detail-modal-body').innerHTML = `
                <div class="detail-info-row">
                    <div class="detail-info-icon">${r.avatar}</div>
                    <div><div class="detail-info-label">Partner</div><div class="detail-info-val">${r.name} · ${r.role}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">📅</div>
                    <div><div class="detail-info-label">Days</div><div class="detail-info-val">${r.days}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">🛣️</div>
                    <div><div class="detail-info-label">Route</div><div class="detail-info-val">${r.route}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">🔵</div>
                    <div><div class="detail-info-label">Depart</div><div class="detail-info-val">${r.depart}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">🟠</div>
                    <div><div class="detail-info-label">Pickup</div><div class="detail-info-val">${r.pickup}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">🟢</div>
                    <div><div class="detail-info-label">Est. Arrival</div><div class="detail-info-val">${r.arrival}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">🚗</div>
                    <div><div class="detail-info-label">Vehicle</div><div class="detail-info-val">${r.car}</div></div>
                </div>
                <div class="detail-info-row">
                    <div class="detail-info-icon">📞</div>
                    <div><div class="detail-info-label">Contact</div><div class="detail-info-val">${r.phone}</div></div>
                </div>
            `;
            openModal('ride-detail-modal');
        }

        function openCancelModal(id) {
            cancelTargetId = id;
            document.getElementById('cancel-reason').value = '';
            document.getElementById('cancel-note').value = '';
            openModal('cancel-modal');
        }

        function confirmCancel() {
            const reason = document.getElementById('cancel-reason').value;
            if (!reason) { alert('Please select a reason.'); return; }
            // Remove the ride card from upcoming
            const card = document.querySelector(`[data-ride-id="${cancelTargetId}"]`);
            if (card) {
                card.style.transition = 'opacity 0.3s, transform 0.3s';
                card.style.opacity = '0';
                card.style.transform = 'translateX(30px)';
                setTimeout(() => card.remove(), 300);
            }
            closeModal('cancel-modal');
            showToast('Ride cancelled. Your partner has been notified.');
            cancelTargetId = null;
        }

        /* ─── MAPS ─── */
        const rideMapsData = {
            1: { origin: 'Diamond+Bar,+CA', waypoint: 'Starbucks,+Diamond+Bar+Blvd,+Diamond+Bar,+CA', dest: 'Cal+Poly+Pomona,+Pomona,+CA' },
            2: { origin: 'Grand+Ave+%26+Nogales+St,+Walnut,+CA', waypoint: '', dest: 'Cal+Poly+Pomona,+Pomona,+CA' },
            3: { origin: 'Your+Home', waypoint: 'Chino,+CA', dest: 'Cal+Poly+Pomona,+Pomona,+CA' }
        };

        function openMaps(id) {
            const m = rideMapsData[id];
            if (!m) return;
            let url;
            // Try to detect platform – iOS uses maps.apple.com, others use Google Maps
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                const wp = m.waypoint ? `+to:${m.waypoint}` : '';
                url = `maps://maps.apple.com/?saddr=${m.origin}${wp}&daddr=${m.dest}&dirflg=d`;
            } else {
                const wp = m.waypoint ? `&waypoints=${m.waypoint}` : '';
                url = `https://www.google.com/maps/dir/?api=1&origin=${m.origin}${wp}&destination=${m.dest}&travelmode=driving`;
            }
            window.open(url, '_blank');
        }

        /* ─── SCHEDULE MODAL STATE ─── */
        let schedRole = 'rider'; // 'rider' or 'driver'
        let schedTimeMode = 'arrival'; // 'arrival' or 'departure'

        const partnerData = {
            rider: [
                { value: 'jordan', label: 'Jordan Chen (94% match)', hint: 'Driver living in Diamond Bar — you\'re along their route to campus via the 60 Fwy.' },
                { value: 'marcus', label: 'Marcus Johnson (82% match)', hint: 'Driver from Walnut — picks up riders near Grand Ave on their way to campus.' },
                { value: 'david',  label: 'David Park (76% match)',    hint: 'Driver from Diamond Bar — MWF schedule, passes through your area.' },
            ],
            driver: [
                { value: 'sophia', label: 'Sophia Rodriguez (78% match)', hint: 'Rider in Chino — falls along your route if you take the 71 N toward campus.' },
                { value: 'emily',  label: 'Emily Zhang (71% match)',       hint: 'Rider near Ontario — lies close to your path via the 60 Fwy on-ramp.' },
                { value: 'james',  label: 'James Wilson (68% match)',      hint: 'Rider in Fontana — adds ~8 min to your drive but is a verified member.' },
            ]
        };

        function setSchedRole(role) {
            schedRole = role;
            document.getElementById('role-btn-rider').classList.toggle('active', role === 'rider');
            document.getElementById('role-btn-driver').classList.toggle('active', role === 'driver');

            // Update partner label & hint copy
            const label = document.getElementById('sched-partner-label');
            const noteLabel = document.getElementById('sched-note-label');
            if (role === 'rider') {
                label.textContent = 'Select a Driver (you fall along their route)';
                noteLabel.textContent = 'Note to driver (optional)';
            } else {
                label.textContent = 'Select a Rider (they fall along your route)';
                noteLabel.textContent = 'Note to rider (optional)';
            }

            // Rebuild partner dropdown
            const sel = document.getElementById('sched-partner');
            sel.innerHTML = '<option value="">Choose a match…</option>';
            partnerData[role].forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.value;
                opt.textContent = p.label;
                sel.appendChild(opt);
            });
            document.getElementById('sched-partner-hint').textContent = '';
            recalcTimes();
        }

        function onPartnerChange() {
            const val = document.getElementById('sched-partner').value;
            const hint = document.getElementById('sched-partner-hint');
            const partners = partnerData[schedRole];
            const found = partners.find(p => p.value === val);
            hint.textContent = found ? '📍 ' + found.hint : '';
        }

        function setTimeMode(mode) {
            schedTimeMode = mode;
            document.getElementById('tmode-arrival').classList.toggle('active', mode === 'arrival');
            document.getElementById('tmode-departure').classList.toggle('active', mode === 'departure');
            document.getElementById('time-input-arrival').style.display  = mode === 'arrival'   ? '' : 'none';
            document.getElementById('time-input-departure').style.display = mode === 'departure' ? '' : 'none';

            const arrivalLabel = document.getElementById('preview-arrival-label');
            if (mode === 'arrival') {
                arrivalLabel.textContent = 'Must arrive by (target)';
            } else {
                arrivalLabel.textContent = 'Est. Arrival at Campus';
            }
            recalcTimes();
        }

        /* Simulated traffic estimator — uses time-of-day heuristics for the CPP commute area */
        function estimateTrafficTimes() {
            const btn = document.getElementById('traffic-btn');
            const status = document.getElementById('traffic-status');
            btn.classList.add('loading');
            btn.textContent = '⏳ Estimating…';
            status.textContent = 'Checking typical traffic patterns for this time…';

            setTimeout(() => {
                // Determine the target time to base traffic on
                let refMins = 8 * 60; // default 8 AM
                if (schedTimeMode === 'arrival') {
                    const v = document.getElementById('sched-arrival').value;
                    if (v) refMins = timeToMins(v);
                } else {
                    const v = document.getElementById('sched-departure').value;
                    if (v) refMins = timeToMins(v);
                }

                // Morning peak 7–9 AM is heavy; 6–7 AM moderate; otherwise light
                let trafficLevel, leg1, leg2, badgeClass, badgeText;
                if (refMins >= 7 * 60 && refMins <= 9 * 60) {
                    trafficLevel = 'heavy';  leg1 = 20; leg2 = 35; badgeClass = 'traffic-heavy'; badgeText = '🔴 Heavy';
                } else if ((refMins >= 6 * 60 && refMins < 7 * 60) || (refMins > 9 * 60 && refMins <= 10 * 60)) {
                    trafficLevel = 'moderate'; leg1 = 15; leg2 = 25; badgeClass = 'traffic-moderate'; badgeText = '🟡 Moderate';
                } else {
                    trafficLevel = 'light';  leg1 = 10; leg2 = 18; badgeClass = 'traffic-light'; badgeText = '🟢 Light';
                }

                // Jitter slightly by role/partner for realism
                if (schedRole === 'driver') { leg1 = Math.round(leg1 * 1.1); }

                document.getElementById('sched-leg1-mins').value = leg1;
                document.getElementById('sched-leg2-mins').value = leg2;

                const b1 = document.getElementById('leg1-traffic-badge');
                const b2 = document.getElementById('leg2-traffic-badge');
                b1.textContent = badgeText; b1.className = 'drive-leg-badge ' + badgeClass;
                b2.textContent = badgeText; b2.className = 'drive-leg-badge ' + badgeClass;

                const msgs = { heavy: 'Heavy traffic expected — estimated from typical I-60 morning patterns.', moderate: 'Moderate traffic. Consider leaving 5–10 min early.', light: 'Light traffic expected. Times should be reliable.' };
                status.textContent = '✅ ' + msgs[trafficLevel];
                btn.classList.remove('loading');
                btn.textContent = '🔄 Auto-estimate from traffic';
                recalcTimes();
            }, 1100);
        }

        /* ─── SCHEDULE TIME CALCULATOR ─── */
        function fmtTime(totalMins) {
            const h = Math.floor(((totalMins % 1440) + 1440) % 1440 / 60);
            const m = ((totalMins % 60) + 60) % 60;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
        }

        function timeToMins(timeStr) {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        }

        function recalcTimes() {
            const leg1 = parseInt(document.getElementById('sched-leg1-mins').value) || 0;
            const leg2 = parseInt(document.getElementById('sched-leg2-mins').value) || 0;
            const buffer = parseInt(document.getElementById('sched-buffer').value) || 10;

            if (leg1 <= 0 || leg2 <= 0) {
                document.getElementById('calc-depart').textContent = '—';
                document.getElementById('calc-pickup').textContent = '—';
                document.getElementById('calc-arrival').textContent = '—';
                document.getElementById('calc-note').textContent = '';
                return;
            }

            let departMins, pickupMins, arrivalMins;

            if (schedTimeMode === 'arrival') {
                const arrivalStr = document.getElementById('sched-arrival').value;
                if (!arrivalStr) { clearCalc(); return; }
                arrivalMins = timeToMins(arrivalStr);
                // Work backwards: arrival target includes buffer
                pickupMins  = arrivalMins - leg2 - buffer;
                departMins  = pickupMins - leg1;
            } else {
                const depStr = document.getElementById('sched-departure').value;
                if (!depStr) { clearCalc(); return; }
                departMins = timeToMins(depStr);
                pickupMins  = departMins + leg1;
                arrivalMins = pickupMins + leg2 + buffer;
            }

            document.getElementById('calc-depart').textContent  = fmtTime(departMins);
            document.getElementById('calc-pickup').textContent  = fmtTime(pickupMins);
            document.getElementById('calc-arrival').textContent = fmtTime(arrivalMins);

            const totalMins = leg1 + leg2;
            if (departMins < 5 * 60) {
                document.getElementById('calc-note').textContent = '⚠️ Very early departure — double-check your drive times.';
            } else {
                const modeNote = schedTimeMode === 'arrival'
                    ? `Depart by ${fmtTime(departMins)} to arrive with a ${buffer}-min buffer.`
                    : `Leaving at ${fmtTime(departMins)} puts you on campus by ${fmtTime(arrivalMins)} (incl. ${buffer}-min buffer).`;
                document.getElementById('calc-note').textContent = `Total drive: ~${totalMins} min. ${modeNote}`;
            }
        }

        function clearCalc() {
            ['calc-depart','calc-pickup','calc-arrival'].forEach(id => document.getElementById(id).textContent = '—');
            document.getElementById('calc-note').textContent = '';
        }

        function openScheduleModal() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('sched-date').value = tomorrow.toISOString().split('T')[0];
            document.getElementById('sched-pickup').value = '';
            document.getElementById('sched-note').value = '';
            document.getElementById('sched-repeat').value = 'once';
            document.getElementById('sched-arrival').value = '08:00';
            document.getElementById('sched-departure').value = '07:20';
            document.getElementById('sched-leg1-mins').value = '15';
            document.getElementById('sched-leg2-mins').value = '20';
            document.getElementById('sched-buffer').value = '10';
            document.getElementById('leg1-traffic-badge').textContent = '';
            document.getElementById('leg2-traffic-badge').textContent = '';
            document.getElementById('traffic-status').textContent = '';
            // Reset role and time mode
            setSchedRole('rider');
            setTimeMode('arrival');
            // Wire up partner hint
            document.getElementById('sched-partner').onchange = onPartnerChange;
            recalcTimes();
            openModal('schedule-modal');
        }

        function confirmSchedule() {
            const partner = document.getElementById('sched-partner').value;
            const date    = document.getElementById('sched-date').value;
            const pickup  = document.getElementById('sched-pickup').value;
            const leg1    = parseInt(document.getElementById('sched-leg1-mins').value) || 0;
            const leg2    = parseInt(document.getElementById('sched-leg2-mins').value) || 0;
            if (!partner || !date || !pickup || leg1 <= 0 || leg2 <= 0) {
                alert('Please fill in partner, date, pickup location, and both drive time legs.');
                return;
            }
            closeModal('schedule-modal');
            const roleMsg = schedRole === 'rider' ? 'Ride request sent to driver!' : 'Pickup request sent to rider!';
            showToast(roleMsg + ' Awaiting confirmation.');
        }

        function openRatingModal(name, histIdx) {
            currentRating = 0;
            ratingTargetHistory = histIdx;
            document.getElementById('rating-person-name').textContent = name;
            document.getElementById('rating-comment').value = '';
            document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
            openModal('rating-modal');
        }

        function setRating(val) {
            currentRating = val;
            document.querySelectorAll('.star').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.val) <= val);
            });
        }

        function submitRating() {
            if (!currentRating) { alert('Please select a star rating.'); return; }
            closeModal('rating-modal');
            showToast(`Thanks! You rated the ride ${currentRating} ⭐`);
        }

        function openModal(id) {
            document.getElementById(id).classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('open');
            document.body.style.overflow = '';
        }

        function closeModalOnOverlay(event, id) {
            if (event.target === document.getElementById(id)) closeModal(id);
        }

        let toastTimer = null;
        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
        }

        /* ─── FRIENDS ─── */
        function switchFriendsTab(tab, btn) {
            document.querySelectorAll('#friends .rides-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('friends-panel-all').style.display     = tab === 'all'     ? '' : 'none';
            document.getElementById('friends-panel-riding').style.display  = tab === 'riding'  ? '' : 'none';
            document.getElementById('friends-panel-pending').style.display = tab === 'pending' ? '' : 'none';
        }

        function openAddFriendModal() {
            document.getElementById('add-friend-input').value = '';
            document.getElementById('add-friend-result').style.display = 'none';
            openModal('add-friend-modal');
        }

        const fakePeople = [
            { query: ['aisha','patel','aisha.patel','aisha@cpp.edu'], name: 'Aisha Patel', meta: 'Chemistry · Junior · Rancho Cucamonga' },
            { query: ['ryan','nguyen','ryan@cpp.edu'], name: 'Ryan Nguyen', meta: 'Mechanical Engineering · Senior · Pomona' },
            { query: ['lisa','kim','lisa@cpp.edu'], name: 'Lisa Kim', meta: 'Psychology · Freshman · Chino Hills' },
        ];

        function searchFriend() {
            const q = document.getElementById('add-friend-input').value.trim().toLowerCase();
            const result = document.getElementById('add-friend-result');
            if (!q) return;
            const found = fakePeople.find(p => p.query.some(k => k.includes(q) || q.includes(k)));
            if (found) {
                document.getElementById('add-friend-found-name').textContent = found.name;
                document.getElementById('add-friend-found-meta').textContent = found.meta;
                result.style.display = 'block';
            } else {
                result.style.display = 'none';
                showToast('No student found — check the name or email and try again.');
            }
        }

        function sendFriendRequest() {
            const name = document.getElementById('add-friend-found-name').textContent;
            closeModal('add-friend-modal');
            showToast(`Friend request sent to ${name}!`);
        }

        function acceptFriendRequest(btn) {
            const card = btn.closest('.friend-request-card');
            const name = card.querySelector('.friend-name').textContent;
            card.style.transition = 'opacity 0.3s';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
            showToast(`${name} is now your carpool friend! 🎉`);
            const badge = document.querySelector('#friends-tab-pending .unread-badge');
            if (badge) {
                const n = parseInt(badge.textContent) - 1;
                if (n <= 0) badge.remove(); else badge.textContent = n;
            }
        }

        function declineFriendRequest(btn) {
            const card = btn.closest('.friend-request-card');
            card.style.transition = 'opacity 0.3s';
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
            const badge = document.querySelector('#friends-tab-pending .unread-badge');
            if (badge) {
                const n = parseInt(badge.textContent) - 1;
                if (n <= 0) badge.remove(); else badge.textContent = n;
            }
        }

        showPage('login');
