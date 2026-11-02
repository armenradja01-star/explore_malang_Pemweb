<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nilai Mahasiswa</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        background-color: #dde8ec;
        font-family: "Segoe UI", Arial, sans-serif;
        color: #14263a;
      }
      h1 {
        margin-bottom: 30px;
      }
      .container {
        display: flex;
        flex-direction: column;
        background-color: white;
        width: 35%;
        margin: 40px auto;
        padding: 20px;
        justify-content: center;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(20, 38, 58, 0.15);
      }
      .input {
        display: flex;
        flex-direction: column;
        margin: 10px 0;
      }
      label {
        margin-bottom: 5px;
        font-weight: 600;
      }
      input {
        width: 100%;
        padding: 8px;
        border: 2px solid #c3d1d9;
        border-radius: 8px;
      }
      input:focus {
        outline: none;
        border-color: #2457f5;
      }
      .button {
        width: 100%;
        margin: 10px 0;
        padding: 10px;
        background: #14263a;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        color: white;
        font-weight: bold;
      }
      .button:hover {
        background-color: #2457f5;
      }
      #hasil,
      #hasil-nilai {
        margin-top: 15px;
        background: #f4f8fa;
        padding: 10px;
        border: 2px dashed #c3d1d9;
        border-radius: 8px;
        text-align: left;
      }
      #hasil b,
      #hasil-nilai b {
        background: #ffd84d;
        padding: 2px 6px;
      }
    </style>
  </head>

  <body>
    <center>
      <h1>Form Nilai Mahasiswa</h1>
      <div class="container">
        <form id="form-nilai" action="" method="POST">
          <div class="input">
            <label for="nama">Nama Mahasiswa</label>
            <input type="text" name="nama" id="nama" required />
          </div>

          <div class="input">
            <label for="tugas">Nilai Tugas (30%)</label>
            <input type="number" name="tugas" id="tugas" min="0" max="100" required />
          </div>

          <div class="input">
            <label for="uts">Nilai UTS (30%)</label>
            <input type="number" name="uts" id="uts" min="0" max="100" required />
          </div>

          <div class="input">
            <label for="uas">Nilai UAS (40%)</label>
            <input type="number" name="uas" id="uas" min="0" max="100" required />
          </div>

          <input type="submit" class="button" name="btn_nilai" value="Hitung Nilai" />
          <input type="reset" class="button" value="Hapus" />

          <div id="hasil-nilai">
            <?php
              if (isset($_POST['btn_nilai'])) {
                  $nama = trim($_POST['nama'] ?? '');
                  $tugas = $_POST['tugas'] ?? '';
                  $uts = $_POST['uts'] ?? '';
                  $uas = $_POST['uas'] ?? '';

                  $nilaiValid = is_numeric($tugas) && is_numeric($uts) && is_numeric($uas)
                      && $tugas >= 0 && $tugas <= 100
                      && $uts >= 0 && $uts <= 100
                      && $uas >= 0 && $uas <= 100;

                  if ($nama === '' || !$nilaiValid) {
                      echo "Mohon isi nama dan nilai antara 0 sampai 100.";
                  } else {
                      $akhir = ($tugas * 0.3) + ($uts * 0.3) + ($uas * 0.4);
                      if ($akhir >= 85) {
                          $grade = 'A';
                      } elseif ($akhir >= 75) {
                          $grade = 'B';
                      } elseif ($akhir >= 60) {
                          $grade = 'C';
                      } elseif ($akhir >= 50) {
                          $grade = 'D';
                      } else {
                          $grade = 'E';
                      }
                      $status = $akhir >= 60 ? 'Lulus' : 'Tidak Lulus';

                      echo "Nama: " . htmlspecialchars($nama, ENT_QUOTES, 'UTF-8') . "<br>";
                      echo "Nilai Akhir: " . number_format($akhir, 1, ',', '.') . "<br>";
                      echo "Grade: " . $grade . "<br>";
                      echo "Status: <b>" . $status . "</b>";
                  }
              } else {
                  echo "Hasil perhitungan akan tampil di sini.";
              }
            ?>
          </div>
        </form>
      </div>
    </center>
    <script>
      document.getElementById("form-nilai").addEventListener("reset", function () {
        document.getElementById("hasil-nilai").textContent = "";
      });
    </script>
  </body>
</html>