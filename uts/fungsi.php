<?php
function hitung($a, $b, $operasi) {
    if ($operasi == "tambah") {
        $hasil = $a + $b;
    } elseif ($operasi == "kurang") {
        $hasil = $a - $b;
    } elseif ($operasi == "kali") {
        $hasil = $a * $b;
    } elseif ($operasi == "bagi") {
        if ($b == 0) {
            return null; 
        }
        $hasil = $a / $b;
    } else {
        return null;
    }
    return $hasil;
}
?>