// Frontend JavaScript for API integration with backend
// Handles authentication, journals, and entries management

const API_BASE = 'http://localhost:5000/api';
let currentToken = localStorage.getItem('token');
let currentJournalId = null;
let currentEntryId = null;

// ===== UTILITY FUNCTIONS =====
const apiCall = async (method, endpoint, body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Check if user is logged in
const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (!token && document.querySelector('.dashboard-page')) {
        window.location.href = 'index.html';
    }
    return token;
};

// ===== AUTHENTICATION =====
document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;

            try {
                const result = await apiCall('POST', '/auth/signin', { email, password });
                
                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    currentToken = result.token;
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('Sign in failed: ' + error.message);
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const result = await apiCall('POST', '/auth/signup', { 
                    username, 
                    email, 
                    password, 
                    confirmPassword 
                });
                
                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    currentToken = result.token;
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('Sign up failed: ' + error.message);
            }
        });
    }
    
    // Dashboard functionality
    if (document.querySelector('.dashboard-page')) {
        isLoggedIn();
        initDashboard();
    }
});

// ===== DASHBOARD FUNCTIONALITY =====
async function initDashboard() {
    try {
        // Apply saved theme on load
        const savedTheme = localStorage.getItem('currentTheme') || 'default';
        applyTheme(savedTheme);
        
        // Load and display current user info
        await displayCurrentUser();
        
        // Load journals on page load
        await loadJournals();
        
        // Initialize all feature buttons
        initializeAllFeatures();
        
        // Setup settings handlers
        setupSettingsHandlers();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
    }

    // New Journal button
    const newJournalBtn = document.getElementById('newJournalBtn');
    if (newJournalBtn) {
        newJournalBtn.addEventListener('click', createNewJournal);
    }
    
    // New Entry button
    const newEntryBtn = document.getElementById('newEntryBtn');
    const entryEditor = document.getElementById('entryEditor');
    const entriesView = document.getElementById('entriesView');
    const closeEditorBtn = document.getElementById('closeEditorBtn');
    
    if (newEntryBtn && entryEditor && entriesView) {
        newEntryBtn.addEventListener('click', function() {
            currentEntryId = null;
            entriesView.style.display = 'none';
            entryEditor.style.display = 'flex';
            document.getElementById('entryTitle').value = '';
            document.getElementById('richEditor').innerHTML = '';
            document.getElementById('tagsInput').value = '';
            document.getElementById('moodSelect').value = 'neutral';
        });
    }
    
    if (closeEditorBtn && entryEditor && entriesView) {
        closeEditorBtn.addEventListener('click', function() {
            entryEditor.style.display = 'none';
            entriesView.style.display = 'block';
        });
    }
    
    // Save entry button
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    if (saveEntryBtn) {
        saveEntryBtn.addEventListener('click', saveEntry);
    }
    
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', function() {
            settingsModal.style.display = 'block';
        });
    }
    
    // Customize button
    const customizeBtn = document.getElementById('customizeBtn');
    const customizeModal = document.getElementById('customizeModal');
    if (customizeBtn && customizeModal) {
        customizeBtn.addEventListener('click', function() {
            customizeModal.style.display = 'block';
        });
    }
    
    // Close modals
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });
    }
    
    const saveCustomizationBtn = document.getElementById('saveCustomizationBtn');
    if (saveCustomizationBtn) {
        saveCustomizationBtn.addEventListener('click', saveCustomization);
    }
    
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // Toolbar buttons
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.dataset.command;
            if (command) {
                document.execCommand(command, false, null);
                document.getElementById('richEditor').focus();
            }
        });
    });
    
    // Font select
    const fontSelect = document.getElementById('fontSelect');
    if (fontSelect) {
        fontSelect.addEventListener('change', function() {
            const editor = document.getElementById('richEditor');
            if (this.value === 'default') {
                editor.style.fontFamily = '';
            } else {
                editor.style.fontFamily = this.value;
            }
        });
    }
    
    // Text color picker
    const textColorPicker = document.getElementById('textColorPicker');
    if (textColorPicker) {
        textColorPicker.addEventListener('change', function() {
            document.execCommand('foreColor', false, this.value);
            document.getElementById('richEditor').focus();
        });
    }
}

