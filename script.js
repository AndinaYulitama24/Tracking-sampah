// script.js (diperbaiki, pastikan tombol Terdekat berfungsi)

let currentUser = null;
let allBanks = [];
let laporanList = [];
let komunitasList = [];
let kegiatanList = [];
let nextBankId = 10;
let nextLaporanId = 6;
let nextKomunitasId = 6;

const defaultBanks = [
    { id: 1, name: "Bank Sampah Induk Medan", address: "Jl. Gatot Subroto No. 12, Medan Petisah", lat: 3.5875, lng: 98.6712, tonPerMonth: 4.5, is3RActive: true, deskripsi: "Bank utama kota", isCustom: false },
    { id: 2, name: "Bank Sampah Berseri", address: "Jl. Sei Batang Hari No. 8, Medan Baru", lat: 3.6012, lng: 98.6834, tonPerMonth: 2.1, is3RActive: false, deskripsi: "Plastik & kertas", isCustom: false },
    { id: 3, name: "Bank Sampah Harapan", address: "Jl. Pancing Raya No. 45, Medan Tuntungan", lat: 3.6145, lng: 98.6578, tonPerMonth: 1.8, is3RActive: false, deskripsi: "Warga sekitar", isCustom: false },
    { id: 4, name: "Bank Sampah Mandiri", address: "Jl. Setia Budi No. 22, Medan Baru", lat: 3.5774, lng: 98.6488, tonPerMonth: 3.2, is3RActive: true, deskripsi: "Mitra DLH", isCustom: false },
    { id: 5, name: "Bank Sampah Lestari", address: "Jl. Krakatau No. 15, Medan Polonia", lat: 3.5903, lng: 98.6941, tonPerMonth: 2.7, is3RActive: true, deskripsi: "Kompos", isCustom: false }
];
const defaultKomunitas = [
    { id: 1, name: "Komunitas Medan Bersih", address: "Jl. Imam Bonjol No.5", anggota: 120, kegiatanPerBulan: 5, aktif: true, lat: 3.5898, lng: 98.6789, sampahTerkumpul: 2.3 },
    { id: 2, name: "Green Warriors Medan", address: "Jl. Mongonsidi No.18", anggota: 85, kegiatanPerBulan: 3, aktif: true, lat: 3.5812, lng: 98.6523, sampahTerkumpul: 1.5 },
    { id: 3, name: "Eco Youth Medan", address: "Jl. Dr. Mansyur No.32", anggota: 200, kegiatanPerBulan: 8, aktif: true, lat: 3.5650, lng: 98.6335, sampahTerkumpul: 3.2 },
    { id: 4, name: "Sahabat Lingkungan", address: "Jl. Sei Deli No.10", anggota: 65, kegiatanPerBulan: 2, aktif: false, lat: 3.6030, lng: 98.6955, sampahTerkumpul: 0.8 },
    { id: 5, name: "Medan Zero Waste", address: "Jl. Asia No.7", anggota: 150, kegiatanPerBulan: 6, aktif: true, lat: 3.5945, lng: 98.6640, sampahTerkumpul: 2.7 }
];
const defaultKegiatan = [
    { title: "Bersih Sungai Deli", date: "Minggu, 8 Juni 2026", komunitas: "Komunitas Medan Bersih", desc: "Pembersihan bantaran Sungai Deli sepanjang 2km." },
    { title: "Aksi Pilah Sampah", date: "Sabtu, 14 Juni 2026", komunitas: "Green Warriors Medan", desc: "Edukasi pemilahan sampah di Pasar Petisah." },
    { title: "Tanam Pohon Kota", date: "Minggu, 22 Juni 2026", komunitas: "Eco Youth Medan", desc: "Penanaman 200 bibit pohon." },
    { title: "Workshop Kompos", date: "Sabtu, 28 Juni 2026", komunitas: "Sahabat Lingkungan", desc: "Pelatihan pembuatan kompos." }
];
const defaultLaporan = [
    { id: 1, nama: "Warga", lokasi: "Jl. SM Raja KM 5", jenisSampah: "Campuran", deskripsi: "Tumpukan sampah di pinggir jalan", lat: 3.589, lng: 98.674, status: "baru", tanggal: new Date(Date.now() - 2*3600000).toISOString(), judul: "Tumpukan Sampah di Jl. SM Raja", fotoBase64: null },
    { id: 2, nama: "Ahmad", lokasi: "Jl. Deli No. 3", jenisSampah: "Plastik", deskripsi: "Sampah di bantaran sungai", lat: 3.602, lng: 98.684, status: "diproses", tanggal: new Date(Date.now() - 24*3600000).toISOString(), judul: "Sampah di Bantaran Sungai Deli", fotoBase64: null },
    { id: 3, nama: "Budi", lokasi: "Jl. Pancing Raya", jenisSampah: "Organik", deskripsi: "TPA liar", lat: 3.614, lng: 98.658, status: "selesai", tanggal: new Date(Date.now() - 72*3600000).toISOString(), judul: "TPA Liar di Jl. Pancing", fotoBase64: null },
    { id: 4, nama: "Siti", lokasi: "Jl. Petisah Tengah", jenisSampah: "Rumah Tangga", deskripsi: "Sampah menumpuk di pasar", lat: 3.589, lng: 98.679, status: "baru", tanggal: new Date(Date.now() - 5*3600000).toISOString(), judul: "Sampah Menumpuk di Pasar Petisah", fotoBase64: null },
    { id: 5, nama: "Rudi", lokasi: "Jl. Gatot Subroto No. 20", jenisSampah: "Limbah", deskripsi: "Limbah di bahu jalan", lat: 3.587, lng: 98.671, status: "diproses", tanggal: new Date(Date.now() - 48*3600000).toISOString(), judul: "Limbah di Jl. Gatot Subroto", fotoBase64: null }
];

