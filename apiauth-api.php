<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../includes/auth.php';

$auth = Auth::getInstance();
$response = ['success' => false, 'message' => 'Invalid request'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? $_POST['action'] ?? $_GET['action'] ?? '';
    
    switch ($action) {
        case 'register':
            $response = $auth->register(
                $input['full_name'] ?? '',
                $input['email'] ?? '',
                $input['password'] ?? '',
                $input['confirm_password'] ?? ''
            );
            break;
            
        case 'login':
            $response = $auth->login(
                $input['email'] ?? '',
                $input['password'] ?? ''
            );
            break;
            
        case 'logout':
            $response = $auth->logout();
            break;
            
        case 'check_session':
            $response = [
                'success' => true,
                'logged_in' => $auth->isLoggedIn(),
                'user' => $auth->getCurrentUser()
            ];
            break;
            
        default:
            $response = ['success' => false, 'message' => 'Unknown action'];
    }
}

echo json_encode($response);
?>