// ===== JOURNAL FUNCTIONS =====
async function displayCurrentUser() {
    try {
        const result = await apiCall('GET', '/auth/me');
        
        if (result.success && result.user) {
            // Update user info in sidebar
            const userName = document.querySelector('.user-name');
            const userEmail = document.querySelector('.user-email');
            
            if (userName) userName.textContent = result.user.username || 'User';
            if (userEmail) userEmail.textContent = result.user.email || 'user@example.com';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

async function loadJournals() {
    try {
        const result = await apiCall('GET', '/journals');
        
        if (result.success) {
            const journalsList = document.getElementById('journalsList');
            journalsList.innerHTML = '';
            
            result.journals.forEach(journal => {
                const journalItem = document.createElement('div');
                journalItem.className = 'journal-item';
                journalItem.innerHTML = `
                    <span class="journal-icon">${journal.icon}</span>
                    <span class="journal-name">${journal.name}</span>
                `;
                
                journalItem.addEventListener('click', function() {
                    selectJournal(journal._id, journal.name);
                });
                
                journalsList.appendChild(journalItem);
            });
            
            // Select first journal by default
            if (result.journals.length > 0) {
                selectJournal(result.journals[0]._id, result.journals[0].name);
            }
        }
    } catch (error) {
        console.error('Error loading journals:', error);
    }
}

async function selectJournal(journalId, journalName) {
    currentJournalId = journalId;
    document.getElementById('currentJournalTitle').textContent = journalName;
    
    // Highlight selected journal
    document.querySelectorAll('.journal-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('.journal-name').textContent === journalName) {
            item.classList.add('active');
        }
    });
    
    // Load entries for this journal
    await loadEntries(journalId);
}

async function createNewJournal() {
    const journalName = prompt('Enter journal name:');
    if (!journalName) return;
    
    try {
        const result = await apiCall('POST', '/journals', { 
            name: journalName,
            icon: '📓'
        });
        
        if (result.success) {
            alert('Journal created successfully!');
            await loadJournals();
        }
    } catch (error) {
        alert('Error creating journal: ' + error.message);
    }
}

// ===== ENTRY FUNCTIONS =====
async function loadEntries(journalId) {
    try {
        const result = await apiCall('GET', `/entries/journal/${journalId}`);
        
        if (result.success) {
            const entriesList = document.getElementById('entriesList');
            entriesList.innerHTML = '';
            
            if (result.entries.length === 0) {
                entriesList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No entries yet. Create your first entry!</p>';
                document.getElementById('entryCount').textContent = '0 entries';
                return;
            }
            
            result.entries.forEach(entry => {
                const entryCard = document.createElement('div');
                entryCard.className = 'entry-card';
                const moodEmoji = getMoodEmoji(entry.mood);
                
                entryCard.innerHTML = `
                    <div class="entry-card-header">
                        <div class="entry-card-title">${entry.title}</div>
                        <div class="entry-card-mood">${moodEmoji}</div>
                    </div>
                    <div class="entry-card-preview">${entry.content.substring(0, 100)}...</div>
                    <div class="entry-card-meta">
                        <span>${new Date(entry.createdAt).toLocaleDateString()}</span>
                        <span class="entry-tags">${entry.tags.map(t => '#' + t).join(' ')}</span>
                    </div>
                `;
                
                entryCard.addEventListener('click', function() {
                    editEntry(entry);
                });
                
                entriesList.appendChild(entryCard);
            });
            
            document.getElementById('entryCount').textContent = result.entries.length + ' entries';
        }
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

function getMoodEmoji(mood) {
    const moods = {
        'happy': '😊',
        'sad': '😢',
        'neutral': '😐',
        'excited': '🤩',
        'calm': '😌',
        'anxious': '😰',
        'grateful': '🙏'
    };
    return moods[mood] || '😐';
}

async function saveEntry() {
    const title = document.getElementById('entryTitle').value || 'Untitled';
    const content = document.getElementById('richEditor').innerHTML;
    const mood = document.getElementById('moodSelect').value;
    const tagsString = document.getElementById('tagsInput').value;
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : [];
    
    if (!currentJournalId) {
        alert('Please select a journal first');
        return;
    }
    
    if (!content || content === '<br>') {
        alert('Please write something in your entry');
        return;
    }
    
    try {
        if (currentEntryId) {
            // Update existing entry
            const result = await apiCall('PUT', `/entries/${currentEntryId}`, {
                title,
                content,
                mood,
                tags
            });
            
            if (result.success) {
                alert('Entry updated successfully!');
            }
        } else {
            // Create new entry
            const result = await apiCall('POST', '/entries', {
                journalId: currentJournalId,
                title,
                content,
                mood,
                tags
            });
            
            if (result.success) {
                alert('Entry created successfully!');
            }
        }
        
        // Reload entries and close editor
        document.getElementById('entryEditor').style.display = 'none';
        document.getElementById('entriesView').style.display = 'block';
        await loadEntries(currentJournalId);
    } catch (error) {
        alert('Error saving entry: ' + error.message);
    }
}

async function editEntry(entry) {
    currentEntryId = entry._id;
    document.getElementById('entryTitle').value = entry.title;
    document.getElementById('richEditor').innerHTML = entry.content;
    document.getElementById('moodSelect').value = entry.mood;
    document.getElementById('tagsInput').value = entry.tags.join(', ');
    
    document.getElementById('entriesView').style.display = 'none';
    document.getElementById('entryEditor').style.display = 'flex';
}

async function saveCustomization() {
    try {
        const coverType = document.getElementById('coverSelect').value;
        const bgColor = document.getElementById('bgColorPicker').value;
        const accentColor = document.getElementById('accentColorPicker').value;
        
        const result = await apiCall('PUT', '/auth/customization', {
            coverType,
            bgColor,
            accentColor
        });
        
        if (result.success) {
            alert('Customization saved!');
            document.getElementById('customizeModal').style.display = 'none';
        }
    } catch (error) {
        alert('Error saving customization: ' + error.message);
    }
}

async function saveSettings() {
    try {
        const username = document.getElementById('settingsUsername').value;
        const currentTheme = document.querySelector('.theme-btn.active').dataset.theme;
        const privateJournals = document.getElementById('privateJournals').checked;
        const autoLockEntries = document.getElementById('autoLockEntries').checked;
        const enableNotifications = document.getElementById('enableNotifications').checked;
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const dailyReminder = document.getElementById('dailyReminder').checked;
        const reminderTime = document.getElementById('reminderTime').value;
        const weeklyDigest = document.getElementById('weeklyDigest').checked;
        
        const result = await apiCall('PUT', '/auth/settings', {
            username,
            theme: currentTheme,
            privateJournals,
            autoLockEntries,
            enableNotifications,
            emailNotifications,
            dailyReminder,
            reminderTime,
            weeklyDigest
        });
        
        if (result.success) {
            localStorage.setItem('currentTheme', currentTheme);
            applyTheme(currentTheme);
            alert('Settings saved successfully! 💾');
            document.getElementById('settingsModal').style.display = 'none';
        }
    } catch (error) {
        alert('Error saving settings: ' + error.message);
    }
}

// ===== THEME MANAGEMENT =====
function applyTheme(themeName) {
    const root = document.documentElement;
    
    const themes = {
        default: {
            '--primary-color': '#6366f1',
            '--dark-bg': '#1a1a2e',
            '--dark-bg-secondary': '#16213e',
            '--dark-bg-tertiary': '#0f3460',
            '--text-light': '#e0e0e0',
            '--text-muted': '#9e9e9e'
        },
        dark: {
            '--primary-color': '#7c3aed',
            '--dark-bg': '#0f0f1e',
            '--dark-bg-secondary': '#1a1a3a',
            '--dark-bg-tertiary': '#2d2d4a',
            '--text-light': '#f0f0f0',
            '--text-muted': '#a0a0a0'
        },
        light: {
            '--primary-color': '#3b82f6',
            '--dark-bg': '#ffffff',
            '--dark-bg-secondary': '#f5f5f5',
            '--dark-bg-tertiary': '#e8e8e8',
            '--text-light': '#1a1a1a',
            '--text-muted': '#666666'
        },
        ocean: {
            '--primary-color': '#06b6d4',
            '--dark-bg': '#0c4a6e',
            '--dark-bg-secondary': '#164e63',
            '--dark-bg-tertiary': '#1e7e8f',
            '--text-light': '#cffafe',
            '--text-muted': '#7dd3fc'
        },
        forest: {
            '--primary-color': '#059669',
            '--dark-bg': '#1f2937',
            '--dark-bg-secondary': '#1b4332',
            '--dark-bg-tertiary': '#2d6a4f',
            '--text-light': '#d1fae5',
            '--text-muted': '#6ee7b7'
        }
    };
    
    if (themes[themeName]) {
        Object.keys(themes[themeName]).forEach(key => {
            root.style.setProperty(key, themes[themeName][key]);
        });
    }
}

async function loadSettings() {
    try {
        const user = await apiCall('GET', '/auth/me');
        const email = user.user.email;
        const username = user.user.username;
        const createdDate = new Date(user.user.createdAt).toLocaleDateString();
        
        // Populate user data
        document.getElementById('settingsUsername').value = username;
        document.getElementById('settingsEmail').value = email;
        document.getElementById('memberSince').value = createdDate;
        
        // Load stored theme
        const savedTheme = localStorage.getItem('currentTheme') || 'default';
        applyTheme(savedTheme);
        
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            }
        });
        
        // Setup theme button listeners
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                applyTheme(this.dataset.theme);
            });
        });
        
        // Load user statistics
        const journalsResult = await apiCall('GET', '/journals');
        document.getElementById('totalJournals').textContent = `Total Journals: ${journalsResult.journals.length}`;
        
        let totalEntries = 0;
        for (const journal of journalsResult.journals) {
            const entriesResult = await apiCall('GET', `/entries?journalId=${journal._id}`);
            totalEntries += entriesResult.entries.length;
        }
        document.getElementById('totalEntries').textContent = `Total Entries: ${totalEntries}`;
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function setupSettingsHandlers() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', async function() {
            await loadSettings();
            settingsModal.style.display = 'block';
        });
    }
    
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', function() {
            settingsModal.style.display = 'none';
        });
    }
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    // Data Management buttons
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportAllData);
    }
    
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', backupEntries);
    }
    
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', deleteAccount);
    }
}

