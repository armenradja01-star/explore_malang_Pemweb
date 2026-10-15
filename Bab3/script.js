const Toast = (function () {
  const svg = (isi) =>
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + isi + '</svg>';

  const IKON = {
    success: svg('<path d="M5 13l4 4L19 7"/>'),
    error: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    info: svg('<path d="M12 8h.01M11 12h1v5h1"/>'),
    warning: svg('<path d="M12 6v8M12 18h.01"/>')
  };

  let wadah = null;

  function ambilWadah() {
    if (!wadah) {
      wadah = document.createElement('div');
      wadah.className = 'toast-wadah';
      wadah.setAttribute('aria-live', 'polite');
      document.body.appendChild(wadah);
    }
    return wadah;
  }

  function tutup(el) {
    if (el.dataset.menutup) return;
    el.dataset.menutup = '1';
    el.classList.add('toast--keluar');
    el.addEventListener('animationend', (e) => {
      if (e.target === el && e.animationName === 'toast-keluar') el.remove();
    });
  }

  /**
   * @param {{judul:string, pesan?:string, tipe?:string, durasi?:number}} opsi
   *   tipe   : 'info' | 'success' | 'error' | 'warning'
   *   durasi : ms (0 = tidak hilang sendiri)
   */
  function tampil(opsi) {
    const tipe = opsi.tipe || 'info';
    const durasi = opsi.durasi === undefined ? 4000 : opsi.durasi;
    const kotak = ambilWadah();

    while (kotak.children.length >= 4) kotak.firstElementChild.remove();

    const el = document.createElement('div');
    el.className = 'toast toast--' + tipe;
    el.setAttribute('role', tipe === 'error' ? 'alert' : 'status');
    el.style.setProperty('--durasi', durasi + 'ms');

    el.innerHTML =
      '<span class="toast__ikon">' + IKON[tipe] + '</span>' +
      '<div class="toast__isi"><strong></strong><p></p></div>' +
      '<button type="button" class="toast__tutup" aria-label="Tutup notifikasi">&times;</button>' +
      (durasi > 0 ? '<span class="toast__bar"></span>' : '');

    el.querySelector('strong').textContent = opsi.judul || '';
    el.querySelector('p').textContent = opsi.pesan || '';

    el.querySelector('.toast__tutup').addEventListener('click', () => tutup(el));
    const bar = el.querySelector('.toast__bar');
    if (bar) bar.addEventListener('animationend', () => tutup(el)); // bar habis = toast tutup

    kotak.appendChild(el);
    return el;
  }

  return {
    tampil: tampil,
    sukses: (judul, pesan) => tampil({ judul: judul, pesan: pesan, tipe: 'success' }),
    error: (judul, pesan) => tampil({ judul: judul, pesan: pesan, tipe: 'error', durasi: 5000 }),
    info: (judul, pesan) => tampil({ judul: judul, pesan: pesan, tipe: 'info' }),
    peringatan: (judul, pesan) => tampil({ judul: judul, pesan: pesan, tipe: 'warning' })
  };
})();


