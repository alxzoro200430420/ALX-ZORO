<?php
require_once __DIR__ . '/../config/database.php';

class Auth {
    private $db;
    private static $instance = null;
    
    private function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->startSession();
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Auth();
        }
        return self::$instance;
    }
    
    private function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    public function register($fullName, $email, $password, $confirmPassword) {
        // التحقق من صحة البيانات
        if (empty($fullName) || empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'يرجى ملء جميع الحقول'];
        }
        
        if ($password !== $confirmPassword) {
            return ['success' => false, 'message' => 'كلمات المرور غير متطابقة'];
        }
        
        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'];
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'البريد الإلكتروني غير صحيح'];
        }
        
        try {
            // التحقق من وجود المستخدم
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً'];
            }
            
            // إنشاء الحساب
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $verificationToken = bin2hex(random_bytes(32));
            
            $stmt = $this->db->prepare("
                INSERT INTO users (full_name, email, password, verification_token) 
                VALUES (?, ?, ?, ?)
            ");
            
            $stmt->execute([$fullName, $email, $hashedPassword, $verificationToken]);
            $userId = $this->db->lastInsertId();
            
            // يمكن إضافة إرسال بريد تأكيد هنا
            
            return ['success' => true, 'message' => 'تم إنشاء الحساب بنجاح', 'user_id' => $userId];
            
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'حدث خطأ، يرجى المحاولة لاحقاً'];
        }
    }
    
    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'يرجى إدخال البريد الإلكتروني وكلمة المرور'];
        }
        
        try {
            $stmt = $this->db->prepare("
                SELECT id, full_name, email, password, role, is_active, email_verified 
                FROM users 
                WHERE email = ?
            ");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'];
            }
            
            $user = $stmt->fetch();
            
            if (!password_verify($password, $user['password'])) {
                return ['success' => false, 'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'];
            }
            
            if (!$user['is_active']) {
                return ['success' => false, 'message' => 'الحساب غير مفعل'];
            }
            
            // تحديث آخر تسجيل دخول
            $updateStmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            
            // إنشاء جلسة
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['logged_in'] = true;
            
            // إنشاء token للجلسة (اختياري)
            $sessionToken = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
            
            $tokenStmt = $this->db->prepare("
                INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $tokenStmt->execute([
                $user['id'],
                $sessionToken,
                $_SERVER['REMOTE_ADDR'] ?? null,
                $_SERVER['HTTP_USER_AGENT'] ?? null,
                $expiresAt
            ]);
            
            $_SESSION['session_token'] = $sessionToken;
            
            return ['success' => true, 'message' => 'تم تسجيل الدخول بنجاح', 'user' => $user];
            
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'حدث خطأ، يرجى المحاولة لاحقاً'];
        }
    }
    
    public function logout() {
        if (isset($_SESSION['session_token'])) {
            $stmt = $this->db->prepare("DELETE FROM user_sessions WHERE session_token = ?");
            $stmt->execute([$_SESSION['session_token']]);
        }
        
        $_SESSION = array();
        
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        session_destroy();
        return ['success' => true, 'message' => 'تم تسجيل الخروج بنجاح'];
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }
    
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        try {
            $stmt = $this->db->prepare("
                SELECT id, full_name, email, role, created_at, last_login 
                FROM users 
                WHERE id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            return $stmt->fetch();
        } catch(PDOException $e) {
            return null;
        }
    }
    
    public function isAdmin() {
        return $this->isLoggedIn() && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
    }
    
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header('Location: login.html');
            exit();
        }
    }
    
    public function requireAdmin() {
        if (!$this->isAdmin()) {
            header('Location: index.html');
            exit();
        }
    }
}
?>