async function exportAllData() {
    try {
        const journalsResult = await apiCall('GET', '/journals');
        const journals = journalsResult.journals;
        
        let allData = {
            exportDate: new Date().toISOString(),
            journals: []
        };
        
        for (const journal of journals) {
            const entriesResult = await apiCall('GET', `/entries?journalId=${journal._id}`);
            allData.journals.push({
                ...journal,
                entries: entriesResult.entries
            });
        }
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `journey-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Data exported successfully! 📥');
    } catch (error) {
        alert('Error exporting data: ' + error.message);
    }
}

async function backupEntries() {
    try {
        const journalsResult = await apiCall('GET', '/journals');
        const journals = journalsResult.journals;
        
        let backupText = `JOURNEY BACKUP - ${new Date().toLocaleDateString()}\n`;
        backupText += '='.repeat(50) + '\n\n';
        
        for (const journal of journals) {
            backupText += `\n📓 Journal: ${journal.name}\n`;
            backupText += '-'.repeat(40) + '\n';
            
            const entriesResult = await apiCall('GET', `/entries?journalId=${journal._id}`);
            
            for (const entry of entriesResult.entries) {
                backupText += `\n📝 ${entry.title}\n`;
                backupText += `Date: ${new Date(entry.createdAt).toLocaleDateString()}\n`;
                backupText += `Mood: ${entry.mood}\n`;
                backupText += `Content: ${entry.content.replace(/<[^>]*>/g, '')}\n`;
                backupText += '---\n';
            }
        }
        
        const backupUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(backupText);
        const backupFileName = `journey-backup-${new Date().toISOString().split('T')[0]}.txt`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', backupUri);
        linkElement.setAttribute('download', backupFileName);
        linkElement.click();
        
        alert('Backup created successfully! 💾');
    } catch (error) {
        alert('Error creating backup: ' + error.message);
    }
}

async function deleteAccount() {
    const confirmDelete = confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.');
    if (!confirmDelete) return;
    
    const secondConfirm = prompt('Type "DELETE" to confirm account deletion:');
    if (secondConfirm !== 'DELETE') {
        alert('Account deletion cancelled.');
        return;
    }
    
    try {
        const result = await apiCall('DELETE', '/auth/account', {});
        if (result.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Account deleted successfully. Redirecting to home...');
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert('Error deleting account: ' + error.message);
    }
}

// ===== VIEW MODE FUNCTIONS =====
function setupViewModes() {
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const entriesList = document.getElementById('entriesList');
    const calendarView = document.getElementById('calendarView');
    const moodChartView = document.getElementById('moodChartView');
    const galleryView = document.getElementById('galleryView');
    const entriesView = document.getElementById('entriesView');
    
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            
            // Hide all views
            if (entriesList) entriesList.style.display = 'none';
            if (calendarView) calendarView.style.display = 'none';
            if (moodChartView) moodChartView.style.display = 'none';
            if (galleryView) galleryView.style.display = 'none';
            
            // Show selected view
            if (view === 'grid' && entriesList) {
                entriesList.style.display = 'grid';
            } else if (view === 'list' && entriesList) {
                entriesList.style.display = 'flex';
                entriesList.style.flexDirection = 'column';
            } else if (view === 'calendar' && calendarView) {
                calendarView.style.display = 'block';
                generateCalendarView();
            }
        });
    });
}

// ===== MEDIA UPLOAD FUNCTIONS =====
function setupMediaButtons() {
    // Image upload
    const imageBtn = document.getElementById('imageBtn');
    if (imageBtn) {
        imageBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async function(e) {
                const file = e.target.files[0];
                if (file && currentEntryId) {
                    await uploadImage(file);
                } else if (file) {
                    alert('Please save the entry first before adding images');
                }
            };
            input.click();
        });
    }
    
    // Voice recording
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', startVoiceRecording);
    }
    
    // Video recording
    const videoBtn = document.getElementById('videoBtn');
    if (videoBtn) {
        videoBtn.addEventListener('click', startVideoRecording);
    }
    
    // Lock entry
    const lockBtn = document.getElementById('lockBtn');
    if (lockBtn) {
        lockBtn.addEventListener('click', function() {
            alert('Entry lock feature coming soon! 🔒');
        });
    }
    
    // Emoji button
    const emojiBtn = document.getElementById('emojiBtn');
    if (emojiBtn) {
        emojiBtn.addEventListener('click', function() {
            const editor = document.getElementById('richEditor');
            const emojis = ['😊', '😢', '😡', '😴', '🤔', '👍', '❤️', '🎉', '🌟', '💪'];
            const emoji = prompt('Choose emoji: ' + emojis.join(' '));
            if (emoji) {
                editor.innerHTML += emoji;
                editor.focus();
            }
        });
    }
}

async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`http://localhost:5000/api/entries/${currentEntryId}/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            },
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            // Add image to preview with correct URL
            const mediaPreview = document.getElementById('mediaPreview');
            if (mediaPreview) {
                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                
                const img = document.createElement('img');
                // Use full URL for image
                img.src = `http://localhost:5000${data.imagePath}`;
                img.style.maxWidth = '200px';
                img.style.height = 'auto';
                img.style.margin = '10px';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '✕';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '5px';
                removeBtn.style.right = '5px';
                removeBtn.style.background = 'rgba(255,0,0,0.7)';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '24px';
                removeBtn.style.height = '24px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = () => imgContainer.remove();
                
                imgContainer.appendChild(img);
                imgContainer.appendChild(removeBtn);
                mediaPreview.appendChild(imgContainer);
            }
            alert('Image uploaded successfully! 🖼️');
        }
    } catch (error) {
        alert('Error uploading image: ' + error.message);
    }
}

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recordingStartTime = 0;

