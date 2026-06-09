<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die('Invalid request');
    }
}
require_once 'includes/auth.php';

$auth = Auth::getInstance();

if ($auth->isLoggedIn()) {
    header('Location: index.php');
    exit();
}


$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['login'])) {
        $result = $auth->login($_POST['email'], $_POST['password']);
        if ($result['success']) {
            header('Location: index.php');
            exit();
        } else {
            $error = $result['message'];
        }
    }
    
    if (isset($_POST['register'])) {
        $result = $auth->register($_POST['full_name'], $_POST['email'], $_POST['password'], $_POST['confirm_password']);
        if ($result['success']) {
            $success = $result['message'];
        } else {
            $error = $result['message'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style2.css">
</head>
<body>
    <div class="home-button">
        <a href="index.php" class="home-btn">
            <i class="fas fa-home"></i>
            <span>الرئيسية</span>
        </a>
    </div>

    <?php if ($error): ?>
        <div style="position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #e74c3c; color: white; padding: 10px 20px; border-radius: 5px; z-index: 9999;">
            <?php echo $error; ?>
        </div>
    <?php endif; ?>

    <?php if ($success): ?>
        <div style="position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; z-index: 9999;">
            <?php echo $success; ?>
        </div>
    <?php endif; ?>

    <div class="container" id="container">
        <div class="form-container login-container">
            <form method="POST">
                <h1>تسجيل الدخول</h1>
                <div class="input-group">
                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="كلمة المرور" required>
                    <i class="fas fa-lock"></i>
                </div>
                <button type="submit" name="login" class="btn">تسجيل الدخول</button>
            </form>
        </div>

        <div class="form-container register-container">
            <form method="POST">
                <h1>إنشاء حساب</h1>
                <div class="input-group">
                    <input type="text" name="full_name" placeholder="الاسم الكامل" required>
                    <i class="fas fa-user"></i>
                </div>
                <div class="input-group">
                    <input type="email" name="email" placeholder="البريد الإلكتروني" required>
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="input-group">
                    <input type="password" name="password" placeholder="كلمة المرور" required>
                    <i class="fas fa-lock"></i>
                </div>
                <div class="input-group">
                    <input type="password" name="confirm_password" placeholder="تأكيد كلمة المرور" required>
                    <i class="fas fa-lock"></i>
                </div>
                <button type="submit" name="register" class="btn">إنشاء حساب</button>
            </form>
        </div>

        <div class="toggle-container">
            <div class="toggle toggle-left">
                <h1>مرحباً بعودتك!</h1>
                <p>ادخل إلى حسابك للوصول إلى الميزات الحصرية</p>
                <button class="toggle-btn" id="loginToggle">تسجيل الدخول</button>
            </div>
            <div class="toggle toggle-right">
                <h1>أهلاً بك!</h1>
                <p>قم بإنشاء حساب جديد للاستفادة من خدماتنا</p>
                <button class="toggle-btn" id="registerToggle">إنشاء حساب</button>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('loginToggle').addEventListener('click', function() {
            document.getElementById('container').classList.remove('active');
        });
        document.getElementById('registerToggle').addEventListener('click', function() {
            document.getElementById('container').classList.add('active');
        });
        
        setTimeout(function() {
            var msg = document.querySelector('div[style*="position: fixed"]');
            if (msg) msg.style.display = 'none';
        }, 3000);
    </script>
</body>
</html>