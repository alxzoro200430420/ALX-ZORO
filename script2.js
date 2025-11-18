
// نظام الترجمة
class TranslationSystem {
    constructor() {
        this.currentLang = this.detectBrowserLanguage();
        this.init();
    }
    
    
    // اكتشاف لغة المتصفح
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ar') ? 'ar' : 'en';
    }
    
    // تهيئة النظام
    init() {
        this.applyLanguage(this.currentLang);
        this.setupEventListeners();
    }
    
    // تطبيق اللغة
    applyLanguage(lang) {
        this.currentLang = lang;
        
        // تغيير اتجاه الصفحة
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // تحديث النصوص
        this.updateTexts();
        
        // تحديث زر اللغة
        this.updateLanguageButton();
        
        // حفظ التفضيل في localStorage
        localStorage.setItem('preferred-language', lang);
    }
    
    // تحديث جميع النصوص
    updateTexts() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                element.textContent = translations[this.currentLang][key];
            }
        });
        
        // تحديث نصوص placeholder
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                element.placeholder = translations[this.currentLang][key];
            }
        });
    }
    
    // تحديث زر اللغة
    updateLanguageButton() {
        const langBtn = document.getElementById('currentLang');
        if (langBtn) {
            langBtn.textContent = this.currentLang === 'ar' ? 'EN' : 'AR';
        }
    }
    
    // تبديل اللغة
    toggleLanguage() {
        const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.applyLanguage(newLang);
    }
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }
}

// نظام النماذج
class FormSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFormListeners();
        this.setupToggleListeners();
    }
    
    // إعداد مستمعي النماذج
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
    
    // إعداد مستمعي التبديل
    setupToggleListeners() {
        const loginToggle = document.getElementById('loginToggle');
        const registerToggle = document.getElementById('registerToggle');
        
        if (loginToggle) {
            loginToggle.addEventListener('click', () => {
                document.getElementById('container').classList.remove('active');
            });
        }
        
        if (registerToggle) {
            registerToggle.addEventListener('click', () => {
                document.getElementById('container').classList.add('active');
            });
        }
    }
    
    // معالجة تسجيل الدخول
    handleLogin() {
        const usernameInput = document.querySelector('#loginForm input[type="text"]');
        const passwordInput = document.querySelector('#loginForm input[type="password"]');
        
        if (usernameInput && passwordInput) {
            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if (username && password) {
                console.log('Login attempt:', { username, password });
                const message = translationSystem.currentLang === 'ar' 
                    ? 'تم تسجيل الدخول بنجاح!' 
                    : 'Login successful!';
                alert(message);
            } else {
                const message = translationSystem.currentLang === 'ar' 
                    ? 'يرجى ملء جميع الحقول' 
                    : 'Please fill all fields';
                alert(message);
            }
        }
    }
    
    // معالجة التسجيل
    handleRegister() {
        const fullNameInput = document.querySelector('#registerForm input[type="text"]');
        const emailInput = document.querySelector('#registerForm input[type="email"]');
        const passwordInputs = document.querySelectorAll('#registerForm input[type="password"]');
        
        if (fullNameInput && emailInput && passwordInputs.length >= 2) {
            const fullName = fullNameInput.value;
            const email = emailInput.value;
            const password = passwordInputs[0].value;
            const confirmPassword = passwordInputs[1].value;
            
            if (fullName && email && password && confirmPassword) {
                if (password !== confirmPassword) {
                    const message = translationSystem.currentLang === 'ar' 
                        ? 'كلمات المرور غير متطابقة' 
                        : 'Passwords do not match';
                    alert(message);
                    return;
                }
                
                console.log('Registration attempt:', { fullName, email, password });
                const message = translationSystem.currentLang === 'ar' 
                    ? 'تم إنشاء الحساب بنجاح!' 
                    : 'Registration successful!';
                alert(message);
                
                // العودة إلى نموذج تسجيل الدخول
                document.getElementById('container').classList.remove('active');
            } else {
                const message = translationSystem.currentLang === 'ar' 
                    ? 'يرجى ملء جميع الحقول' 
                    : 'Please fill all fields';
                alert(message);
            }
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // إنشاء نظام الترجمة أولاً
    window.translationSystem = new TranslationSystem();
    
    // التحقق من اللغة المفضلة المخزنة
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        translationSystem.applyLanguage(savedLang);
    }
    
    // إنشاء نظام النماذج
    window.formSystem = new FormSystem();
    
    // إضافة تأثيرات للحقول
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// إضافة CSS للفوكس
const style = document.createElement('style');
style.textContent = `
    .input-group.focused i {
        color: var(--primary-color);
    }
    .input-group.focused input {
        border-color: var(--primary-color);
    }
`;
document.head.appendChild(style);