async function startVoiceRecording() {
    if (isRecording) {
        // Stop recording
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            isRecording = false;
        }
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        recordingStartTime = Date.now();
        isRecording = true;
        
        // Update button to show "Stop Recording"
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.innerHTML = '⏹️';
            voiceBtn.style.backgroundColor = '#ff4444';
            voiceBtn.title = 'Stop Voice Recording';
        }
        
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            
            const audioContainer = document.createElement('div');
            audioContainer.style.position = 'relative';
            audioContainer.style.display = 'inline-block';
            audioContainer.style.margin = '10px';
            
            const audio = document.createElement('audio');
            audio.src = url;
            audio.controls = true;
            audio.style.display = 'block';
            audio.style.borderRadius = '8px';
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '✕';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '-12px';
            removeBtn.style.right = '-12px';
            removeBtn.style.background = 'rgba(255,0,0,0.7)';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.width = '24px';
            removeBtn.style.height = '24px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.onclick = () => audioContainer.remove();
            
            audioContainer.appendChild(audio);
            audioContainer.appendChild(removeBtn);
            
            const mediaPreview = document.getElementById('mediaPreview');
            if (mediaPreview) {
                mediaPreview.appendChild(audioContainer);
            }
            
            // Reset button
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.innerHTML = '🎤';
                voiceBtn.style.backgroundColor = '';
                voiceBtn.title = 'Record Voice';
            }
            
            isRecording = false;
            alert('Voice recording saved! 🎤');
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        
        // Auto stop after 30 seconds
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                alert('Voice recording complete! (30 seconds max) 🎤');
            }
        }, 30000);
        
    } catch (error) {
        isRecording = false;
        alert('Voice recording not available: ' + error.message);
    }
}

