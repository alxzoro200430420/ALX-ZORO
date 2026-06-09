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
    
    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'جميع الحقول مطلوبة'];
        }
        
        try {
            $stmt = $this->db->prepare("SELECT id, full_name, email, password, role FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'بيانات غير صحيحة'];
            }
            
            $user = $stmt->fetch();
            
            if (!password_verify($password, $user['password'])) {
                return ['success' => false, 'message' => 'بيانات غير صحيحة'];
            }
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['logged_in'] = true;
            
            return ['success' => true, 'message' => 'تم الدخول بنجاح'];
            
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في النظام'];
        }
    }
    
    public function register($fullName, $email, $password, $confirmPassword) {
        if (empty($fullName) || empty($email) || empty($password)) {
            return ['success' => false, 'message' => 'جميع الحقول مطلوبة'];
        }
        
        if ($password !== $confirmPassword) {
            return ['success' => false, 'message' => 'كلمات المرور غير متطابقة'];
        }
        
        if (strlen($password) < 6) {
            return ['success' => false, 'message' => 'كلمة المرور قصيرة جداً'];
        }
        
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'البريد مسجل مسبقاً'];
            }
            
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$fullName, $email, $hashedPassword]);
            
            return ['success' => true, 'message' => 'تم إنشاء الحساب'];
            
        } catch(PDOException $e) {
            return ['success' => false, 'message' => 'خطأ في النظام'];
        }
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }
    
    public function logout() {
        session_destroy();
        return ['success' => true, 'message' => 'تم الخروج'];
    }
}
?>