function loadData() {
    const storedBanks = localStorage.getItem("userAddedBanks");
    if(storedBanks) { const custom = JSON.parse(storedBanks); allBanks = [...defaultBanks, ...custom]; if(custom.length) nextBankId = Math.max(...custom.map(b=>b.id),10)+1; }
    else allBanks = [...defaultBanks];
    const storedLap = localStorage.getItem("laporanWaste");
    if(storedLap) laporanList = JSON.parse(storedLap);
    else laporanList = [...defaultLaporan];
    nextLaporanId = laporanList.length ? Math.max(...laporanList.map(l=>l.id))+1 : 6;
    const storedKom = localStorage.getItem("komunitasData");
    if(storedKom) komunitasList = JSON.parse(storedKom);
    else komunitasList = [...defaultKomunitas];
    nextKomunitasId = komunitasList.length ? Math.max(...komunitasList.map(k=>k.id))+1 : 6;
    kegiatanList = [...defaultKegiatan];
}
function saveAllData() {
    localStorage.setItem("userAddedBanks", JSON.stringify(allBanks.filter(b=>b.isCustom)));
    localStorage.setItem("laporanWaste", JSON.stringify(laporanList));
    localStorage.setItem("komunitasData", JSON.stringify(komunitasList));
}
function getUsers() { return JSON.parse(localStorage.getItem("bankSampahUsers")||"[]"); }
function saveUsers(u) { localStorage.setItem("bankSampahUsers",JSON.stringify(u)); }

let trackingMap, heroMap, miniMap, miniMarker;
let currentFilterBank = "all", userLatBank=null, userLngBank=null;
let currentKomFilter = "all", userLatKom=null, userLngKom=null;
let currentFilterLap = "semua";

function getDistance(lat1,lng1,lat2,lng2){ const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLng=(lng2-lng1)*Math.PI/180; const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2; return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); }

// ===== UPDATE UI FILTER TRACKING =====
function updateFilterBankUI(activeFilter) {
    const allBtn = document.getElementById('filterAll');
    const threeRBtn = document.getElementById('filter3r');
    const nearestBtn = document.getElementById('filterNearest');
    if (allBtn && threeRBtn && nearestBtn) {
        allBtn.classList.remove('active');
        threeRBtn.classList.remove('active');
        nearestBtn.classList.remove('active');
        if (activeFilter === 'all') allBtn.classList.add('active');
        else if (activeFilter === '3r') threeRBtn.classList.add('active');
        else if (activeFilter === 'nearest') nearestBtn.classList.add('active');
    }
}