async function startVideoRecording() {
    if (isRecording) {
        // Stop recording
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            isRecording = false;
        }
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 }, 
            audio: true 
        });
        
        mediaRecorder = new MediaRecorder(stream);
        const videoChunks = [];
        recordingStartTime = Date.now();
        isRecording = true;
        
        // Update button to show "Stop Recording"
        const videoBtn = document.getElementById('videoBtn');
        if (videoBtn) {
            videoBtn.innerHTML = '⏹️';
            videoBtn.style.backgroundColor = '#ff4444';
            videoBtn.title = 'Stop Video Recording';
        }
        
        mediaRecorder.ondataavailable = (e) => {
            videoChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(videoBlob);
            
            const videoContainer = document.createElement('div');
            videoContainer.style.position = 'relative';
            videoContainer.style.display = 'inline-block';
            videoContainer.style.margin = '10px';
            
            const video = document.createElement('video');
            video.src = url;
            video.controls = true;
            video.style.maxWidth = '300px';
            video.style.height = 'auto';
            video.style.borderRadius = '8px';
            video.style.display = 'block';
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '✕';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '-12px';
            removeBtn.style.right = '-12px';
            removeBtn.style.background = 'rgba(255,0,0,0.7)';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '50%';
            removeBtn.style.width = '24px';
            removeBtn.style.height = '24px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.onclick = () => videoContainer.remove();
            
            videoContainer.appendChild(video);
            videoContainer.appendChild(removeBtn);
            
            const mediaPreview = document.getElementById('mediaPreview');
            if (mediaPreview) {
                mediaPreview.appendChild(videoContainer);
            }
            
            // Reset button
            const videoBtn = document.getElementById('videoBtn');
            if (videoBtn) {
                videoBtn.innerHTML = '📹';
                videoBtn.style.backgroundColor = '';
                videoBtn.title = 'Record Video';
            }
            
            isRecording = false;
            alert('Video recording saved! 📹');
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        
        // Auto stop after 60 seconds
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                alert('Video recording complete! (60 seconds max) 📹');
            }
        }, 60000);
        
    } catch (error) {
        isRecording = false;
        alert('Video recording not available: ' + error.message);
    }
}

