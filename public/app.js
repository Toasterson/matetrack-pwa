// MateTrack PWA - Personal Drink Tab Tracker
class MateTrackApp {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('matetrack_expenses') || '[]');
        this.drinks = JSON.parse(localStorage.getItem('matetrack_drinks') || '[]');
        this.quickGrabs = JSON.parse(localStorage.getItem('matetrack_grabs') || '[]');
        this.registerPayments = JSON.parse(localStorage.getItem('matetrack_register') || '[]');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAllDisplays();
        this.renderExpenses();
        this.renderDrinks();
        this.renderQuickGrabButtons();
        this.renderQuickGrabs();
        this.renderRegisterPayments();
    }

    // --- Utilities ---

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    // --- Event Listeners ---

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submissions
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.addExpense(e));
        document.getElementById('drinkForm').addEventListener('submit', (e) => this.addDrink(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.addRegisterPayment(e));

        // Hamburger menu
        const menuToggle = document.getElementById('menuToggle');
        const menuDropdown = document.getElementById('menuDropdown');
        if (menuToggle && menuDropdown) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('open');
            });
            document.addEventListener('click', () => {
                menuDropdown.classList.remove('open');
            });
            menuDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Clear data button
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearAllData());
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    // --- Add Actions ---

    addExpense(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const description = document.getElementById('expenseDescription').value.trim();
        const category = document.getElementById('expenseCategory').value;

        if (!amount || !description || !category) {
            this.showFeedback('Please fill in all fields', 'error');
            return;
        }

        const expense = {
            id: this.generateId(),
            amount: amount,
            description: description,
            category: category,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        this.expenses.unshift(expense);
        this.saveExpenses();
        this.updateAllDisplays();
        this.renderExpenses();
        this.resetForm('expenseForm');
        this.showFeedback(`Added expense: CHF ${amount.toFixed(2)}`, 'success');
    }

    addDrink(e) {
        e.preventDefault();

        const name = document.getElementById('drinkName').value.trim();
        const price = parseFloat(document.getElementById('drinkPrice').value);

        if (!name || !price) {
            this.showFeedback('Please fill in all fields', 'error');
            return;
        }

        const drink = {
            id: this.generateId(),
            name: name,
            price: price,
            timestamp: new Date().toISOString()
        };

        this.drinks.unshift(drink);
        this.saveDrinks();
        this.renderDrinks();
        this.renderQuickGrabButtons();
        this.resetForm('drinkForm');
        this.showFeedback(`Added ${name} (CHF ${price.toFixed(2)})`, 'success');
    }

    addQuickGrab(drinkId) {
        const drink = this.drinks.find(d => d.id === drinkId);
        if (!drink) return;

        const grab = {
            id: this.generateId(),
            drinkId: drinkId,
            drinkName: drink.name,
            price: drink.price,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        const expense = {
            id: this.generateId(),
            amount: drink.price,
            description: `Quick grab: ${drink.name}`,
            category: 'drinks',
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        this.quickGrabs.unshift(grab);
        this.expenses.unshift(expense);

        this.saveQuickGrabs();
        this.saveExpenses();
        this.updateAllDisplays();
        this.renderExpenses();
        this.renderQuickGrabs();

        this.showFeedback(`Grabbed ${drink.name} — CHF ${drink.price.toFixed(2)}`, 'success');
    }

    addRegisterPayment(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('registerAmount').value);
        const note = document.getElementById('registerNote').value.trim();

        if (!amount) {
            this.showFeedback('Please enter an amount', 'error');
            return;
        }

        const payment = {
            id: this.generateId(),
            amount: amount,
            note: note || 'Payment to register',
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        this.registerPayments.unshift(payment);
        this.saveRegisterPayments();
        this.updateAllDisplays();
        this.renderRegisterPayments();
        this.resetForm('registerForm');
        this.showFeedback(`Paid in: CHF ${amount.toFixed(2)}`, 'success');
    }

    // --- Delete Actions ---

    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.saveExpenses();
        this.updateAllDisplays();
        this.renderExpenses();
    }

    deleteDrink(id) {
        this.drinks = this.drinks.filter(d => d.id !== id);
        this.saveDrinks();
        this.renderDrinks();
        this.renderQuickGrabButtons();
    }

    deleteGrab(id) {
        this.quickGrabs = this.quickGrabs.filter(g => g.id !== id);
        this.saveQuickGrabs();
        this.renderQuickGrabs();
    }

    deleteRegisterPayment(id) {
        this.registerPayments = this.registerPayments.filter(p => p.id !== id);
        this.saveRegisterPayments();
        this.updateAllDisplays();
        this.renderRegisterPayments();
    }

    // --- Display Updates ---

    updateTotalAmount() {
        const registerTotal = this.registerPayments.reduce((sum, p) => sum + p.amount, 0);
        document.getElementById('totalAmount').textContent = registerTotal.toFixed(2);
    }

    calculateRegisterBalance() {
        const registerTotal = this.registerPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        return registerTotal - totalExpenses;
    }

    updateRegisterSummary() {
        const registerTotal = this.registerPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const balance = this.calculateRegisterBalance();

        document.getElementById('totalRegisterAmount').textContent = registerTotal.toFixed(2);
        document.getElementById('drinksConsumedAmount').textContent = totalExpenses.toFixed(2);

        const balanceElement = document.getElementById('balanceAmount');
        if (balance > 0) {
            balanceElement.textContent = `+${balance.toFixed(2)}`;
            balanceElement.className = 'summary-amount balance-positive';
        } else if (balance < 0) {
            balanceElement.textContent = `-${Math.abs(balance).toFixed(2)}`;
            balanceElement.className = 'summary-amount balance-negative';
        } else {
            balanceElement.textContent = '0.00';
            balanceElement.className = 'summary-amount balance-zero';
        }

        this.updateHeaderBalance(balance);
    }

    updateHeaderBalance(balance) {
        const el = document.getElementById('headerBalance');

        if (balance > 0) {
            el.textContent = `CHF ${balance.toFixed(2)}`;
            el.className = 'credit-amount credit-positive';
            document.getElementById('headerBalanceLabel').textContent = 'Credit:';
        } else if (balance < 0) {
            el.textContent = `CHF ${Math.abs(balance).toFixed(2)}`;
            el.className = 'credit-amount credit-negative';
            document.getElementById('headerBalanceLabel').textContent = 'You owe:';
        } else {
            el.textContent = 'CHF 0.00';
            el.className = 'credit-amount credit-zero';
            document.getElementById('headerBalanceLabel').textContent = 'Balance:';
        }
    }

    updateAllDisplays() {
        this.updateTotalAmount();
        this.updateRegisterSummary();
    }

    // --- Renderers ---

    renderExpenses() {
        const container = document.getElementById('expensesList');

        if (this.expenses.length === 0) {
            container.innerHTML = '<p class="empty-state">No expenses yet. Grab a drink or add one manually!</p>';
            return;
        }

        container.innerHTML = this.expenses.map(expense => `
            <div class="expense-item">
                <div class="expense-header">
                    <span class="expense-description">${this.escapeHtml(expense.description)}</span>
                    <span class="expense-amount">CHF ${expense.amount.toFixed(2)}</span>
                </div>
                <div class="item-meta">
                    <span class="expense-category">${this.escapeHtml(expense.category)}</span>
                    <span class="expense-time">${this.escapeHtml(expense.date)} ${this.escapeHtml(expense.time)}</span>
                    <button class="btn-delete" onclick="app.deleteExpense('${expense.id}')" title="Delete">&#x2715;</button>
                </div>
            </div>
        `).join('');
    }

    renderDrinks() {
        const container = document.getElementById('drinksList');

        if (this.drinks.length === 0) {
            container.innerHTML = '<p class="empty-state">No drinks set up yet. Add available drinks above!</p>';
            return;
        }

        container.innerHTML = this.drinks.map(drink => `
            <div class="drink-item">
                <div class="drink-header">
                    <span class="drink-name">${this.escapeHtml(drink.name)}</span>
                    <span class="drink-price">CHF ${drink.price.toFixed(2)}</span>
                </div>
                <div class="item-meta">
                    <button class="btn-delete" onclick="app.deleteDrink('${drink.id}')" title="Delete">&#x2715;</button>
                </div>
            </div>
        `).join('');
    }

    renderQuickGrabButtons() {
        const container = document.getElementById('quickGrabButtons');

        if (this.drinks.length === 0) {
            container.innerHTML = '<p class="empty-state">Set up drinks in the Inventory tab first!</p>';
            return;
        }

        container.innerHTML = this.drinks.map(drink => `
            <button class="btn btn-quick" onclick="app.addQuickGrab('${drink.id}')">
                ${this.escapeHtml(drink.name)}<br>
                <small>CHF ${drink.price.toFixed(2)}</small>
            </button>
        `).join('');
    }

    renderQuickGrabs() {
        const container = document.getElementById('quickGrabsList');
        const today = new Date().toLocaleDateString();
        const todayGrabs = this.quickGrabs.filter(grab => grab.date === today);

        if (todayGrabs.length === 0) {
            container.innerHTML = '<p class="empty-state">No grabs today. Tap a button above when you grab something!</p>';
            return;
        }

        container.innerHTML = todayGrabs.map(grab => `
            <div class="grab-item">
                <div class="grab-header">
                    <span class="drink-name">${this.escapeHtml(grab.drinkName)}</span>
                    <span class="grab-price">CHF ${grab.price.toFixed(2)}</span>
                </div>
                <div class="item-meta">
                    <span class="grab-time">${this.escapeHtml(grab.time)}</span>
                    <button class="btn-delete" onclick="app.deleteGrab('${grab.id}')" title="Delete">&#x2715;</button>
                </div>
            </div>
        `).join('');
    }

    renderRegisterPayments() {
        const container = document.getElementById('registerPaymentsList');

        if (this.registerPayments.length === 0) {
            container.innerHTML = '<p class="empty-state">No payments yet. Log when you hand cash to the organizer!</p>';
            return;
        }

        container.innerHTML = this.registerPayments.map(payment => `
            <div class="register-item">
                <div class="register-header">
                    <span class="register-note">${this.escapeHtml(payment.note)}</span>
                    <span class="register-amount">CHF ${payment.amount.toFixed(2)}</span>
                </div>
                <div class="item-meta">
                    <span class="register-time">${this.escapeHtml(payment.date)} ${this.escapeHtml(payment.time)}</span>
                    <button class="btn-delete" onclick="app.deleteRegisterPayment('${payment.id}')" title="Delete">&#x2715;</button>
                </div>
            </div>
        `).join('');
    }

    // --- Feedback ---

    showFeedback(message, type) {
        const existingFeedback = document.querySelector('.success-feedback, .error-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.className = type === 'success' ? 'success-feedback' : 'error-feedback';
        feedback.textContent = message;

        // Insert into the currently active tab, or before the header if no active tab card
        const activeTab = document.querySelector('.tab-content.active');
        const targetCard = activeTab ? activeTab.querySelector('.card') : document.querySelector('.card');
        if (targetCard) {
            targetCard.parentNode.insertBefore(feedback, targetCard);
        }

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    // --- Form / Data ---

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.expenses = [];
            this.drinks = [];
            this.quickGrabs = [];
            this.registerPayments = [];

            localStorage.removeItem('matetrack_expenses');
            localStorage.removeItem('matetrack_drinks');
            localStorage.removeItem('matetrack_grabs');
            localStorage.removeItem('matetrack_register');

            this.updateAllDisplays();
            this.renderExpenses();
            this.renderDrinks();
            this.renderQuickGrabButtons();
            this.renderQuickGrabs();
            this.renderRegisterPayments();

            // Close the menu
            const menu = document.getElementById('menuDropdown');
            if (menu) menu.classList.remove('open');

            this.showFeedback('All data cleared', 'success');
        }
    }

    saveExpenses() {
        localStorage.setItem('matetrack_expenses', JSON.stringify(this.expenses));
    }

    saveDrinks() {
        localStorage.setItem('matetrack_drinks', JSON.stringify(this.drinks));
    }

    saveQuickGrabs() {
        localStorage.setItem('matetrack_grabs', JSON.stringify(this.quickGrabs));
    }

    saveRegisterPayments() {
        localStorage.setItem('matetrack_register', JSON.stringify(this.registerPayments));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MateTrackApp();
});

// Add to home screen prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBanner = document.createElement('div');
    installBanner.className = 'install-banner';
    installBanner.innerHTML = `
        <p>Install MateTrack for the best experience!</p>
        <div class="install-banner-actions">
            <button class="btn-install" onclick="installApp()">Install</button>
            <button class="btn-dismiss" onclick="this.closest('.install-banner').remove()">Later</button>
        </div>
    `;
    document.body.appendChild(installBanner);
});

window.installApp = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        const banner = document.querySelector('.install-banner');
        if (banner) banner.remove();
    }
};

window.addEventListener('appinstalled', () => {
    console.log('MateTrack PWA was installed');
});