function flyToBank(bankId) {
    if (!trackingMap) return;
    const bank = allBanks.find(b => b.id === bankId);
    if (bank) {
        trackingMap.flyTo([bank.lat, bank.lng], 15, { duration: 1.2 });
        trackingMap.eachLayer(layer => {
            if (layer instanceof L.Marker && layer.getLatLng().lat === bank.lat && layer.getLatLng().lng === bank.lng) {
                layer.openPopup();
            }
        });
    }
}
function deleteBank(bankId) {
    if(!currentUser || currentUser.role !== 'admin') return alert("Hanya admin yang dapat menghapus bank sampah");
    const bank = allBanks.find(b=>b.id===bankId);
    if(!bank) return;
    if(!bank.isCustom) return alert("Bank sampah default tidak dapat dihapus!");
    allBanks = allBanks.filter(b=>b.id!==bankId);
    saveAllData();
    refreshTracking();
    alert("Bank sampah berhasil dihapus");
}
function deleteKomunitas(komId) {
    if(!currentUser || currentUser.role !== 'admin') return alert("Hanya admin yang dapat menghapus komunitas");
    komunitasList = komunitasList.filter(k=>k.id!==komId);
    saveAllData();
    renderKomunitas();
    alert("Komunitas dihapus");
}
function renderBankList() {
    let filtered = [...allBanks];
    const search = document.getElementById('searchBankInput')?.value || '';
    if(search) filtered = filtered.filter(b=>b.name.toLowerCase().includes(search.toLowerCase()));
    const filterVal = currentFilterBank;
    if(filterVal === "3r") filtered = filtered.filter(b=>b.is3RActive);
    else if(filterVal === "nearest" && userLatBank !== null && userLngBank !== null) {
        filtered.sort((a,b)=>getDistance(userLatBank,userLngBank,a.lat,a.lng)-getDistance(userLatBank,userLngBank,b.lat,b.lng));
    }
    const container = document.getElementById('bankListContainer');
    if(!container) return;
    if(filtered.length===0) { container.innerHTML='<div class="text-center py-8 text-gray-400">Tidak ada bank</div>'; return; }
    const isAdmin = currentUser && currentUser.role === 'admin';
    container.innerHTML = filtered.map(b=>{
        const deleteBtn = (isAdmin && b.isCustom) ? `<button onclick="deleteBank(${b.id})" class="text-red-500 text-xs ml-2 hover:text-red-700"><i class="fas fa-trash-alt"></i></button>` : '';
        return `<div class="bank-card p-4"><div class="flex justify-between items-start"><h3 class="font-bold">${b.name} ${b.isCustom?'<span class="text-xs bg-gray-200 px-1 rounded">user</span>':''} ${deleteBtn}</h3>${b.is3RActive?'<span class="text-xs bg-green-100 p-1 rounded">3R</span>':''}</div><p class="text-sm">${b.address}</p><div class="flex justify-between items-center mt-2"><span class="text-sm font-semibold" style="color:var(--kuning);">${b.tonPerMonth} Ton/bln</span><div class="flex gap-2"><button onclick="openKondisiModalById(${b.id})" class="text-xs border px-2 py-1 rounded">Detail</button><button onclick="flyToBank(${b.id})" class="text-xs bg-[#798645] text-white px-2 py-1 rounded"><i class="fas fa-map-marker-alt mr-1"></i> Tampilkan Peta</button></div></div></div>`;
    }).join('');
}
function renderKomunitas() {
    let filtered = [...komunitasList];
    const search = document.getElementById('searchKomunitas')?.value.toLowerCase() || '';
    if(search) filtered = filtered.filter(k=>k.name.toLowerCase().includes(search));
    if(currentKomFilter === "aktif") filtered = filtered.filter(k=>k.aktif);
    else if(currentKomFilter === "terdekat" && userLatKom && userLngKom) filtered.sort((a,b)=>getDistance(userLatKom,userLngKom,a.lat,a.lng)-getDistance(userLatKom,userLngKom,b.lat,b.lng));
    const container = document.getElementById('komunitasListContainer');
    if(!container) return;
    const isAdmin = currentUser && currentUser.role === 'admin';
    container.innerHTML = filtered.map(k=>{
        const deleteBtn = isAdmin ? `<button onclick="deleteKomunitas(${k.id})" class="text-red-500 text-xs ml-2"><i class="fas fa-trash-alt"></i></button>` : '';
        return `<div class="komunitas-card p-4"><div class="flex justify-between"><h3 class="font-bold">${k.name} ${deleteBtn}</h3><span class="text-xs ${k.aktif?'bg-green-100 text-green-700':'bg-gray-100'} px-2 rounded">${k.aktif?'Aktif':'Tidak Aktif'}</span></div><p class="text-sm">${k.address}</p><div class="flex justify-between mt-2 text-sm"><span>👥 ${k.anggota}</span><span>📅 ${k.kegiatanPerBulan}/bln</span></div><div class="flex gap-2 mt-2"><button class="text-xs border px-2 py-1 rounded" onclick="alert('Detail ${k.name}')">Lihat Detail</button><button class="text-xs bg-[#FEA405] px-2 py-1 rounded" onclick="alert('Bergabung dengan ${k.name}')">Gabung</button></div></div>`;
    }).join('');
    document.getElementById('statKomunitas').innerText = komunitasList.length;
    document.getElementById('statAnggota').innerHTML = komunitasList.reduce((s,k)=>s+k.anggota,0)+'+';
    document.getElementById('statKegiatan').innerText = kegiatanList.length;
    document.getElementById('statSampah').innerText = komunitasList.reduce((s,k)=>s+(k.sampahTerkumpul||0),0).toFixed(1)+' Ton';
}
function renderKegiatan() {
    const container = document.getElementById('kegiatanListContainer');
    if(container) container.innerHTML = kegiatanList.map(kg=>`<div class="event-card p-3"><div class="flex justify-between"><div><h4 class="font-semibold">${kg.title}</h4><p class="text-xs">${kg.date} | ${kg.komunitas}</p><p class="text-sm text-gray-600">${kg.desc}</p></div><button class="text-xs bg-[#798645] text-white px-2 py-1 rounded" onclick="alert('Ikut kegiatan ${kg.title}')">Ikut</button></div></div>`).join('');
}
function renderLaporanList() {
    let filtered = [...laporanList];
    if(currentFilterLap !== "semua") filtered = filtered.filter(l=>l.status===currentFilterLap);
    document.getElementById('statTotal').innerText = laporanList.length;
    document.getElementById('statDiproses').innerText = laporanList.filter(l=>l.status==='diproses').length;
    document.getElementById('statSelesai').innerText = laporanList.filter(l=>l.status==='selesai').length;
    const container = document.getElementById('laporanListContainer');
    if(!container) return;
    if(filtered.length===0) { container.innerHTML='<div class="text-center py-8 text-gray-400">Tidak ada laporan</div>'; return; }
    container.innerHTML = filtered.map(l=>{
        const timeDiff = Math.floor((Date.now() - new Date(l.tanggal))/(3600000));
        const waktu = timeDiff<1?"baru saja":timeDiff<24?`${timeDiff} jam lalu`:Math.floor(timeDiff/24)+" hari lalu";
        let statusBadge = l.status==='baru'?'bg-blue-100 text-blue-800':l.status==='diproses'?'bg-yellow-100 text-yellow-800':'bg-green-100 text-green-800';
        let statusText = l.status==='baru'?'Baru':l.status==='diproses'?'Diproses':'Selesai';
        const hasPhoto = l.fotoBase64 ? '<i class="fas fa-image text-blue-500 ml-1"></i>' : '';
        return `<div class="laporan-card p-4"><div class="flex justify-between"><h3 class="font-bold">${l.judul} ${hasPhoto}</h3><span class="text-xs px-2 py-1 rounded-full ${statusBadge}">${statusText}</span></div><p class="text-sm text-gray-500">${l.lokasi}</p><div class="flex justify-between text-xs text-gray-400 mt-1"><span>${waktu}</span><span>${l.nama}</span></div><div class="flex justify-end mt-2"><button onclick="openDetailLaporan(${l.id})" class="text-xs border px-2 py-1 rounded">Lihat Detail</button></div></div>`;
    }).join('');
}
function openDetailLaporan(id) {
    const lap = laporanList.find(l=>l.id===id);
    if(!lap) return;
    const isAdmin = currentUser && currentUser.role === 'admin';
    let statusHtml = '';
    if(isAdmin) {
        statusHtml = `<div><span class="font-bold">Status:</span> <select id="ubahStatusSelect" class="border rounded p-1 text-sm"><option value="baru" ${lap.status==='baru'?'selected':''}>Baru/Masuk</option><option value="diproses" ${lap.status==='diproses'?'selected':''}>Diproses</option><option value="selesai" ${lap.status==='selesai'?'selected':''}>Selesai</option></select><button onclick="ubahStatusLaporan(${lap.id})" class="ml-2 px-3 py-1 bg-green-600 text-white rounded text-xs">Update</button></div>`;
    } else {
        statusHtml = `<div><span class="font-bold">Status:</span> <span class="px-2 py-1 rounded-full text-xs ${lap.status==='baru'?'bg-blue-100':lap.status==='diproses'?'bg-yellow-100':'bg-green-100'}">${lap.status==='baru'?'Baru':lap.status==='diproses'?'Diproses':'Selesai'}</span></div>`;
    }
    const fotoHtml = lap.fotoBase64 ? `<div><span class="font-bold">Foto Bukti:</span><br><img src="${lap.fotoBase64}" class="foto-preview max-h-40"></div>` : '<div class="text-gray-400">Tidak ada foto</div>';
    const content = `<div class="space-y-3"><div><span class="font-bold">Pelapor:</span> ${lap.nama}</div><div><span class="font-bold">Lokasi:</span> ${lap.lokasi}</div><div><span class="font-bold">Jenis Sampah:</span> ${lap.jenisSampah}</div><div><span class="font-bold">Deskripsi:</span> <p class="text-sm">${lap.deskripsi}</p></div>${fotoHtml}${statusHtml}<div><span class="font-bold">Tanggal Lapor:</span> ${new Date(lap.tanggal).toLocaleString()}</div></div>`;
    document.getElementById('detailLaporanContent').innerHTML = content;
    document.getElementById('detailLaporanModal').classList.remove('hidden');
}
function ubahStatusLaporan(id) {
    const select = document.getElementById('ubahStatusSelect');
    if(!select) return;
    const newStatus = select.value;
    const idx = laporanList.findIndex(l=>l.id===id);
    if(idx!==-1) { laporanList[idx].status = newStatus; saveAllData(); renderLaporanList(); }
    closeDetailLaporanModal();
}
function closeDetailLaporanModal() { document.getElementById('detailLaporanModal').classList.add('hidden'); }