// ===== CHART FUNCTIONS =====
function generateCalendarView() {
    const calendarView = document.getElementById('calendarView');
    if (!calendarView) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let html = `<h3>${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>`;
    html += '<div class="calendar-grid">';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
        html += '<div class="calendar-empty"></div>';
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        html += `<div class="calendar-day ${isToday ? 'today' : ''}">${day}</div>`;
    }
    
    html += '</div>';
    calendarView.innerHTML = html;
}

// ===== MOOD CHART FUNCTIONS =====
function generateMoodChart() {
    const moodChart = document.getElementById('moodChart');
    if (!moodChart) return;
    
    // Generate sample mood data
    const moods = ['happy', 'sad', 'neutral', 'excited', 'calm', 'anxious', 'grateful'];
    const moodCounts = {
        'happy': Math.floor(Math.random() * 10),
        'sad': Math.floor(Math.random() * 10),
        'neutral': Math.floor(Math.random() * 10),
        'excited': Math.floor(Math.random() * 10),
        'calm': Math.floor(Math.random() * 10),
        'anxious': Math.floor(Math.random() * 10),
        'grateful': Math.floor(Math.random() * 10)
    };
    
    const moodEmojis = {
        'happy': '😊',
        'sad': '😢',
        'neutral': '😐',
        'excited': '🤩',
        'calm': '😌',
        'anxious': '😰',
        'grateful': '🙏'
    };
    
    let html = '<div class="mood-bar-chart">';
    
    for (const mood in moodCounts) {
        const count = moodCounts[mood];
        const percentage = Math.max(count * 5, 10);
        html += `
            <div class="mood-bar-item">
                <div class="mood-label">${moodEmojis[mood]} ${mood}</div>
                <div class="mood-bar">
                    <div class="mood-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="mood-count">${count}</div>
            </div>
        `;
    }
    
    html += '</div>';
    moodChart.innerHTML = html;
}

