<?php
// auth.php - dipakai lewat include/require di halaman yang butuh login
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function wajibLogin(string $role = 'admin'): void
{
    if (empty($_SESSION['adminUser']) || ($_SESSION['role'] ?? '') !== $role) {
        header('Location: ' . ($role === 'master' ? 'daftarmasteradmin.php' : 'loginadmin.php'));
        exit;
    }
}