let currentFotoBase64 = null;
function kirimLaporan() {
    const nama = document.getElementById('laporNama').value.trim();
    const lokasi = document.getElementById('laporLokasi').value.trim();
    const jenis = document.getElementById('laporJenis').value;
    const deskripsi = document.getElementById('laporDeskripsi').value.trim();
    const lat = parseFloat(document.getElementById('laporLat').value);
    const lng = parseFloat(document.getElementById('laporLng').value);
    if(!nama||!lokasi||!deskripsi) return alert("Isi semua field!");
    const newLap = {
        id: nextLaporanId++,
        nama, lokasi, jenisSampah: jenis, deskripsi, lat, lng,
        status: "baru", tanggal: new Date().toISOString(),
        judul: `${jenis} di ${lokasi.substring(0,30)}`,
        fotoBase64: currentFotoBase64 || null
    };
    laporanList.unshift(newLap);
    saveAllData();
    renderLaporanList();
    document.getElementById('laporNama').value=''; document.getElementById('laporLokasi').value=''; document.getElementById('laporDeskripsi').value='';
    document.getElementById('laporFoto').value=''; document.getElementById('previewFoto').innerHTML=''; currentFotoBase64=null;
    alert("Laporan terkirim!");
}

function refreshTracking() { if(trackingMap){ trackingMap.eachLayer(l=>{if(l instanceof L.Marker) trackingMap.removeLayer(l);}); allBanks.forEach(b=>{const m=L.marker([b.lat,b.lng]).addTo(trackingMap); m.bindPopup(`<b>${b.name}</b><br>${b.address}<br><button onclick="flyToBank(${b.id})" class="bg-yellow-400 px-2 py-1 rounded mt-1">Zoom ke sini</button><br><button onclick="openKondisiModalById(${b.id})" class="bg-gray-200 px-2 py-1 rounded mt-1">Detail</button>`);}); } renderBankList(); }
function openKondisiModalById(id){ const bank=allBanks.find(b=>b.id===id); if(bank){ document.getElementById('modalKondisiContent').innerHTML=`<div><b>${bank.name}</b><p>${bank.address}</p><p>Tonase: ${bank.tonPerMonth} Ton</p><p>Status 3R: ${bank.is3RActive?'Aktif':'Tidak'}</p><p>${bank.deskripsi}</p></div>`; document.getElementById('kondisiModal').classList.remove('hidden'); } }
function closeKondisiModal(){ document.getElementById('kondisiModal').classList.add('hidden'); }
function closeTambahModal(){ document.getElementById('tambahBankModal').classList.add('hidden'); }
function submitTambahBank(){
    if(!currentUser) { alert("Login dulu"); openAuthModal('login'); return; }
    const name=document.getElementById('newBankName').value.trim(), addr=document.getElementById('newBankAddress').value.trim(), lat=parseFloat(document.getElementById('newBankLat').value), lng=parseFloat(document.getElementById('newBankLng').value), ton=parseFloat(document.getElementById('newBankTon').value), is3r=document.getElementById('newBank3r').checked;
    if(!name||!addr||isNaN(lat)||isNaN(lng)||isNaN(ton)) alert("Isi semua"); else {
        allBanks.push({id:nextBankId++, name, address:addr, lat, lng, tonPerMonth:ton, is3RActive:is3r, deskripsi:`Ditambahkan ${currentUser.name}`, isCustom:true});
        saveAllData(); refreshTracking(); closeTambahModal(); alert("Bank tersimpan! Klik 'Tampilkan Peta' untuk melihat lokasinya.");
    }
}
function initTrackingMap() { if(trackingMap) trackingMap.remove(); const c=document.getElementById('trackingMainMap'); if(c){ trackingMap=L.map('trackingMainMap').setView([3.5952,98.6722],13); L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(trackingMap); allBanks.forEach(b=>{const m=L.marker([b.lat,b.lng]).addTo(trackingMap); m.bindPopup(`<b>${b.name}</b><br>${b.address}<br><button onclick="flyToBank(${b.id})" class="bg-yellow-400 px-2 py-1 rounded mt-1">Zoom ke sini</button><br><button onclick="openKondisiModalById(${b.id})" class="bg-gray-200 px-2 py-1 rounded mt-1">Detail</button>`);}); } }
function initHeroMapStatic() { if(heroMap) heroMap.remove(); const d=document.getElementById('heroMap'); if(d){ heroMap=L.map('heroMap').setView([3.5952,98.6722],13); L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(heroMap); defaultBanks.forEach(b=>{L.marker([b.lat,b.lng]).addTo(heroMap).bindPopup(b.name);}); } }
function initMiniMap() { const c=document.getElementById('miniMap'); if(c && !miniMap){ miniMap=L.map('miniMap').setView([3.5952,98.6722],13); L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(miniMap); miniMarker=L.marker([3.5952,98.6722],{draggable:true}).addTo(miniMap); miniMarker.on('dragend',()=>{const p=miniMarker.getLatLng(); document.getElementById('laporLat').value=p.lat; document.getElementById('laporLng').value=p.lng;}); miniMap.on('click',e=>{miniMarker.setLatLng(e.latlng); document.getElementById('laporLat').value=e.latlng.lat; document.getElementById('laporLng').value=e.latlng.lng;}); } }

