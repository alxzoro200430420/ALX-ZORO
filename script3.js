// نظام الترجمة
class TranslationSystem {
    constructor() {
        this.currentLang = this.detectBrowserLanguage();
        this.init();
    }
    
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ar') ? 'ar' : 'en';
    }
    
    init() {
        this.applyLanguage(this.currentLang);
        this.setupEventListeners();
    }
    
    applyLanguage(lang) {
        this.currentLang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        this.updateTexts();
        this.updateLanguageButton();
        localStorage.setItem('preferred-language', lang);
    }
    
    updateTexts() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                element.textContent = translations[this.currentLang][key];
            }
        });
        
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                element.placeholder = translations[this.currentLang][key];
            }
        });
    }
    
    updateLanguageButton() {
        const langBtn = document.getElementById('currentLang');
        if (langBtn) {
            langBtn.textContent = this.currentLang === 'ar' ? 'EN' : 'AR';
        }
    }
    
    toggleLanguage() {
        const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.applyLanguage(newLang);
    }
    
    setupEventListeners() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }
}

// نظام النماذج مع Supabase
class FormSystem {
    constructor() {
        this.init();
    }
    
    async init() {
        this.setupFormListeners();
        this.setupToggleListeners();
        await this.checkExistingSession();
    }
    
    setupFormListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }
    
    setupToggleListeners() {
        const loginToggle = document.getElementById('loginToggle');
        const registerToggle = document.getElementById('registerToggle');
        
        if (loginToggle) {
            loginToggle.addEventListener('click', () => {
                this.switchToLogin();
            });
        }
        
        if (registerToggle) {
            registerToggle.addEventListener('click', () => {
                this.switchToRegister();
            });
        }
    }
    
    // أنيميشن للتبديل بين النماذج
    switchToLogin() {
        const container = document.getElementById('container');
        container.classList.remove('active');
        // أنيميشن إضافي
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 300);
    }
    
    switchToRegister() {
        const container = document.getElementById('container');
        container.classList.add('active');
        // أنيميشن إضافي
        container.style.transform = 'scale(0.98)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 300);
    }
    
    // معالجة تسجيل الدخول مع Supabase
    async handleLogin() {
        const emailInput = document.querySelector('#loginForm input[type="text"]');
        const passwordInput = document.querySelector('#loginForm input[type="password"]');
        
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            this.showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }

        const loginBtn = document.querySelector('#loginForm .btn');
        const originalText = loginBtn.textContent;
        
        // أنيميشن الزر
        loginBtn.style.transform = 'scale(0.95)';
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الدخول...';
        loginBtn.disabled = true;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            this.showMessage('✅ تم تسجيل الدخول بنجاح!', 'success');
            
            // أنيميشن النجاح
            loginBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            localStorage.setItem('supabase_session', JSON.stringify(data.session));
            localStorage.setItem('current_user', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage(this.translateError(error.message), 'error');
            
            // أنيميشن الخطأ
            loginBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            setTimeout(() => {
                loginBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            }, 1000);
        } finally {
            setTimeout(() => {
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
                loginBtn.style.transform = 'scale(1)';
            }, 1000);
        }
    }
    
    // معالجة التسجيل مع Supabase
    async handleRegister() {
        const fullNameInput = document.querySelector('#registerForm input[type="text"]');
        const emailInput = document.querySelector('#registerForm input[type="email"]');
        const passwordInputs = document.querySelectorAll('#registerForm input[type="password"]');
        
        const fullName = fullNameInput.value;
        const email = emailInput.value;
        const password = passwordInputs[0].value;
        const confirmPassword = passwordInputs[1].value;

        if (!fullName || !email || !password) {
            this.showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('كلمات المرور غير متطابقة', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        const registerBtn = document.querySelector('#registerForm .btn');
        const originalText = registerBtn.textContent;
        
        // أنيميشن الزر
        registerBtn.style.transform = 'scale(0.95)';
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
        registerBtn.disabled = true;

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { 
                            id: authData.user.id,
                            full_name: fullName,
                            email: email
                        }
                    ]);

                if (profileError) throw profileError;
            }

            this.showMessage('✅ تم إنشاء الحساب بنجاح! راجع بريدك الإلكتروني للتأكيد', 'success');
            
            // أنيميشن النجاح
            registerBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            // مسح الحقول بأنيميشن
            this.clearFormWithAnimation('#registerForm');
            
            setTimeout(() => {
                this.switchToLogin();
            }, 4000);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage(this.translateError(error.message), 'error');
            
            // أنيميشن الخطأ
            registerBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            setTimeout(() => {
                registerBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
            }, 1000);
        } finally {
            setTimeout(() => {
                registerBtn.textContent = originalText;
                registerBtn.disabled = false;
                registerBtn.style.transform = 'scale(1)';
            }, 1000);
        }
    }

    // مسح الحقول بأنيميشن
    clearFormWithAnimation(formSelector) {
        const inputs = document.querySelectorAll(`${formSelector} input`);
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.transform = 'translateX(-10px)';
                input.style.opacity = '0.5';
                setTimeout(() => {
                    input.value = '';
                    input.style.transform = 'translateX(0)';
                    input.style.opacity = '1';
                }, 300);
            }, index * 100);
        });
    }

    async checkExistingSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = 'index.html';
        }
    }

    showMessage(message, type = 'info') {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            ${message}
        `;
        
        // أنيميشن الرسالة
        messageElement.style.animation = 'slideIn 0.5s ease-out, bounce 0.5s ease 0.3s';
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 500);
            }
        }, 4000);
    }

    translateError(errorMessage) {
        const errorTranslations = {
            'ar': {
                'Invalid login credentials': 'بيانات الدخول غير صحيحة',
                'Email not confirmed': 'البريد الإلكتروني غير مفعل',
                'User already registered': 'البريد الإلكتروني مسجل مسبقاً',
                'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                'To signup, please provide your email': 'يرجى إدخال بريد إلكتروني صحيح'
            },
            'en': {
                'Invalid login credentials': 'Invalid login credentials',
                'Email not confirmed': 'Email not confirmed',
                'User already registered': 'User already registered',
                'Password should be at least 6 characters': 'Password should be at least 6 characters',
                'To signup, please provide your email': 'Please provide a valid email'
            }
        };
        
        const lang = translationSystem?.currentLang || 'ar';
        return errorTranslations[lang][errorMessage] || errorMessage;
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async () => {
    // أنيميشن تحميل الصفحة
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    window.translationSystem = new TranslationSystem();
    
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        translationSystem.applyLanguage(savedLang);
    }
    
    if (typeof supabase === 'undefined') {
        console.error('Supabase not loaded!');
        return;
    }
    
    window.formSystem = new FormSystem();
    
    // إضافة تأثيرات للحقول
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = 'scale(1)';
        });
        
        // أنيميشن عند الكتابة
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = '#27ae60';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    });
    
    // أنيميشن ظهور الصفحة
    setTimeout(() => {
        document.body.style.transition = 'all 0.8s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});

// إضافة CSS للأنيميشن
const style = document.createElement('style');
style.textContent = `
    .input-group.focused i {
        color: var(--primary-color);
        transform: scale(1.2);
        transition: all 0.3s ease;
    }
    .input-group.focused input {
        border-color: var(--primary-color);
        box-shadow: 0 0 15px rgba(106, 17, 203, 0.2);
    }
    
    .form-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    [dir="rtl"] .form-message {
        right: auto;
        left: 20px;
    }
    .form-message-success { background: #27ae60; }
    .form-message-error { background: #e74c3c; }
    .form-message-info { background: #3498db; }
    
    @keyframes slideIn {
        from { 
            transform: translateY(-100px); 
            opacity: 0; 
        }
        to { 
            transform: translateY(0); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOut {
        from { 
            transform: translateY(0); 
            opacity: 1; 
        }
        to { 
            transform: translateY(-100px); 
            opacity: 0; 
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
        }
        40%, 43% {
            transform: translateY(-10px);
        }
        70% {
            transform: translateY(-5px);
        }
    }
    
    .fa-spinner { 
        animation: spin 1s linear infinite; 
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* أنيميشن للزر عند الضغط */
    .btn:active {
        transform: scale(0.95) !important;
    }
    
    /* أنيميشن للحقول */
    .input-group input {
        transition: all 0.3s ease;
    }
    
    /* أنيميشن للصفحة */
    body {
        transition: all 0.8s ease;
    }
`;
document.head.appendChild(style);