/**
 * Slice Heritage-01 JAWA template:
 * 1. Fix asset paths
 * 2. Strip WP/tracking bloat
 * 3. Tokenize all data fields
 * 4. Inject RSVP card section
 * 5. Replace WDP wishes with our system
 *
 * Usage: node scripts/slice-heritage-01.js
 */

const fs = require("fs");
const path = require("path");

const BASE = path.join(__dirname, "..");
const SRC = path.join(BASE, "doc/template-preview/Heritage - 01 JAWA - PREVIEW.html");
const DEST = path.join(BASE, "public/templates/heritage-01-jawa/index.html");
const RSVP_CARD = path.join(BASE, "public/templates/heritage-01-jawa/_rsvp-card.html");
const WISHES = path.join(BASE, "public/templates/heritage-01-jawa/_wishes.html");

let html = fs.readFileSync(SRC, "utf8");

// ── 1. Fix asset paths ──────────────────────────────────────────────────────
html = html.replaceAll("./Heritage - 01 JAWA - PREVIEW_files/", "./assets/");

// ── 2. Strip WP/tracking bloat ──────────────────────────────────────────────
html = html.replace(/<script[^>]*fbevents[^>]*>[\s\S]*?<\/script>/g, "");
html = html.replace(/<script[^>]*application\/ld\+json[\s\S]*?<\/script>/g, "");
html = html.replace(/<script[^>]*pys-version[^>]*>[\s\S]*?<\/script>/g, "");
html = html.replace(/<link rel="canonical"[^>]*>/g, "");
html = html.replace(/<meta property="og:[^>]*>/g, "");
html = html.replace(/<meta property="article:[^>]*>/g, "");
html = html.replace(/<meta name="robots"[^>]*>/g, "");
html = html.replace(/<script>[\s\S]*?wpEmojiSettings[\s\S]*?<\/script>/g, "");
html = html.replace(/<style id="wp-emoji-styles-inline-css">[\s\S]*?<\/style>/g, "");
html = html.replace(/<style id="global-styles-inline-css">[\s\S]*?<\/style>/g, "");
html = html.replace(/<style id="classic-theme-styles-inline-css">[\s\S]*?<\/style>/g, "");
html = html.replace(/<link rel="dns-prefetch"[^>]*>/g, "");

// ── 3. Title & meta ─────────────────────────────────────────────────────────
html = html.replace(
  /<title>[^<]*<\/title>/,
  "<title>{{NAMA_PRIA_PANGGIL}} & {{NAMA_WANITA_PANGGIL}} - Undangan Pernikahan</title>"
);
html = html.replace(
  /<meta name="description"[^>]*>/,
  '<meta name="description" content="Undangan Pernikahan {{NAMA_PRIA_PANGGIL}} & {{NAMA_WANITA_PANGGIL}}">'
);

// ── 4. Tokenize: pasangan ───────────────────────────────────────────────────

// Couple names (title & closing)
html = html.replaceAll(">Elyana &amp; Syahril<", ">{{NAMA_WANITA_PANGGIL}} &amp; {{NAMA_PRIA_PANGGIL}}<");
html = html.replaceAll("Elyana &amp; Syahril", "{{NAMA_WANITA_PANGGIL}} &amp; {{NAMA_PRIA_PANGGIL}}");

// Inisial heading (single char h2)
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">E<\/h2>/,
  '<h2 class="elementor-heading-title elementor-size-default">{{INISIAL_WANITA}}</h2>'
);
html = html.replace(
  /<h2 class="elementor-heading-title elementor-size-default">S<\/h2>/,
  '<h2 class="elementor-heading-title elementor-size-default">{{INISIAL_PRIA}}</h2>'
);

// Nama panggilan (p tag)
html = html.replace(
  /<p class="elementor-heading-title elementor-size-default">Elyana<\/p>/,
  '<p class="elementor-heading-title elementor-size-default">{{NAMA_WANITA_PANGGIL}}</p>'
);
html = html.replace(
  /<p class="elementor-heading-title elementor-size-default">Syahril<\/p>/,
  '<p class="elementor-heading-title elementor-size-default">{{NAMA_PRIA_PANGGIL}}</p>'
);

// Nama lengkap (p tag)
html = html.replace(
  /<p class="elementor-heading-title elementor-size-default">Elyana Azkiya Nur<\/p>/,
  '<p class="elementor-heading-title elementor-size-default">{{NAMA_WANITA_LENGKAP}}</p>'
);
html = html.replace(
  /<p class="elementor-heading-title elementor-size-default">Syahril Rendra Backhtiar<\/p>/,
  '<p class="elementor-heading-title elementor-size-default">{{NAMA_PRIA_LENGKAP}}</p>'
);

// Orang tua
html = html.replace(
  "Putri dari Bapak Nasrudin Hatta<br>&amp; Ibu Elma Muna",
  "{{ORTU_WANITA}}"
);
html = html.replace(
  "Putra dari Bapak Sufian Jadin<br>&amp; Ibu Elmira Ghendis",
  "{{ORTU_PRIA}}"
);

// Instagram — first occurrence = wanita, second = pria
const igPattern = /href="https:\/\/www\.instagram\.com\/"[^>]*>\s*<span class="elementor-button-content-wrapper">\s*<span class="elementor-button-icon">\s*<i aria-hidden="true" class="fab fa-instagram"><\/i>\s*<\/span>\s*<span class="elementor-button-text">@username<\/span>/g;
let igCount = 0;
html = html.replace(igPattern, (match) => {
  igCount++;
  if (igCount === 1) {
    return 'href="{{IG_WANITA_URL}}" target="_blank"><span class="elementor-button-content-wrapper"><span class="elementor-button-icon"><i aria-hidden="true" class="fab fa-instagram"></i></span><span class="elementor-button-text">{{IG_WANITA}}</span>';
  }
  return 'href="{{IG_PRIA_URL}}" target="_blank"><span class="elementor-button-content-wrapper"><span class="elementor-button-icon"><i aria-hidden="true" class="fab fa-instagram"></i></span><span class="elementor-button-text">{{IG_PRIA}}</span>';
});

// ── 5. Tokenize: tanggal & acara ────────────────────────────────────────────

html = html.replace(/>31 \. 12 \. 24</, ">{{TANGGAL_SINGKAT}}<");
html = html.replace(/>Minggu, 31 Desember 2024</, ">{{TANGGAL_HEADER}}<");
html = html.replace(/data-date="Dec 31 2024 0:00:00"/, 'data-date="{{COUNTDOWN_DATE}}"');

// Hari, tanggal, waktu, venue, alamat — first occurrence = Akad, second = Resepsi
function replaceNth(str, pattern, replacements) {
  let idx = 0;
  return str.replace(new RegExp(pattern, "g"), (match) => replacements[idx++] || match);
}

html = replaceNth(
  html,
  '<h2 class="elementor-heading-title elementor-size-default">minggu<\\/h2>',
  [
    '<h2 class="elementor-heading-title elementor-size-default">{{AKAD_HARI}}</h2>',
    '<h2 class="elementor-heading-title elementor-size-default">{{RESEPSI_HARI}}</h2>',
  ]
);
html = replaceNth(
  html,
  '<h2 class="elementor-heading-title elementor-size-default">31 desember 2024<\\/h2>',
  [
    '<h2 class="elementor-heading-title elementor-size-default">{{AKAD_TANGGAL}}</h2>',
    '<h2 class="elementor-heading-title elementor-size-default">{{RESEPSI_TANGGAL}}</h2>',
  ]
);
html = replaceNth(
  html,
  '<h2 class="elementor-heading-title elementor-size-default">08\\.00 WIB - 10\\.00 WIB<\\/h2>',
  [
    '<h2 class="elementor-heading-title elementor-size-default">{{AKAD_WAKTU}}</h2>',
    '<h2 class="elementor-heading-title elementor-size-default">{{RESEPSI_WAKTU}}</h2>',
  ]
);
html = replaceNth(
  html,
  '<h2 class="elementor-heading-title elementor-size-default">Auditorium Masjid<\\/h2>',
  [
    '<h2 class="elementor-heading-title elementor-size-default">{{AKAD_VENUE}}</h2>',
    '<h2 class="elementor-heading-title elementor-size-default">{{RESEPSI_VENUE}}</h2>',
  ]
);
html = replaceNth(
  html,
  '<h2 class="elementor-heading-title elementor-size-default">Jalan Raya Bojongsari No\\.5, Gunung Putri, Citeureup, Bogor, Jawa Barat<\\/h2>',
  [
    '<h2 class="elementor-heading-title elementor-size-default">{{AKAD_ALAMAT}}</h2>',
    '<h2 class="elementor-heading-title elementor-size-default">{{RESEPSI_ALAMAT}}</h2>',
  ]
);

// Google Maps buttons
const mapsPattern = /href="https:\/\/terhubung\.id\/heritage-01\/\?to=Nama\+Tamu#"[^>]*>\s*<span class="elementor-button-content-wrapper">\s*<span class="elementor-button-icon">\s*<i aria-hidden="true" class="fas fa-map-marker-alt"><\/i>\s*<\/span>\s*<span class="elementor-button-text">Google Map<\/span>/g;
let mapsCount = 0;
html = html.replace(mapsPattern, (match) => {
  mapsCount++;
  const slug = mapsCount === 1 ? "AKAD" : "RESEPSI";
  return `href="{{${slug}_MAPS_URL}}" target="_blank"><span class="elementor-button-content-wrapper"><span class="elementor-button-icon"><i aria-hidden="true" class="fas fa-map-marker-alt"></i></span><span class="elementor-button-text">Google Map</span>`;
});

// "Buka Undangan" button — keep #open hash for Elementor page-scroll-to-id plugin
html = html.replace(
  /href="https:\/\/terhubung\.id\/heritage-01\/\?to=Nama\+Tamu#open"[^>]*/,
  'href="#open"'
);

// ── 6. Tokenize: gallery photos ─────────────────────────────────────────────

const galleryFiles = [
  "Heritage-1-qx4cuhvz6ddu8y3hil1ztidz2rynvyt7rwx0pydv0g.jpeg",
  "Heritage-2-qx4cuml64jk9uzwnr534nz7a1pbhygbvgk6g4c6w5c.jpeg",
  "Heritage-3-qx4cuogui7mui7txg5wdsyq78h28dujc4thf2w43sw.jpeg",
  "Heritage-4-qx4cuqcivvpf5fr756pmxy94f8syt8qst2se1g1bgg.jpeg",
  "Heritage-5-qx4curad2pqph1ptzp49ig0l0moc0xuj57fvipzxa8.jpeg",
  "Heritage-6-qx4cut61gdta49n3opxinfji7ef2gc1ztgquh9x4xs.jpeg",
  "Heritage-7-qx4cuv1pu1vurhkddqqrsf2fe65svq9ghq1tftuclc.jpeg",
  "Heritage-8-qx4cuwxe7pyfephn2rk0xelckxwjb4gx5zcsedrk8w.jpeg",
  "Heritage-9-qx4cuyt2le101xewrsda2e49rpn9qiodu8nrcxorwg.jpeg",
  "Heritage-10-qx4cuzqws82adjdjmarwmvvqd3imy7s46db8u7ndq8.jpeg",
  "Heritage-11-qx4cv1ml5w4v0ratbbl5rvenjv9ddlzkumm7srklds.jpeg",
  "Heritage-12-qx4cv4g3qe8pzl6puut1hcp1c0vh0parv0ko8lgev4.jpeg",
  "Heritage-13-qx4cv6bs42bamt3zjvmamc7yism7g3i8j9vn75dmio.jpeg",
  "Heritage-14-qx4cv87ghqdva1198wfjrbqvpkcxvhpp7j6m5pau68.jpeg",
  "Heritage-15-qx4cvb0z28hq8ux5sfnfgt19hpz1il0w7x52lj6nnk.jpeg",
];
galleryFiles.forEach((file, i) => {
  html = html.replaceAll(`./assets/${file}`, `{{FOTO_${i + 1}}}`);
});
// Clean name references in slideshow backgrounds
const slideshowClean = { "Heritage-4.jpeg": "FOTO_4", "Heritage-5.jpeg": "FOTO_5", "Heritage-7.jpeg": "FOTO_7" };
for (const [name, token] of Object.entries(slideshowClean)) {
  html = html.replaceAll(`https://terhubung.id/wp-content/uploads/${name}`, `{{${token}}}`);
}

// ── 7. Tokenize: love story ─────────────────────────────────────────────────

const loveStoryData = [
  { year: "2015", cerita: "Kami pertama kali bertemu satu sama lain di sebuah acara peminatan di kampus. Kami berkenalan karena kami menjadi perwakilan masing-masing divisi kegiatan yang kami selenggarakan." },
  { year: "2019", cerita: "Setelah lama tidak bertemu akhirnya kami bertemu kembali di sebuah acara seminar profesional. Kebetulan kami berada di bidang yang sama." },
  { year: "2023", cerita: "Salah satu momen yang tidak disangka, Syahril melamar saya dengan langsung menyatakan keinginannya kepada ayah saya. Kami pun bersiap dengan petualangan baru." },
  { year: "2024", cerita: "Momen spesial kami akan dimulai dari titik ini, momen kebahagiaan kami bersama membangun keluarga kecil kami. Semoga Allah SWT memberikan keberkahan untuk pernikahan kami." },
];
loveStoryData.forEach(({ year, cerita }, i) => {
  const n = i + 1;
  // Years are in <p> tags, not <h2>
  html = html.replace(
    new RegExp(`(<p class="elementor-heading-title elementor-size-default">)${year}(<\\/p>)`),
    `$1{{LOVE_STORY_${n}_TAHUN}}$2`
  );
  html = html.replace(cerita, `{{LOVE_STORY_${n}_CERITA}}`);
});

// ── 8. Tokenize: love gift ──────────────────────────────────────────────────

// Bank info (actual HTML has <br> and <b> tags)
html = html.replace(
  /Bank Mandiri<br>No\. Rekening 123123123<br>a\.n <b>Elyana Azkiya Nur<\/b>/g,
  "{{BANK_NAMA}}<br>No. Rekening {{BANK_NOREK}}<br>a.n <b>{{BANK_ATASNAMA}}</b>"
);
// Kado address (with <b> tag)
html = html.replace(
  /<b>Elyana Azkiya Nur<br><\/b>Jalan Raya Bojongsari No\.5, Gunung Putri, Citeureup, Bogor, Jawa Barat/g,
  "<b>{{KADO_NAMA}}<br></b>{{KADO_ALAMAT}}"
);
// Kado address in copy-content span (may have newline separator)
html = html.replace(
  /Elyana Azkiya Nur[\n\r\s]+Jalan Raya Bojongsari No\.5, Gunung Putri, Citeureup, Bogor, Jawa Barat/g,
  "{{KADO_NAMA}}\n{{KADO_ALAMAT}}"
);
// Fallback with space
html = html.replace(
  /Elyana Azkiya Nur Jalan Raya Bojongsari No\.5, Gunung Putri, Citeureup, Bogor, Jawa Barat/g,
  "{{KADO_NAMA}} {{KADO_ALAMAT}}"
);

// ── 9. Tokenize: music & misc ───────────────────────────────────────────────

html = html.replace(
  /src="https:\/\/terhubung\.id\/wp-content\/uploads\/FULL[^"]+"/,
  'src="{{MUSIC_URL}}"'
);
html = html.replace("Original Design By:elemenpress.com", "Made with ♥ by NIKAHKU");