function showPage(pageId){
    document.querySelectorAll('.page-content').forEach(p=>p.classList.add('hidden'));
    document.getElementById(`${pageId}-page`).classList.remove('hidden');
    window.scrollTo(0,0);
    if(pageId==='tracking'){ setTimeout(()=>{ if(trackingMap) trackingMap.invalidateSize(); else initTrackingMap(); renderBankList(); },100); }
    if(pageId==='komunitas'){ renderKomunitas(); renderKegiatan(); }
    if(pageId==='laporan'){ if(miniMap) miniMap.invalidateSize(); else initMiniMap(); renderLaporanList(); }
}
function closeMobileMenu(){ document.getElementById('mobileMenu').classList.add('hidden'); }

function handleRegister() {
    let name=document.getElementById('regName').value.trim(), email=document.getElementById('regEmail').value.trim(), pwd=document.getElementById('regPassword').value.trim();
    if(!name||!email||!pwd) return alert("Isi semua"); if(pwd.length<6) return alert("Min 6 karakter");
    let users=getUsers(); if(users.find(u=>u.email===email)) return alert("Email sudah terdaftar");
    users.push({id:Date.now(),name,email,password:pwd,totalKg:0, role:'user'});
    saveUsers(users); alert("Daftar berhasil!"); switchAuthTab('login');
}
function handleLogin() {
    let email=document.getElementById('loginEmail').value.trim(), pwd=document.getElementById('loginPassword').value.trim();
    if(email==='admin@gmail.com' && pwd==='2468') {
        currentUser = { id:0, name:"Admin", email:"admin@gmail.com", role:"admin", totalKg:0 };
        localStorage.setItem("bankSampahCurrentUser",JSON.stringify(currentUser));
        closeAuthModal(); updateNavAuthDisplay(); showPage('beranda'); alert("Login sebagai ADMIN");
        return;
    }
    let user=getUsers().find(u=>u.email===email && u.password===pwd);
    if(!user) return alert("Email/password salah");
    currentUser = {...user, role:'user'};
    localStorage.setItem("bankSampahCurrentUser",JSON.stringify(currentUser));
    closeAuthModal(); updateNavAuthDisplay(); showPage('beranda'); alert(`Selamat datang, ${user.name}`);
}
function handleLogout() { currentUser=null; localStorage.removeItem("bankSampahCurrentUser"); updateNavAuthDisplay(); showPage('beranda'); alert("Logout"); }
function updateNavAuthDisplay() {
    let loggedIn=!!currentUser, isAdmin = currentUser && currentUser.role==='admin';
    document.getElementById('loginBtnDesktop').classList.toggle('hidden',loggedIn);
    document.getElementById('logoutBtnDesktop').classList.toggle('hidden',!loggedIn);
    document.getElementById('mobileLoginBtn').classList.toggle('hidden',loggedIn);
    document.getElementById('mobileLogoutBtn').classList.toggle('hidden',!loggedIn);
    const adminBadgeDesk = document.getElementById('adminBadgeDesktop');
    const adminBadgeMob = document.getElementById('adminBadgeMobile');
    if(isAdmin) { adminBadgeDesk.classList.remove('hidden'); adminBadgeMob.classList.remove('hidden'); }
    else { adminBadgeDesk.classList.add('hidden'); adminBadgeMob.classList.add('hidden'); }
}
function openAuthModal(tab){ document.getElementById('authModal').classList.remove('hidden'); switchAuthTab(tab); }
function closeAuthModal(){ document.getElementById('authModal').classList.add('hidden'); }
function switchAuthTab(tab){
    let loginForm=document.getElementById('loginForm'), regForm=document.getElementById('registerForm'), tabLogin=document.getElementById('tabLoginBtn'), tabReg=document.getElementById('tabRegisterBtn');
    if(tab==='login'){ loginForm.classList.remove('hidden'); regForm.classList.add('hidden'); tabLogin.style.borderBottom='3px solid var(--kuning)'; tabLogin.style.color='var(--hijau-gelap)'; tabReg.style.borderBottom='none'; tabReg.style.color='gray'; }
    else { loginForm.classList.add('hidden'); regForm.classList.remove('hidden'); tabReg.style.borderBottom='3px solid var(--kuning)'; tabReg.style.color='var(--hijau-gelap)'; tabLogin.style.borderBottom='none'; tabLogin.style.color='gray'; }
}
function updateFilterLapUI(active) { document.querySelectorAll('[data-filter-lap]').forEach(c=>c.classList.remove('active')); if(active==='semua') document.getElementById('filterLapSemua').classList.add('active'); else if(active==='baru') document.getElementById('filterLapBaru').classList.add('active'); else if(active==='diproses') document.getElementById('filterLapDiproses').classList.add('active'); else if(active==='selesai') document.getElementById('filterLapSelesai').classList.add('active'); }

