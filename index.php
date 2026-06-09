<?php
if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
    header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
?>
require_once 'includes/auth.php';
$auth = Auth::getInstance();
$isLoggedIn = $auth->isLoggedIn();
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الرئيسية</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="language-switcher">
        <button id="langToggle" class="lang-btn">
            <i class="fas fa-language"></i>
            <span id="currentLang">AR</span>
        </button>
    </div>

    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="#">ALX-ZORO</a>
            </div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">الرئيسية</a></li>
                <li><a href="#about" class="nav-link">من نحن</a></li>
                <li><a href="#services" class="nav-link">خدماتنا</a></li>
                <li><a href="#contact" class="nav-link">اتصل بنا</a></li>
                <?php if ($isLoggedIn): ?>
                    <li><a href="logout.php" class="nav-link" style="background:#e74c3c; color:white; padding:8px 20px; border-radius:25px;">تسجيل خروج</a></li>
                <?php else: ?>
                    <li><a href="login.php" class="nav-link login-btn">تسجيل الدخول</a></li>
                <?php endif; ?>
            </ul>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>مرحباً بك في موقعنا</h1>
                <p>نقدم لك أفضل الحلول التقنية بجودة عالية وأسعار مناسبة</p>
                <div class="hero-buttons">
                    <a href="#services" class="btn btn-primary">اكتشف خدماتنا</a>
                    <a href="#contact" class="btn btn-secondary">اتصل بنا</a>
                </div>
            </div>
            <div class="hero-image">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Hero Image">
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>من نحن</h2>
            <div class="about-content">
                <div class="about-text">
                    <h3>قصتنا ورسالتنا</h3>
                    <p>نحن فريق من المحترفين المتخصصين في تقديم حلول تقنية مبتكرة. نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع.</p>
                    <div class="features">
                        <div class="feature"><i class="fas fa-rocket"></i><span>سرعة في الأداء</span></div>
                        <div class="feature"><i class="fas fa-shield-alt"></i><span>أمان وحماية</span></div>
                        <div class="feature"><i class="fas fa-headset"></i><span>دعم فني 24/12</span></div>
                    </div>
                </div>
                <div class="about-stats">
                    <div class="stat"><h4>+500</h4><p>عميل راضي</p></div>
                    <div class="stat"><h4>+150</h4><p>مشروع مكتمل</p></div>
                    <div class="stat"><h4>+3</h4><p>سنوات خبرة</p></div>
                </div>
            </div>
        </div>
    </section>

    <section id="services" class="services">
        <div class="container">
            <h2>خدماتنا</h2>
            <div class="services-grid">
                <div class="service-card"><i class="fas fa-code"></i><h3>تطوير الويب</h3><p>نقوم بتطوير مواقع ويب متكاملة بتقنيات حديثة.</p></div>
                <div class="service-card"><i class="fas fa-mobile-alt"></i><h3>تطبيقات الجوال</h3><p>تصميم وتطوير تطبيقات الجوال.</p></div>
                <div class="service-card"><i class="fas fa-palette"></i><h3>تصميم UI/UX</h3><p>تصميم واجهات مستخدم جذابة وسهلة الاستخدام.</p></div>
                <div class="service-card"><i class="fas fa-cloud"></i><h3>الحلول السحابية</h3><p>توفير حلول سحابية آمنة وقابلة للتطوير.</p></div>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>اتصل بنا</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item"><i class="fas fa-phone"></i><div><h4>الهاتف</h4><p>+201022392915</p></div></div>
                    <div class="contact-item"><i class="fas fa-envelope"></i><div><h4>البريد الإلكتروني</h4><p>kingsoft261@gmail.com</p></div></div>
                    <div class="contact-item"><i class="fas fa-map-marker-alt"></i><div><h4>العنوان</h4><p>الاسكندرية، مصر</p></div></div>
                </div>
                <form class="contact-form" id="contactForm">
                    <input type="text" id="contactName" placeholder="اسمك الكريم" required>
                    <input type="email" id="contactEmailInput" placeholder="بريدك الإلكتروني" required>
                    <textarea id="contactMessage" placeholder="رسالتك" rows="5" required></textarea>
                    <button type="submit" class="btn btn-primary">إرسال الرسالة</button>
                </form>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section"><h3>موقعي</h3><p>نقدم حلولاً تقنية مبتكرة تلبي احتياجاتك.</p></div>
                <div class="footer-section"><h4>روابط سريعة</h4><ul><li><a href="#home">الرئيسية</a></li><li><a href="#about">من نحن</a></li><li><a href="#services">خدماتنا</a></li><li><a href="#contact">اتصل بنا</a></li></ul></div>
                <div class="footer-section"><h4>تابعنا</h4><div class="social-links"><a href="#"><i class="fab fa-facebook"></i></a><a href="#"><i class="fab fa-twitter"></i></a><a href="#"><i class="fab fa-instagram"></i></a><a href="#"><i class="fab fa-linkedin"></i></a></div></div>
            </div>
            <div class="footer-bottom"><p>© 2024 موقعي. جميع الحقوق محفوظة.</p></div>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
        document.getElementById('langToggle').addEventListener('click', function() {
            var currentLang = document.getElementById('currentLang').textContent;
            var newLang = currentLang === 'AR' ? 'EN' : 'AR';
            document.getElementById('currentLang').textContent = newLang;
            document.documentElement.dir = newLang === 'AR' ? 'rtl' : 'ltr';
            document.documentElement.lang = newLang === 'AR' ? 'ar' : 'en';
        });
    </script>
</body>
</html>