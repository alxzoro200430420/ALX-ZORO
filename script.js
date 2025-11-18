// نظام الترجمة
const translations = {
    en: {

        "navLogo": "ALX-ZORO",
        "navHome": "Home",
        "navAbout": "About Us",
        "navServices": "Services",
        "navContact": "Contact Us",
        "navLogin": "Login",
        

        "heroTitle": "Welcome to Our Website",
        "heroSubtitle": "We provide you with the best technical solutions with high quality and affordable prices",
        "heroServicesBtn": "Discover Our Services",
        "heroContactBtn": "Contact Us",
        

        "aboutTitle": "About Us",
        "aboutSubtitle": "Our Story and Mission",
        "aboutDescription": "We are a team of professionals specialized in providing innovative technical solutions. We believe that technology should be accessible to everyone.",
        "aboutFeature1": "Fast Performance",
        "aboutFeature2": "Security & Protection",
        "aboutFeature3": "24/12 Technical Support",
        "aboutStat1": "Satisfied Clients",
        "aboutStat2": "Completed Projects",
        "aboutStat3": "Years of Experience",
        

        "servicesTitle": "Our Services",
        "service1Title": "Web Development",
        "service1Desc": "We develop complete websites with modern technologies and responsive designs.",
        "service2Title": "Mobile Apps",
        "service2Desc": "Design and development of mobile applications for iOS and Android systems.",
        "service3Title": "UI/UX Design",
        "service3Desc": "Design attractive and easy-to-use user interfaces.",
        "service4Title": "Cloud Solutions",
        "service4Desc": "Providing secure and scalable cloud solutions.",
        

        "contactTitle": "Contact Us",
        "contactPhone": "Phone",
        "contactEmail": "Email",
        "contactAddress": "Address",
        "contactLocation": "Alexandria, Egypt",
        "contactName": "Your Name",
        "contactEmailInput": "Your Email",
        "contactMessage": "Your Message",
        "contactSubmit": "Send Message",
        

        "footerLogo": "MySite",
        "footerDesc": "We provide innovative technical solutions that meet your needs.",
        "footerLinks": "Quick Links",
        "footerHome": "Home",
        "footerAbout": "About Us",
        "footerServices": "Services",
        "footerContact": "Contact Us",
        "footerFollow": "Follow Us",
        "footerCopyright": "© 2024 MySite. All rights reserved."
    },
    ar: {

        "navLogo": "ALX-ZORO",
        "navHome": "الرئيسية",
        "navAbout": "من نحن",
        "navServices": "خدماتنا",
        "navContact": "اتصل بنا",
        "navLogin": "تسجيل الدخول",
        

        "heroTitle": "مرحباً بك في موقعنا",
        "heroSubtitle": "نقدم لك أفضل الحلول التقنية بجودة عالية وأسعار مناسبة",
        "heroServicesBtn": "اكتشف خدماتنا",
        "heroContactBtn": "اتصل بنا",
        

        "aboutTitle": "من نحن",
        "aboutSubtitle": "قصتنا ورسالتنا",
        "aboutDescription": "نحن فريق من المحترفين المتخصصين في تقديم حلول تقنية مبتكرة. نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع.",
        "aboutFeature1": "سرعة في الأداء",
        "aboutFeature2": "أمان وحماية",
        "aboutFeature3": "دعم فني 24/12",
        "aboutStat1": "عميل راضي",
        "aboutStat2": "مشروع مكتمل",
        "aboutStat3": "سنوات خبرة",
        

        "servicesTitle": "خدماتنا",
        "service1Title": "تطوير الويب",
        "service1Desc": "نقوم بتطوير مواقع ويب متكاملة بتقنيات حديثة وتصميمات responsive.",
        "service2Title": "تطبيقات الجوال",
        "service2Desc": "تصميم وتطوير تطبيقات الجوال لأنظمة iOS و Android.",
        "service3Title": "تصميم UI/UX",
        "service3Desc": "تصميم واجهات مستخدم جذابة وسهلة الاستخدام.",
        "service4Title": "الحلول السحابية",
        "service4Desc": "توفير حلول سحابية آمنة وقابلة للتطوير.",
        

        "contactTitle": "اتصل بنا",
        "contactPhone": "الهاتف",
        "contactEmail": "البريد الإلكتروني",
        "contactAddress": "العنوان",
        "contactLocation": "الاسكندرية، مصر",
        "contactName": "اسمك الكريم",
        "contactEmailInput": "بريدك الإلكتروني",
        "contactMessage": "رسالتك",
        "contactSubmit": "إرسال الرسالة",
        

        "footerLogo": "موقعي",
        "footerDesc": "نقدم حلولاً تقنية مبتكرة تلبي احتياجاتك.",
        "footerLinks": "روابط سريعة",
        "footerHome": "الرئيسية",
        "footerAbout": "من نحن",
        "footerServices": "خدماتنا",
        "footerContact": "اتصل بنا",
        "footerFollow": "تابعنا",
        "footerCopyright": "© 2024 موقعي. جميع الحقوق محفوظة."
    }
};

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

        for (const [id, text] of Object.entries(translations[this.currentLang])) {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        }
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


class MainSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupContactForm();
        this.setupMobileMenu();
        this.setupScrollEffects();
    }
    
    setupNavigation() {

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
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = translationSystem.currentLang === 'ar' 
                    ? 'شكراً لك! سنتواصل معك قريباً.' 
                    : 'Thank you! We will contact you soon.';
                alert(message);
                contactForm.reset();
            });
        }
    }
    
    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
            

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }
    
    setupScrollEffects() {

        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.background = 'var(--white)';
                    navbar.style.backdropFilter = 'none';
                }
            }
        });
        

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        

        document.querySelectorAll('.service-card, .about-content, .contact-content').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {

    window.translationSystem = new TranslationSystem();
    

    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        translationSystem.applyLanguage(savedLang);
    }
    

    window.mainSystem = new MainSystem();
    

    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = navbarHeight + 'px';
});