// ===== PHOTO GALLERY FUNCTIONS =====
function setupGalleryButton() {
    const galleryBtn = document.getElementById('galleryBtn');
    if (galleryBtn) {
        galleryBtn.addEventListener('click', function() {
            const moodChartView = document.getElementById('moodChartView');
            const galleryView = document.getElementById('galleryView');
            const calendarView = document.getElementById('calendarView');
            const entriesList = document.getElementById('entriesList');
            
            if (moodChartView) moodChartView.style.display = 'none';
            if (calendarView) calendarView.style.display = 'none';
            if (entriesList) entriesList.style.display = 'none';
            
            if (galleryView) {
                galleryView.style.display = 'block';
                generatePhotoGallery();
            }
        });
    }
}

function generatePhotoGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Show placeholder gallery
    galleryGrid.innerHTML = `
        <div class="gallery-placeholder">
            <p>No photos yet. Upload images in your entries to see them here! 📷</p>
        </div>
    `;
}

// ===== MOOD CHART BUTTON =====
function setupMoodChartButton() {
    const moodChartBtn = document.getElementById('moodChartBtn');
    if (moodChartBtn) {
        moodChartBtn.addEventListener('click', function() {
            const entriesList = document.getElementById('entriesList');
            const moodChartView = document.getElementById('moodChartView');
            const calendarView = document.getElementById('calendarView');
            const galleryView = document.getElementById('galleryView');
            
            if (entriesList) entriesList.style.display = 'none';
            if (calendarView) calendarView.style.display = 'none';
            if (galleryView) galleryView.style.display = 'none';
            
            if (moodChartView) {
                moodChartView.style.display = 'block';
                generateMoodChart();
            }
        });
    }
}

// Initialize all feature buttons
function initializeAllFeatures() {
    setupViewModes();
    setupMediaButtons();
    setupGalleryButton();
    setupMoodChartButton();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

