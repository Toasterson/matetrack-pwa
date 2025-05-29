// MateTrack PWA - Expense Tracker App
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

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form submissions
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.addExpense(e));
        document.getElementById('drinkForm').addEventListener('submit', (e) => this.addDrink(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.addRegisterPayment(e));
        
        // Clear data button
        document.getElementById('clearDataBtn').addEventListener('click', () => this.clearAllData());
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

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
            id: Date.now(),
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
        this.showFeedback(`Added expense: $${amount.toFixed(2)}`, 'success');
    }

    addDrink(e) {
        e.preventDefault();
        
        const name = document.getElementById('drinkName').value.trim();
        const price = parseFloat(document.getElementById('drinkPrice').value);
        const quantity = parseInt(document.getElementById('drinkQuantity').value);
        
        if (!name || !price || !quantity) {
            this.showFeedback('Please fill in all fields', 'error');
            return;
        }

        const drink = {
            id: Date.now(),
            name: name,
            price: price,
            quantity: quantity,
            totalValue: price * quantity,
            timestamp: new Date().toISOString()
        };

        this.drinks.unshift(drink);
        this.saveDrinks();
        this.renderDrinks();
        this.renderQuickGrabButtons();
        this.resetForm('drinkForm');
        this.showFeedback(`Added ${quantity}x ${name} to inventory`, 'success');
    }

    addQuickGrab(drinkId) {
        const drink = this.drinks.find(d => d.id === drinkId);
        if (!drink) return;

        const grab = {
            id: Date.now(),
            drinkId: drinkId,
            drinkName: drink.name,
            price: drink.price,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        // Also add as expense
        const expense = {
            id: Date.now() + 1,
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
        
        this.showFeedback(`Grabbed ${drink.name} - $${drink.price.toFixed(2)}`, 'success');
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
            id: Date.now(),
            amount: amount,
            note: note || 'Payment to event register',
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };

        this.registerPayments.unshift(payment);
        this.saveRegisterPayments();
        this.updateAllDisplays();
        this.renderRegisterPayments();
        this.resetForm('registerForm');
        this.showFeedback(`Added register payment: $${amount.toFixed(2)}`, 'success');
    }

    updateTotalAmount() {
        // Display total register payments
        const registerTotal = this.registerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        document.getElementById('totalAmount').textContent = registerTotal.toFixed(2);
    }

    calculateRegisterBalance() {
        const registerTotal = this.registerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return registerTotal - totalExpenses;
    }

    updateRegisterSummary() {
        const registerTotal = this.registerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const balance = this.calculateRegisterBalance();
        
        document.getElementById('totalRegisterAmount').textContent = registerTotal.toFixed(2);
        document.getElementById('drinksConsumedAmount').textContent = totalExpenses.toFixed(2);
        
        // Update balance display with appropriate styling
        const balanceElement = document.getElementById('balanceAmount');
        if (balance > 0) {
            balanceElement.textContent = `+$${balance.toFixed(2)}`;
            balanceElement.className = 'summary-amount balance-positive';
        } else if (balance < 0) {
            balanceElement.textContent = `-$${Math.abs(balance).toFixed(2)}`;
            balanceElement.className = 'summary-amount balance-negative';
        } else {
            balanceElement.textContent = '$0.00';
            balanceElement.className = 'summary-amount balance-zero';
        }
        
        // Update header balance display
        this.updateHeaderBalance(balance);
    }

    renderExpenses() {
        const container = document.getElementById('expensesList');
        
        if (this.expenses.length === 0) {
            container.innerHTML = '<p class="empty-state">No expenses yet. Add your first expense above!</p>';
            return;
        }

        container.innerHTML = this.expenses.map(expense => `
            <div class="expense-item">
                <div class="expense-header">
                    <span class="expense-description">${expense.description}</span>
                    <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                </div>
                <div>
                    <span class="expense-category">${expense.category}</span>
                    <span class="expense-time">${expense.date} at ${expense.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderDrinks() {
        const container = document.getElementById('drinksList');
        
        if (this.drinks.length === 0) {
            container.innerHTML = '<p class="empty-state">No drinks added yet. Add drinks to the event above!</p>';
            return;
        }

        container.innerHTML = this.drinks.map(drink => `
            <div class="drink-item">
                <div class="drink-header">
                    <span class="drink-name">${drink.name}</span>
                    <span class="drink-price">$${drink.price.toFixed(2)} each</span>
                </div>
                <div>
                    <span class="drink-quantity">${drink.quantity} units</span>
                    <span class="drink-quantity">Total: $${drink.totalValue.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }

    renderQuickGrabButtons() {
        const container = document.getElementById('quickGrabButtons');
        
        if (this.drinks.length === 0) {
            container.innerHTML = '<p class="empty-state">Add drinks to the inventory first to enable quick grab!</p>';
            return;
        }

        container.innerHTML = this.drinks.map(drink => `
            <button class="btn btn-quick" onclick="app.addQuickGrab(${drink.id})">
                ${drink.name}<br>
                <small>$${drink.price.toFixed(2)}</small>
            </button>
        `).join('');
    }

    renderQuickGrabs() {
        const container = document.getElementById('quickGrabsList');
        const today = new Date().toLocaleDateString();
        const todayGrabs = this.quickGrabs.filter(grab => grab.date === today);
        
        if (todayGrabs.length === 0) {
            container.innerHTML = '<p class="empty-state">No grabs today. Use the buttons above when you grab something!</p>';
            return;
        }

        container.innerHTML = todayGrabs.map(grab => `
            <div class="grab-item">
                <div class="grab-header">
                    <span class="drink-name">${grab.drinkName}</span>
                    <span class="grab-price">$${grab.price.toFixed(2)}</span>
                </div>
                <div>
                    <span class="grab-time">${grab.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderRegisterPayments() {
        const container = document.getElementById('registerPaymentsList');
        
        if (this.registerPayments.length === 0) {
            container.innerHTML = '<p class="empty-state">No register payments yet. Add your first payment above!</p>';
            return;
        }

        container.innerHTML = this.registerPayments.map(payment => `
            <div class="register-item">
                <div class="register-header">
                    <span class="register-note">${payment.note}</span>
                    <span class="register-amount">$${payment.amount.toFixed(2)}</span>
                </div>
                <div>
                    <span class="register-time">${payment.date} at ${payment.time}</span>
                </div>
            </div>
        `).join('');
    }

    showFeedback(message, type) {
        const existingFeedback = document.querySelector('.success-feedback, .error-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.className = type === 'success' ? 'success-feedback' : 'error-feedback';
        feedback.textContent = message;
        
        const firstCard = document.querySelector('.card');
        firstCard.parentNode.insertBefore(feedback, firstCard);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

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
            
            this.showFeedback('All data cleared successfully', 'success');
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

    updateHeaderBalance(balance) {
        const headerBalanceElement = document.getElementById('headerBalance');
        
        if (balance > 0) {
            headerBalanceElement.textContent = `+$${balance.toFixed(2)}`;
            headerBalanceElement.className = 'credit-amount credit-positive';
        } else if (balance < 0) {
            headerBalanceElement.textContent = `-$${Math.abs(balance).toFixed(2)}`;
            headerBalanceElement.className = 'credit-amount credit-negative';
        } else {
            headerBalanceElement.textContent = '$0.00';
            headerBalanceElement.className = 'credit-amount credit-zero';
        }
    }

    updateAllDisplays() {
        this.updateTotalAmount();
        this.updateRegisterSummary();
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
    
    // Show install button or banner
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: linear-gradient(45deg, #4299e1, #667eea); color: white; padding: 1rem; border-radius: 12px; text-align: center; z-index: 1000; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <p style="margin-bottom: 0.5rem; font-weight: 600;">Install MateTrack for the best experience!</p>
            <button onclick="installApp()" style="background: white; color: #4299e1; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Install App</button>
            <button onclick="this.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; margin-left: 0.5rem;">Maybe Later</button>
        </div>
    `;
    document.body.appendChild(installBanner);
});

window.installApp = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        document.querySelector('[onclick="installApp()"]').parentElement.remove();
    }
};

// Handle app installed
window.addEventListener('appinstalled', (evt) => {
    console.log('MateTrack PWA was installed');
});