(function () {
  const hero = document.querySelector('.hero');
  const daftarKartu = document.getElementById('daftarKartu');
  const formCari = document.getElementById('formCari');
  const inputCari = document.getElementById('inputCari');
  const btnLihat = document.getElementById('lihatSemua');
  const labelLihat = document.getElementById('labelLihat');

  const semuaKartu = () => Array.from(daftarKartu.querySelectorAll('.card'));
  const namaDan = (k) => k.querySelector('h3').textContent + ' ' + k.querySelector('.card-body p').textContent;

  const jam = new Date().getHours();
  let waktu = 'malam';
  if (jam >= 4 && jam < 11) waktu = 'pagi';
  else if (jam >= 11 && jam < 15) waktu = 'siang';
  else if (jam >= 15 && jam < 18) waktu = 'sore';

  const badge = document.createElement('span');
  badge.className = 'hero-badge';
  badge.textContent = 'Selamat ' + waktu + '! Mau jelajah ke mana hari ini?';
  hero.querySelector('h1').before(badge);


  const PIN =
    '<svg width="10" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>';

  const wisataTambahan = [
    { nama: 'Taman Selecta', lokasi: 'Kota Batu', jarak: '21.4',
      deskripsi: 'Taman rekreasi keluarga di Batu dengan kolam renang, taman bunga, dan aneka wahana.',
      warna: 'linear-gradient(160deg, #86c58a, #3f8f5a)' },
    { nama: 'Museum Brawijaya', lokasi: 'Kota Malang', jarak: '3.2',
      deskripsi: 'Museum sejarah perjuangan dan militer yang berada di pusat Kota Malang.',
      warna: 'linear-gradient(160deg, #c9b79c, #8a6f4d)' },
    { nama: 'Cafe Sawah Pujon', lokasi: 'Pujon, Malang', jarak: '20.1',
      deskripsi: 'Kafe di tengah hamparan sawah dengan pemandangan pegunungan yang sejuk.',
      warna: 'linear-gradient(160deg, #a5d36b, #4f8a3a)' },
    { nama: 'BNS (Batu Night Spectacular)', lokasi: 'Kota Batu', jarak: '22.8',
      deskripsi: 'Taman hiburan malam dengan lampu warna-warni dan wahana untuk keluarga.',
      warna: 'linear-gradient(160deg, #6d5bd0, #261e5e)' }
  ];

  function buatKartu(d) {
    const kartu = document.createElement('article');
    kartu.className = 'card card-baru';
    kartu.dataset.deskripsi = d.deskripsi;
    kartu.innerHTML =
      '<a href="#">' +
        '<div class="card-img"><span class="distance">' + PIN + '</span></div>' +
        '<div class="card-body"><h3></h3><p></p></div>' +
      '</a>';
    kartu.querySelector('.card-img').style.backgroundImage = d.warna;
    kartu.querySelector('.distance').append(d.jarak + ' km');
    kartu.querySelector('h3').textContent = d.nama;
    kartu.querySelector('.card-body p').textContent = d.lokasi;
    return kartu;
  }

  let terbuka = false;
  btnLihat.addEventListener('click', (e) => {
    e.preventDefault();
    terbuka = !terbuka;

    if (terbuka) {
      wisataTambahan.forEach((d) => daftarKartu.appendChild(buatKartu(d)));
      labelLihat.textContent = 'Tampilkan Lebih Sedikit';
      Toast.sukses('Wisata dimuat', wisataTambahan.length + ' tempat wisata ditambahkan ke daftar.');
    } else {
      daftarKartu.querySelectorAll('.card-baru').forEach((k) => k.remove());
      labelLihat.textContent = 'Lihat Semua';
      Toast.info('Daftar diringkas', 'Kembali menampilkan rekomendasi terpopuler.');
    }
    btnLihat.setAttribute('aria-expanded', terbuka);
  });


  let pemicuModal = null;

  function tutupModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;
    overlay.classList.add('keluar');
    document.body.classList.remove('modal-terbuka');
    document.removeEventListener('keydown', saatTekan);
    setTimeout(() => overlay.remove(), 200);
    if (pemicuModal) pemicuModal.focus();
  }

  function saatTekan(e) {
    if (e.key === 'Escape') tutupModal();
  }

  function bukaModal(kartu) {
    if (document.querySelector('.modal-overlay')) return;

    const nama = kartu.querySelector('h3').textContent;
    const lokasi = kartu.querySelector('.card-body p').textContent;
    const jarak = kartu.querySelector('.distance').textContent.trim();
    const sumber = kartu.querySelector('.card-img');
    const foto = sumber.querySelector('img');
    pemicuModal = kartu.querySelector('a');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalJudul">' +
        '<button type="button" class="modal__tutup" aria-label="Tutup">&times;</button>' +
        '<div class="modal__gambar"></div>' +
        '<div class="modal__isi">' +
          '<h3 id="modalJudul"></h3>' +
          '<p class="modal__meta"></p>' +
          '<p class="modal__deskripsi"></p>' +
          '<div class="modal__aksi"><button type="button" class="btn-simpan">Simpan ke Rencana</button></div>' +
        '</div>' +
      '</div>';

    overlay.querySelector('#modalJudul').textContent = nama;
    overlay.querySelector('.modal__meta').textContent = lokasi + ' · ' + jarak;
    overlay.querySelector('.modal__deskripsi').textContent = kartu.dataset.deskripsi || 'Belum ada deskripsi.';

    const gambar = overlay.querySelector('.modal__gambar');
    gambar.style.backgroundImage = getComputedStyle(sumber).backgroundImage;
    if (foto) {
      const im = new Image();
      im.src = foto.currentSrc || foto.src;
      im.alt = nama;
      im.onerror = () => im.remove();
      gambar.appendChild(im);
    }

    overlay.querySelector('.modal__tutup').addEventListener('click', tutupModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) tutupModal();
    });
    const btnSimpan = overlay.querySelector('.btn-simpan');
    btnSimpan.addEventListener('click', () => {
      btnSimpan.textContent = 'Tersimpan ✓';
      btnSimpan.disabled = true;
      Toast.sukses('Tersimpan', nama + ' masuk ke rencana kunjunganmu.');
    });

    document.body.appendChild(overlay);
    document.body.classList.add('modal-terbuka');
    document.addEventListener('keydown', saatTekan);
    overlay.querySelector('.modal__tutup').focus();
  }

  daftarKartu.addEventListener('click', (e) => {
    const kartu = e.target.closest('.card');
    if (!kartu) return;
    e.preventDefault();
    bukaModal(kartu);
  });


  const btnAtas = document.createElement('button');
  btnAtas.type = 'button';
  btnAtas.className = 'btn-atas';
  btnAtas.setAttribute('aria-label', 'Kembali ke atas');
  btnAtas.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btnAtas);

  window.addEventListener('scroll', () => {
    btnAtas.classList.toggle('tampil', window.scrollY > 400);
  }, { passive: true });
  btnAtas.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  formCari.addEventListener('submit', (e) => {
    e.preventDefault();
    semuaKartu().forEach((k) => k.classList.remove('sorot'));

    const kata = inputCari.value.trim();
    if (!kata) {
      Toast.peringatan('Kolom masih kosong', 'Ketik nama tempat atau lokasi dulu.');
      inputCari.focus();
      return;
    }

    const cocok = semuaKartu().filter((k) => namaDan(k).toLowerCase().includes(kata.toLowerCase()));
    if (cocok.length === 0) {
      Toast.error('Tidak ditemukan', 'Tidak ada tempat yang cocok dengan "' + kata + '".');
      return;
    }

    cocok.forEach((k) => k.classList.add('sorot'));
    cocok[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    Toast.sukses(cocok.length + ' tempat ditemukan', 'Kartu yang cocok ditandai dengan garis biru.');
    setTimeout(() => cocok.forEach((k) => k.classList.remove('sorot')), 4000);
  });
})();