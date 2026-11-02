<?php
include "koneksi.php";
include "fungsi.php";

$pesan = "";

if (isset($_POST['hitung'])) {
    $angka1  = floatval($_POST['angka1']);
    $angka2  = floatval($_POST['angka2']);
    $operasi = $_POST['operasi'];

    $hasil = hitung($angka1, $angka2, $operasi);

    if ($hasil === null) {
        $pesan = "Perhitungan gagal (operasi salah atau dibagi 0)";
    } else {
        $sql = "INSERT INTO hitung (angka1, angka2, operasi, hasil)
                VALUES ('$angka1', '$angka2', '$operasi', '$hasil')";
        mysqli_query($koneksi, $sql);
        $pesan = "Hasil: $angka1 $operasi $angka2 = $hasil";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>UTS Pemweb - Kalkulator</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        header { background: #2c3e50; color: white; padding: 15px; text-align: center; }
        main { padding: 20px; width: 700px; margin: auto; }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: center; }
        th { background: #ecf0f1; }
        footer { background: #2c3e50; color: white; text-align: center; padding: 10px; margin-top: 30px; }
    </style>
</head>
<body>

<header>
    <h1>Kalkulator Sederhana</h1>
    <p>Tugas UTS Pemrograman Web</p>
</header>

<main>
    <h2>Input Data</h2>
    <form method="post" action="">
        <table>
            <tr>
                <td>Angka 1</td>
                <td><input type="number" step="any" name="angka1" required></td>
            </tr>
            <tr>
                <td>Angka 2</td>
                <td><input type="number" step="any" name="angka2" required></td>
            </tr>
            <tr>
                <td>Operasi</td>
                <td>
                    <select name="operasi">
                        <option value="tambah">Tambah (+)</option>
                        <option value="kurang">Kurang (-)</option>
                        <option value="kali">Kali (x)</option>
                        <option value="bagi">Bagi (:)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="2"><input type="submit" name="hitung" value="Hitung"></td>
            </tr>
        </table>
    </form>

    <p><b><?php echo $pesan; ?></b></p>

    <h2>Riwayat Perhitungan</h2>
    <table>
        <tr>
            <th>No</th>
            <th>Angka 1</th>
            <th>Operasi</th>
            <th>Angka 2</th>
            <th>Hasil</th>
            <th>Waktu</th>
        </tr>
        <?php
        $no = 1;
        $data = mysqli_query($koneksi, "SELECT * FROM hitung ORDER BY id DESC");
        while ($row = mysqli_fetch_assoc($data)) {
        ?>
        <tr>
            <td><?php echo $no++; ?></td>
            <td><?php echo $row['angka1']; ?></td>
            <td><?php echo $row['operasi']; ?></td>
            <td><?php echo $row['angka2']; ?></td>
            <td><?php echo $row['hasil']; ?></td>
            <td><?php echo $row['waktu']; ?></td>
        </tr>
        <?php } ?>
    </table>
</main>

<footer>
    <p>Nama: Armen Radja | NIM: 2418050 | Pemrograman Web</p>
</footer>

</body>
</html>