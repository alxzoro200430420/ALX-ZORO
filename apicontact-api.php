<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../includes/auth.php';

$db = Database::getInstance()->getConnection();
$auth = Auth::getInstance();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $message = $input['message'] ?? '';
    
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'يرجى ملء جميع الحقول']);
        exit();
    }
    
    try {
        $userId = $auth->isLoggedIn() ? $_SESSION['user_id'] : null;
        
        $stmt = $db->prepare("
            INSERT INTO messages (user_id, name, email, message) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $name, $email, $message]);
        
        echo json_encode(['success' => true, 'message' => 'تم إرسال رسالتك بنجاح']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'حدث خطأ، يرجى المحاولة لاحقاً']);
    }
}
?>