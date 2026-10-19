window.notif = function (judul, pesan, tipe) {
  tipe = tipe || 'info';
  if (typeof Toast !== 'undefined') {
    Toast.tampil({ judul: judul, pesan: pesan, tipe: tipe });
    return;
  }
  var wadah = document.querySelector('.toast-wadah');
  if (!wadah) {
    wadah = document.createElement('div');
    wadah.className = 'toast-wadah';
    wadah.setAttribute('aria-live', 'polite');
    document.body.appendChild(wadah);
  }
  var el = document.createElement('div');
  el.className = 'toast toast--' + tipe;
  el.innerHTML = '<div class="toast__isi"><strong></strong><p></p></div>' +
                 '<button type="button" class="toast__tutup" aria-label="Tutup notifikasi">&times;</button>';
  el.querySelector('strong').textContent = judul;
  el.querySelector('p').textContent = pesan || '';
  el.querySelector('.toast__tutup').addEventListener('click', function () { el.remove(); });
  wadah.appendChild(el);
  setTimeout(function () { el.remove(); }, 4000);
};

function tunggu(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.sb-link').forEach(function (link) {
    if (!/logout/i.test(link.textContent)) return;
    link.addEventListener('click', function (e) {
      // confirm() mengembalikan true (OK) atau false (Batal)
      var yakin = confirm('Yakin ingin keluar dari panel admin?');
      if (!yakin) {
        e.preventDefault();             
        return;
      }
      sessionStorage.removeItem('adminUser'); 
    });
  });

  var salam = document.getElementById('salamAdmin');
  if (salam) {
    var nama = sessionStorage.getItem('adminUser') || 'Admin';
    var tampilkanSalam = function () {
      var sekarang = new Date();
      var jam = sekarang.getHours();
      var waktu = jam < 11 ? 'pagi' : jam < 15 ? 'siang' : jam < 18 ? 'sore' : 'malam';
      var tanggal = sekarang.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      salam.textContent = 'Selamat ' + waktu + ', ' + nama + '! ' + tanggal + ' · ' +
                          sekarang.toLocaleTimeString('id-ID');
    };
    tampilkanSalam();
    setInterval(tampilkanSalam, 1000);  
  }

  var formDaftar = document.getElementById('formDaftar');
  var penandaKuat = document.getElementById('kekuatanPass');
  if (formDaftar && penandaKuat) {
    formDaftar.elements['password'].addEventListener('input', function () {
      var p = this.value;
      var skor = 0;
      if (p.length >= 6) skor++;
      if (/[A-Z]/.test(p)) skor++;
      if (/[0-9]/.test(p)) skor++;
      if (/[^A-Za-z0-9]/.test(p)) skor++;
      var label = ['Terlalu pendek', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'][skor];
      penandaKuat.textContent = p ? 'Kekuatan password: ' + label : '';
      penandaKuat.dataset.skor = p ? skor : '';
    });
  }

  var kartuWisata = Array.from(document.querySelectorAll('.tourism-card'));
  if (kartuWisata.length) {
    var kolomCari = document.querySelector('.search-box input');
    var pilihan = document.querySelectorAll('.filter-group select');
    var pilJarak = pilihan[0];
    var pilKategori = pilihan[1];

    var kosong = document.createElement('p');
    kosong.className = 'kosong';
    kosong.hidden = true;
    kosong.textContent = 'Tidak ada wisata yang cocok dengan filter.';
    document.querySelector('.tourism-list').after(kosong);

    function terapkanFilter() {
      var kata = kolomCari.value.trim().toLowerCase();
      var batas = parseFloat(pilJarak.value);            
      var kategori = pilKategori.value;
      var tampil = 0;

      kartuWisata.forEach(function (k) {
        var nama = k.querySelector('h3').textContent.toLowerCase();
        var lokasi = k.querySelector('.tourism-info p').textContent.toLowerCase();
        var kat = k.querySelector('.category').textContent;
        var jarak = parseFloat(k.querySelectorAll('.tourism-info > p')[1].textContent.replace(/[^0-9.]/g, ''));

        var cocok = (nama + ' ' + lokasi).includes(kata) &&
                    (kategori === 'Semua Kategori' || kat === kategori) &&
                    (!(batas > 0) || jarak <= batas);
        k.style.display = cocok ? '' : 'none';
        if (cocok) tampil++;
      });
      kosong.hidden = tampil !== 0;
   
      localStorage.setItem('filterWisata', JSON.stringify({
        kata: kolomCari.value, jarak: pilJarak.value, kategori: kategori
      }));
    }

    try {
      var tersimpan = JSON.parse(localStorage.getItem('filterWisata'));
      if (tersimpan) {
        kolomCari.value = tersimpan.kata || '';
        pilJarak.value = tersimpan.jarak;
        pilKategori.value = tersimpan.kategori;
      }
    } catch (err) { /* data rusak: abaikan */ }
    terapkanFilter();

    kolomCari.addEventListener('input', terapkanFilter);        
    pilJarak.addEventListener('change', terapkanFilter);        
    pilKategori.addEventListener('change', terapkanFilter);     

    
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== kolomCari) {
        e.preventDefault();
        kolomCari.focus();
      } else if (e.key === 'Escape' && document.activeElement === kolomCari) {
        kolomCari.value = '';
        terapkanFilter();
      }
    });

    kartuWisata.forEach(function (k) {
      k.addEventListener('dblclick', function () {
        window.location.href = 'detailwisata.html';
      });
      k.addEventListener('mouseover', function () { k.style.outline = '2px solid #2563eb'; });
      k.addEventListener('mouseout', function () { k.style.outline = ''; });
      k.title = 'Klik dua kali untuk melihat detail';
    });
  }

  var tombolUlasan = document.getElementById('btnUlasan');
  var bagianUlasan = document.getElementById('ulasan');
  if (tombolUlasan && bagianUlasan) {
    var kunci = 'ulasan:' + document.querySelector('.detail-heading h1').textContent;

    function gambarUlasan(u) {
      var el = document.createElement('div');
      el.className = 'review-item review-item--baru';
      el.innerHTML = '<strong></strong><p></p><p></p>';
      el.querySelector('strong').textContent = u.nama;
      el.querySelectorAll('p')[0].textContent = '⭐ ' + u.rating.toFixed(1);
      el.querySelectorAll('p')[1].textContent = u.komentar;
      bagianUlasan.appendChild(el);
    }

    var daftarUlasan = [];
    try { daftarUlasan = JSON.parse(localStorage.getItem(kunci)) || []; } catch (err) { daftarUlasan = []; }
    daftarUlasan.forEach(gambarUlasan);

    tombolUlasan.addEventListener('click', async function () {
      var nama = prompt('Masukkan namamu:', 'Pengunjung');
      if (nama === null) return;
      var rating = parseFloat(prompt('Beri rating (1 - 5):', '5'));
      if (isNaN(rating) || rating < 1 || rating > 5) {
        alert('Rating harus berupa angka 1 sampai 5.');   
        return;
      }
      var komentar = prompt('Tulis komentarmu:');
      if (!komentar || !komentar.trim()) {
        alert('Komentar tidak boleh kosong.');
        return;
      }

      tombolUlasan.disabled = true;
      tombolUlasan.textContent = 'Mengirim...';
      await tunggu(800);                                   

      var ulasanBaru = { nama: nama.trim() || 'Pengunjung', rating: rating, komentar: komentar.trim() };
      daftarUlasan.push(ulasanBaru);
      localStorage.setItem(kunci, JSON.stringify(daftarUlasan));   
      gambarUlasan(ulasanBaru);

      tombolUlasan.disabled = false;
      tombolUlasan.textContent = '✎ Tulis Ulasan';
      notif('Ulasan terkirim', 'Terima kasih, ' + ulasanBaru.nama + '!', 'success');
    });
  }

  var kotakCuaca = document.getElementById('cuacaMalang');
  if (kotakCuaca) {
    var deskripsiCuaca = function (kode) {
      if (kode === 0) return 'Cerah';
      if (kode <= 3) return 'Berawan';
      if (kode === 45 || kode === 48) return 'Berkabut';
      if (kode >= 51 && kode <= 67) return 'Hujan ringan';
      if (kode >= 80 && kode <= 82) return 'Hujan deras';
      if (kode >= 95) return 'Badai petir';
      return 'Cuaca tidak diketahui';
    };

    var batasWaktu = function (ms) {
      return new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error('Waktu habis')); }, ms);
      });
    };

    var ambilCuaca = async function () {
      try {
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=-7.98&longitude=112.63' +
                  '&current=temperature_2m,weather_code';
        var respons = await Promise.race([fetch(url), batasWaktu(6000)]);
        if (!respons.ok) throw new Error('Status ' + respons.status);
        var data = await respons.json();                   
        var suhu = Math.round(data.current.temperature_2m);
        kotakCuaca.textContent = 'Cuaca Malang sekarang: ' + suhu + '°C, ' +
                                 deskripsiCuaca(data.current.weather_code);
      } catch (err) {
        kotakCuaca.textContent = 'Cuaca belum bisa dimuat.';
        console.error('Gagal mengambil cuaca:', err);
      }
    };
    ambilCuaca();
  }
});
