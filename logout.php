<?php
require_once 'includes/auth.php';
$auth = Auth::getInstance();
$auth->logout();
header('Location: login.php');
exit();
?>