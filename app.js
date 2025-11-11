// Frontend JavaScript for navigation and interactions
// This handles all frontend functionality before backend connection

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submissions (for now, just prevent default and show message)
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // For now, just redirect to dashboard
            // Later we'll add actual authentication
            alert('Sign in functionality will be connected to backend soon!');
            window.location.href = 'dashboard.html';
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // For now, just redirect to dashboard
            // Later we'll add actual authentication
            alert('Sign up functionality will be connected to backend soon!');
            window.location.href = 'dashboard.html';
        });
    }
    
    // Dashboard functionality
    if (document.querySelector('.dashboard-page')) {
        initDashboard();
    }
});

// ===== DASHBOARD FUNCTIONALITY =====
function initDashboard() {
    // Journal item clicks
    const journalItems = document.querySelectorAll('.journal-item');
    journalItems.forEach(item => {
        item.addEventListener('click', function() {
            journalItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update journal title
            const journalName = this.querySelector('.journal-name').textContent;
            document.getElementById('currentJournalTitle').textContent = journalName;
        });
    });
    
    // New Journal button
    const newJournalBtn = document.getElementById('newJournalBtn');
    if (newJournalBtn) {
        newJournalBtn.addEventListener('click', function() {
            const journalName = prompt('Enter journal name:');
            if (journalName) {
                alert('New journal "' + journalName + '" will be created when backend is connected!');
            }
        });
    }
    
    // New Entry button
    const newEntryBtn = document.getElementById('newEntryBtn');
    const entryEditor = document.getElementById('entryEditor');
    const entriesView = document.getElementById('entriesView');
    const closeEditorBtn = document.getElementById('closeEditorBtn');
    
    if (newEntryBtn && entryEditor && entriesView) {
        newEntryBtn.addEventListener('click', function() {
            entriesView.style.display = 'none';
            entryEditor.style.display = 'flex';
            document.getElementById('entryTitle').value = '';
            document.getElementById('richEditor').innerHTML = '';
        });
    }
    
    if (closeEditorBtn && entryEditor && entriesView) {
        closeEditorBtn.addEventListener('click', function() {
            entryEditor.style.display = 'none';
            entriesView.style.display = 'block';
        });
    }
    
    // Entry card clicks
    const entryCards = document.querySelectorAll('.entry-card');
    entryCards.forEach(card => {
        card.addEventListener('click', function() {
            if (entryEditor && entriesView) {
                entriesView.style.display = 'none';
                entryEditor.style.display = 'flex';
                
                // Populate editor with entry data
                const title = this.querySelector('.entry-card-title').textContent;
                const preview = this.querySelector('.entry-card-preview').textContent;
                
                document.getElementById('entryTitle').value = title;
                document.getElementById('richEditor').innerHTML = '<p>' + preview + '</p>';
            }
        });
    });
    
    // View mode buttons
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    viewModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.dataset.view;
            alert('View mode: ' + view + ' (Backend connection needed)');
        });
    });
    
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
                window.location.href = 'index.html';
            }
        });
    }
    
    // Save buttons
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    if (saveEntryBtn) {
        saveEntryBtn.addEventListener('click', function() {
            alert('Entry will be saved when backend is connected!');
        });
    }
    
    const saveCustomizationBtn = document.getElementById('saveCustomizationBtn');
    if (saveCustomizationBtn) {
        saveCustomizationBtn.addEventListener('click', function() {
            alert('Customization will be saved when backend is connected!');
            document.getElementById('customizeModal').style.display = 'none';
        });
    }
    
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            alert('Settings will be saved when backend is connected!');
            document.getElementById('settingsModal').style.display = 'none';
        });
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

