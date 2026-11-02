<?php
session_start();
$tujuan = (($_SESSION['role'] ?? '') === 'master') ? 'daftarmasteradmin.php' : 'loginadmin.php';

session_unset();
session_destroy();

header('Location: ' . $tujuan);
exit;