<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pemesanan Produk</title>
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
        width: 40%;
        min-width: 340px;
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
        text-align: left;
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
      #hasil {
        margin-top: 15px;
        background: #f4f8fa;
        padding: 10px;
        border: 2px dashed #c3d1d9;
        border-radius: 8px;
        text-align: left;
      }
      .error {
        color: #b3261e;
        background: #fdecea;
        border: 1px solid #f5c2c0;
        border-radius: 8px;
        padding: 10px 10px 10px 28px;
        margin: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
      }
      th,
      td {
        border: 1px solid #c3d1d9;
        padding: 8px 10px;
        text-align: left;
      }
      th {
        background: #14263a;
        color: white;
        width: 45%;
      }
      tr.total td {
        background: #ffd84d;
        font-weight: bold;
      }
    </style>
  </head>

  <body>
    <?php
      function hitungTotal($jumlah, $harga)
      {
          $subtotal = $jumlah * $harga;

          if ($subtotal > 100000) {
              $diskon = $subtotal * 0.10;
          } else {
              $diskon = 0;
          }

          $total = $subtotal - $diskon;

          return [
              'subtotal' => $subtotal,
              'diskon'   => $diskon,
              'total'    => $total,
          ];
      }

      function rupiah($angka)
      {
          return "Rp " . number_format((float) $angka, 0, ',', '.');
      }

      $errors = [];
      $hasil  = null;

      if (isset($_POST['btn_produk'])) {
          $produk = trim($_POST['produk'] ?? '');
          $jumlah = trim($_POST['jumlah'] ?? '');
          $harga  = trim($_POST['harga'] ?? '');

          if ($produk === '') {
              $errors[] = "Nama produk wajib diisi.";
          }

          if ($jumlah === '') {
              $errors[] = "Jumlah wajib diisi.";
          } elseif (!is_numeric($jumlah)) {
              $errors[] = "Jumlah harus berupa angka.";
          } elseif ($jumlah <= 0) {
              $errors[] = "Jumlah tidak boleh negatif atau nol.";
          }

          if ($harga === '') {
              $errors[] = "Harga satuan wajib diisi.";
          } elseif (!is_numeric($harga)) {
              $errors[] = "Harga satuan harus berupa angka.";
          } elseif ($harga <= 0) {
              $errors[] = "Harga satuan tidak boleh negatif atau nol.";
          }

          if (count($errors) == 0) {
              $hitung = hitungTotal($jumlah, $harga);
              $hasil = [
                  'produk'   => $produk,
                  'jumlah'   => $jumlah,
                  'harga'    => $harga,
                  'subtotal' => $hitung['subtotal'],
                  'diskon'   => $hitung['diskon'],
                  'total'    => $hitung['total'],
              ];
          }
      }
    ?>

    <center>
      <h1>Form Pemesanan Produk</h1>
      <div class="container">
        <form id="form-pemesanan" action="" method="POST" novalidate>
          <div class="input">
            <label for="produk">Nama Produk</label>
            <input type="text" name="produk" id="produk" />
          </div>

          <div class="input">
            <label for="jumlah">Jumlah</label>
            <input type="number" name="jumlah" id="jumlah" />
          </div>

          <div class="input">
            <label for="harga">Harga Satuan (Rp)</label>
            <input type="number" name="harga" id="harga" />
          </div>

          <input type="submit" class="button" name="btn_produk" value="Hitung Total" />
          <input type="reset" class="button" value="Hapus" />

          <div id="hasil">
            <?php if (count($errors) > 0): ?>
              <ul class="error">
                <?php foreach ($errors as $e): ?>
                  <li><?= htmlspecialchars($e, ENT_QUOTES, 'UTF-8') ?></li>
                <?php endforeach; ?>
              </ul>

            <?php elseif ($hasil !== null): ?>
              <table>
                <tr>
                  <th>Nama Produk</th>
                  <td><?= htmlspecialchars($hasil['produk'], ENT_QUOTES, 'UTF-8') ?></td>
                </tr>
                <tr>
                  <th>Jumlah</th>
                  <td><?= htmlspecialchars((string) $hasil['jumlah'], ENT_QUOTES, 'UTF-8') ?></td>
                </tr>
                <tr>
                  <th>Harga Satuan</th>
                  <td><?= rupiah($hasil['harga']) ?></td>
                </tr>
                <tr>
                  <th>Subtotal</th>
                  <td><?= rupiah($hasil['subtotal']) ?></td>
                </tr>
                <tr>
                  <th>Diskon (10%)</th>
                  <td><?= $hasil['diskon'] > 0 ? "- " . rupiah($hasil['diskon']) : "Tidak ada" ?></td>
                </tr>
                <tr class="total">
                  <th>Total Bayar</th>
                  <td><?= rupiah($hasil['total']) ?></td>
                </tr>
              </table>

            <?php else: ?>
            <?php endif; ?>
          </div>
        </form>
      </div>
    </center>

    <script>
      document.getElementById("form-pemesanan").addEventListener("reset", function () {
        document.getElementById("hasil").textContent = "";
      });
    </script>
  </body>
</html>