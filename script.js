// Database Lagu Menggunakan Streaming Audio Server Gratis & Legal
const databaseLagu = [
    { id: 0, judul: "Lofi Study Beats (Fokus Santai)", artis: "Chilled Waves", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 1, judul: "Acoustic Sunset Piano", artis: "Instrumental ID", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 2, judul: "Deep Thinking Chill", artis: "Brainwave Booster", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 3, judul: "Midnight Coffee Ambient", artis: "Kreator Musik", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

let indexLaguAktif = 0;
let sedangMemutar = false;

const audio = document.getElementById('audioEngine');
const playBar = document.getElementById('playerBar');
const piringan = document.getElementById('piringanVinyl');
const btnPlayUtama = document.getElementById('btnPlayUtama');
const miniWave = document.getElementById('miniWave');

// Render Lagu ke Layar HP
function muatDaftarLagu(data) {
    const container = document.getElementById('containerDaftarLagu');
    if (!container) return;
    container.innerHTML = "";
    document.getElementById('totalLagu').innerText = `${data.length} Lagu Tersedia`;

    data.forEach(lagu => {
        container.innerHTML += `
            <div id="barisLagu-${lagu.id}" onclick="putarLaguSpesifik(${lagu.id})" class="bg-slate-900 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-850 transition group">
                <div class="flex items-center gap-3 truncate">
                    <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-orange-400 transition flex-shrink-0">
                        <i class="fa-solid fa-play text-[10px]"></i>
                    </div>
                    <div class="truncate">
                        <h4 class="text-xs font-bold text-slate-200 group-hover:text-orange-400 truncate">${lagu.judul}</h4>
                        <p class="text-[10px] text-slate-400 truncate">${lagu.artis}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 ml-2 flex-shrink-0">
                    <span class="text-[8px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold">HQ</span>
                    <i onclick="event.stopPropagation(); this.classList.toggle('text-rose-500'); this.classList.toggle('fa-regular'); this.classList.toggle('fa-solid')" class="fa-regular fa-heart text-xs text-slate-500 hover:text-rose-500 cursor-pointer"></i>
                </div>
            </div>`;
    });
}

// Jalankan Player Musik
function putarLaguSpesifik(id) {
    indexLaguAktif = databaseLagu.findIndex(l => l.id === id);
    const lagu = databaseLagu[indexLaguAktif];
    
    audio.src = lagu.src;
    audio.play();
    sedangMemutar = true;
    
    // Tampilkan Bar Kontrol bawah
    playBar.classList.remove('translate-y-full');
    
    document.getElementById('bannerJudul').innerText = lagu.judul;
    document.getElementById('bannerArtis').innerText = lagu.artis;
    document.getElementById('playerJudul').innerText = lagu.judul;
    document.getElementById('playerArtis').innerText = lagu.artis;

    updateEfekVisual(true);
    tandaiLaguAktif(id);
}

function toggleMainPlay() {
    if(audio.src === "" || audio.src === window.location.href) { putarLaguSpesifik(databaseLagu[0].id); return; }
    if(sedangMemutar) {
        audio.pause();
        sedangMemutar = false;
        updateEfekVisual(false);
    } else {
        audio.play();
        sedangMemutar = true;
        updateEfekVisual(true);
    }
}

function updateEfekVisual(isPlay) {
    if(isPlay) {
        piringan.classList.remove('vinyl-paused');
        btnPlayUtama.innerHTML = `<i class="fa-solid fa-pause text-xs"></i>`;
        miniWave.classList.remove('hidden');
    } else {
        piringan.classList.add('vinyl-paused');
        btnPlayUtama.innerHTML = `<i class="fa-solid fa-play text-xs ml-0.5"></i>`;
        miniWave.classList.add('hidden');
    }
}

function tandaiLaguAktif(id) {
    databaseLagu.forEach(l => {
        const el = document.getElementById(`barisLagu-${l.id}`);
        if(el) el.className = "bg-slate-900 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-850 transition group";
    });
    const aktif = document.getElementById(`barisLagu-${id}`);
    if(aktif) aktif.className = "bg-slate-900 border-2 border-orange-500 p-3.5 rounded-xl flex items-center justify-between cursor-pointer shadow-xl shadow-orange-500/10";
}

function laguBerikutnya() {
    let next = indexLaguAktif + 1;
    if(next >= databaseLagu.length) next = 0;
    putarLaguSpesifik(databaseLagu[next].id);
}

function laguSebelumnya() {
    let prev = indexLaguAktif - 1;
    if(prev < 0) prev = databaseLagu.length - 1;
    putarLaguSpesifik(databaseLagu[prev].id);
}

function cariLagu() {
    const keyword = document.getElementById('inputCari').value.toLowerCase();
    const hasil = databaseLagu.filter(l => l.judul.toLowerCase().includes(keyword) || l.artis.toLowerCase().includes(keyword));
    muatDaftarLagu(hasil);
}

// Progress Durasi Bar Handler
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('indicatorProgress').style.width = `${progress}%`;
    
    let minJalan = Math.floor(audio.currentTime / 60);
    let detJalan = Math.floor(audio.currentTime % 60);
    if(detJalan < 10) detJalan = `0${detJalan}`;
    document.getElementById('waktuJalan').innerText = `${minJalan}:${detJalan}`;
});

audio.addEventListener('loadedmetadata', () => {
    let minTotal = Math.floor(audio.duration / 60);
    let detTotal = Math.floor(audio.duration % 60);
    if(detTotal < 10) detTotal = `0${detTotal}`;
    document.getElementById('waktuTotal').innerText = `${minTotal}:${detTotal}`;
});

function aturProgress(e) {
    const bar = document.getElementById('barProgress');
    const posisi = (e.offsetX / bar.offsetWidth);
    audio.currentTime = posisi * audio.duration;
}

audio.addEventListener('ended', () => { laguBerikutnya(); });

// Mulai aplikasi musik
muatDaftarLagu(databaseLagu);