// ── 10. Inject RSVP card (before gallery section) ───────────────────────────

const rsvpCardHtml = fs.readFileSync(RSVP_CARD, "utf8");
const wishesHtml = fs.readFileSync(WISHES, "utf8");

// Find gallery section position
const galleryPos = html.indexOf(">Our Gallery<");
const gallerySectionStart = html.lastIndexOf("<section", galleryPos);

html = html.slice(0, gallerySectionStart) + rsvpCardHtml + "\n" + html.slice(gallerySectionStart);
console.log("✓ RSVP card injected before gallery section");

// ── 11. Replace WDP wishes section with our system ──────────────────────────

// Recalculate positions after RSVP injection
const wdpDivStart = html.indexOf('<div class="wdp-wrapper');
const wdpSectionStart = html.lastIndexOf("<section", wdpDivStart);

// Find matching closing </section> for the WDP outer section
let depth = 0;
let pos = wdpSectionStart;
let wdpSectionEnd = -1;
while (pos < html.length) {
  if (html.slice(pos, pos + 8) === "<section") depth++;
  else if (html.slice(pos, pos + 10) === "</section>") {
    depth--;
    if (depth === 0) { wdpSectionEnd = pos + 10; break; }
  }
  pos++;
}

// Also grab the "Kami Yang Berbahagia" section that comes after WDP (it's now in our wishes template)
// Find the next section after WDP that contains closing text
const afterWdp = html.slice(wdpSectionEnd, wdpSectionEnd + 2000);
const closingSectionMatch = afterWdp.match(/<section[^>]*>[\s\S]*?Kami Yang Berbahagia/);
let finalEnd = wdpSectionEnd;
if (closingSectionMatch) {
  // Find the outer closing section for this
  const closingStart = wdpSectionEnd + afterWdp.indexOf(closingSectionMatch[0]);
  let d2 = 0, p2 = closingStart, closingSectionEnd = -1;
  while (p2 < html.length) {
    if (html.slice(p2, p2 + 8) === "<section") d2++;
    else if (html.slice(p2, p2 + 10) === "</section>") { d2--; if(d2 === 0){ closingSectionEnd = p2 + 10; break; } }
    p2++;
  }
  if (closingSectionEnd > 0) finalEnd = closingSectionEnd;
}

if (wdpSectionEnd > 0) {
  html = html.slice(0, wdpSectionStart) + wishesHtml + "\n" + html.slice(finalEnd);
  console.log("✓ WDP wishes replaced with NIKAHKU wishes system");
} else {
  console.warn("⚠ WDP section not found, appending wishes before </body>");
  html = html.replace("</body>", wishesHtml + "\n</body>");
}

// ── 12. Write output ────────────────────────────────────────────────────────

fs.writeFileSync(DEST, html, "utf8");
console.log(`✓ Template written to ${DEST}`);
console.log(`  Size: ${(html.length / 1024).toFixed(1)} KB`);