document.addEventListener('DOMContentLoaded',()=>{
    loadData();
    const saved = localStorage.getItem("bankSampahCurrentUser");
    if(saved){ currentUser = JSON.parse(saved); }
    updateNavAuthDisplay();
    showPage('beranda');
    initHeroMapStatic();
    initTrackingMap();
    renderBankList();
    renderKomunitas(); renderKegiatan();
    initMiniMap();
    document.getElementById('menuBtn').addEventListener('click',()=>{document.getElementById('mobileMenu').classList.toggle('hidden');});
    document.getElementById('openTambahBtn')?.addEventListener('click',()=>{ if(!currentUser){ alert("Login dulu"); openAuthModal('login'); } else document.getElementById('tambahBankModal').classList.remove('hidden'); });
    
    // ========== PERBAIKAN FILTER TRACKING ==========
    const filterAll = document.getElementById('filterAll');
    const filter3r = document.getElementById('filter3r');
    const filterNearest = document.getElementById('filterNearest');
    
    if (filterAll) {
        filterAll.addEventListener('click', () => {
            currentFilterBank = "all";
            userLatBank = null;
            userLngBank = null;
            updateFilterBankUI('all');
            renderBankList();
        });
    }
    if (filter3r) {
        filter3r.addEventListener('click', () => {
            currentFilterBank = "3r";
            updateFilterBankUI('3r');
            renderBankList();
        });
    }
    if (filterNearest) {
        filterNearest.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userLatBank = position.coords.latitude;
                        userLngBank = position.coords.longitude;
                        currentFilterBank = "nearest";
                        updateFilterBankUI('nearest');
                        renderBankList();
                        // Pindahkan peta ke lokasi pengguna
                        if (trackingMap) trackingMap.setView([userLatBank, userLngBank], 13);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        alert("Tidak dapat mengakses lokasi. Filter 'Terdekat' tidak dapat mengurutkan.");
                        // Tetap set filter tapi tanpa sorting karena userLatBank null
                        currentFilterBank = "nearest";
                        updateFilterBankUI('nearest');
                        renderBankList(); // tetap menampilkan semua karena userLatBank null
                    }
                );
            } else {
                alert("Browser Anda tidak mendukung geolokasi.");
                currentFilterBank = "nearest";
                updateFilterBankUI('nearest');
                renderBankList();
            }
        });
    }
    
    document.getElementById('searchBankInput')?.addEventListener('input',()=>renderBankList());
    document.getElementById('filterLapSemua')?.addEventListener('click',()=>{ currentFilterLap="semua"; updateFilterLapUI("semua"); renderLaporanList(); });
    document.getElementById('filterLapBaru')?.addEventListener('click',()=>{ currentFilterLap="baru"; updateFilterLapUI("baru"); renderLaporanList(); });
    document.getElementById('filterLapDiproses')?.addEventListener('click',()=>{ currentFilterLap="diproses"; updateFilterLapUI("diproses"); renderLaporanList(); });
    document.getElementById('filterLapSelesai')?.addEventListener('click',()=>{ currentFilterLap="selesai"; updateFilterLapUI("selesai"); renderLaporanList(); });
    document.getElementById('komFilterAll')?.addEventListener('click',()=>{ currentKomFilter="all"; renderKomunitas(); });
    document.getElementById('komFilterAktif')?.addEventListener('click',()=>{ currentKomFilter="aktif"; renderKomunitas(); });
    document.getElementById('komFilterTerdekat')?.addEventListener('click',()=>{ if(navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>{ userLatKom=p.coords.latitude; userLngKom=p.coords.longitude; currentKomFilter="terdekat"; renderKomunitas(); },()=>{ alert("Gagal"); currentKomFilter="terdekat"; renderKomunitas(); }); else alert("Tidak support"); });
    document.getElementById('searchKomunitas')?.addEventListener('input',()=>renderKomunitas());
});

document.getElementById('laporFoto')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file && (file.type==='image/jpeg'||file.type==='image/png')) {
        if(file.size>2*1024*1024) { alert("Maksimal 2MB"); this.value=''; currentFotoBase64=null; document.getElementById('previewFoto').innerHTML=''; return; }
        const reader = new FileReader();
        reader.onload = ev=>{ currentFotoBase64=ev.target.result; document.getElementById('previewFoto').innerHTML=`<img src="${currentFotoBase64}" class="foto-preview">`; };
        reader.readAsDataURL(file);
    } else { alert("Format JPG/PNG"); this.value=''; currentFotoBase64=null; document.getElementById('previewFoto').innerHTML=''; }
});
