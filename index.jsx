import { useState, useEffect, useRef } from "react";

// ============================================================
// PIXEL FONT + GLOBAL STYLES (injected via style tag)
// ============================================================
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&family=Rajdhani:wght@300;400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0f;
      --fog1: rgba(80,40,140,0.18);
      --fog2: rgba(20,180,180,0.10);
      --fog3: rgba(255,80,120,0.07);
      --glass: rgba(255,255,255,0.055);
      --glass-border: rgba(255,255,255,0.13);
      --glass-hover: rgba(255,255,255,0.10);
      --cyan: #00f5d4;
      --magenta: #f72585;
      --gold: #ffd60a;
      --purple: #7b2fff;
      --white: #e8e8f0;
      --muted: rgba(232,232,240,0.45);
      --pixel: 'Press Start 2P', monospace;
      --vt: 'VT323', monospace;
      --body: 'Rajdhani', sans-serif;
      --radius: 4px;
      --shadow-glow-cyan: 0 0 24px rgba(0,245,212,0.25), 0 0 60px rgba(0,245,212,0.08);
      --shadow-glow-magenta: 0 0 24px rgba(247,37,133,0.25), 0 0 60px rgba(247,37,133,0.08);
      --shadow-glow-gold: 0 0 24px rgba(255,214,10,0.3), 0 0 60px rgba(255,214,10,0.10);
    }

    html, body, #root {
      height: 100%;
      background: var(--bg);
      color: var(--white);
      font-family: var(--body);
      overflow-x: hidden;
    }

    /* ---- PIXEL GRID BACKGROUND ---- */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
      z-index: 0;
    }

    /* ---- FOG LAYERS ---- */
    .fog-layer {
      position: fixed; inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .fog-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.55;
      animation: fogDrift 18s ease-in-out infinite alternate;
    }
    .fog-blob:nth-child(1) { width: 600px; height: 600px; background: var(--fog1); top: -100px; left: -100px; animation-duration: 20s; }
    .fog-blob:nth-child(2) { width: 500px; height: 500px; background: var(--fog2); top: 40%; right: -80px; animation-duration: 25s; animation-delay: -8s; }
    .fog-blob:nth-child(3) { width: 400px; height: 400px; background: var(--fog3); bottom: -80px; left: 30%; animation-duration: 22s; animation-delay: -4s; }

    @keyframes fogDrift {
      from { transform: translate(0, 0) scale(1); }
      to { transform: translate(40px, 30px) scale(1.12); }
    }

    /* ---- SCANLINE OVERLAY ---- */
    body::after {
      content: '';
      position: fixed; inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.06) 2px,
        rgba(0,0,0,0.06) 4px
      );
      pointer-events: none;
      z-index: 9999;
    }

    /* ---- GLASS PANEL ---- */
    .glass {
      background: var(--glass);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(18px) saturate(1.5);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      border-radius: var(--radius);
    }
    .glass:hover { background: var(--glass-hover); }

    /* ---- PIXEL TEXT ---- */
    .pixel { font-family: var(--pixel); }
    .vt { font-family: var(--vt); }
    .body-font { font-family: var(--body); }

    /* ---- PIXEL BUTTON ---- */
    .btn-pixel {
      font-family: var(--pixel);
      font-size: 8px;
      padding: 12px 20px;
      border: 2px solid var(--cyan);
      background: transparent;
      color: var(--cyan);
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      transition: all 0.15s;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    }
    .btn-pixel::before {
      content: '';
      position: absolute; inset: 0;
      background: var(--cyan);
      opacity: 0;
      transition: opacity 0.15s;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    }
    .btn-pixel:hover { color: var(--bg); box-shadow: var(--shadow-glow-cyan); }
    .btn-pixel:hover::before { opacity: 1; }
    .btn-pixel span { position: relative; z-index: 1; }
    .btn-pixel.magenta { border-color: var(--magenta); color: var(--magenta); }
    .btn-pixel.magenta:hover { box-shadow: var(--shadow-glow-magenta); }
    .btn-pixel.magenta::before { background: var(--magenta); }
    .btn-pixel.gold { border-color: var(--gold); color: var(--gold); }
    .btn-pixel.gold:hover { box-shadow: var(--shadow-glow-gold); }
    .btn-pixel.gold::before { background: var(--gold); }

    /* ---- INPUT ---- */
    .input-pixel {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--glass-border);
      color: var(--white);
      font-family: var(--body);
      font-size: 15px;
      padding: 12px 16px;
      border-radius: var(--radius);
      outline: none;
      width: 100%;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-pixel:focus { border-color: var(--cyan); box-shadow: 0 0 0 2px rgba(0,245,212,0.15); }
    .input-pixel::placeholder { color: var(--muted); }

    /* ---- XP BAR ---- */
    .xp-bar-track {
      height: 8px;
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
    }
    .xp-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--cyan), var(--purple));
      border-radius: 4px;
      transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 0 10px var(--cyan);
    }

    /* ---- TOAST ---- */
    .toast {
      position: fixed;
      bottom: 32px; right: 32px;
      z-index: 10000;
      animation: toastIn 0.3s ease;
    }
    @keyframes toastIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* ---- OPTION BUTTON ---- */
    .option-btn {
      width: 100%;
      background: var(--glass);
      border: 1px solid var(--glass-border);
      color: var(--white);
      font-family: var(--body);
      font-size: 15px;
      font-weight: 600;
      padding: 14px 20px;
      text-align: left;
      cursor: pointer;
      border-radius: var(--radius);
      transition: all 0.2s;
      backdrop-filter: blur(12px);
      display: flex; align-items: center; gap: 12px;
    }
    .option-btn:hover { background: var(--glass-hover); border-color: var(--cyan); color: var(--cyan); }
    .option-btn.correct { border-color: var(--cyan); background: rgba(0,245,212,0.1); color: var(--cyan); box-shadow: var(--shadow-glow-cyan); }
    .option-btn.wrong { border-color: var(--magenta); background: rgba(247,37,133,0.1); color: var(--magenta); box-shadow: var(--shadow-glow-magenta); }
    .option-btn.disabled { pointer-events: none; opacity: 0.5; }

    /* ---- BADGE ---- */
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 10px;
      border-radius: 2px;
      font-family: var(--pixel);
      font-size: 7px;
      border: 1px solid;
    }

    /* ---- SCROLL ---- */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }

    /* ---- FADE IN ---- */
    .fade-in { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

    /* ---- BLINK ---- */
    .blink { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }

    /* ---- LEVEL UP ---- */
    .levelup-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 9998;
      animation: fadeIn 0.3s ease;
    }

    /* ---- STREAK FLAME ---- */
    @keyframes flame { 0%,100%{transform:scale(1) rotate(-2deg);} 50%{transform:scale(1.15) rotate(2deg);} }
    .flame { display:inline-block; animation: flame 0.7s ease-in-out infinite; }
  `}</style>
);

// ============================================================
// MOCK DATA — soal AI-generated (developer bisa edit via panel)
// ============================================================
const QUESTIONS_DB = {
  SD: {
    "Matematika": [
      { id: "sd-m-1", question: "Berapakah hasil dari 125 × 8 - 200 ÷ 4?", options: ["A. 950", "B. 1000", "C. 950", "D. 1050"], answer: 0, explanation: "125 × 8 = 1000, kemudian 200 ÷ 4 = 50. Jadi 1000 - 50 = 950.", difficulty: "mudah" },
      { id: "sd-m-2", question: "Sebuah persegi panjang memiliki panjang 15 cm dan lebar 8 cm. Berapakah kelilingnya?", options: ["A. 46 cm", "B. 120 cm", "C. 23 cm", "D. 52 cm"], answer: 0, explanation: "Keliling persegi panjang = 2 × (p + l) = 2 × (15 + 8) = 2 × 23 = 46 cm.", difficulty: "mudah" },
      { id: "sd-m-3", question: "Pecahan manakah yang nilainya paling besar?", options: ["A. 3/4", "B. 2/3", "C. 5/8", "D. 7/10"], answer: 0, explanation: "3/4 = 0.75, 2/3 ≈ 0.667, 5/8 = 0.625, 7/10 = 0.7. Jadi 3/4 yang terbesar.", difficulty: "sedang" },
    ],
    "IPA": [
      { id: "sd-s-1", question: "Proses fotosintesis pada tumbuhan menghasilkan...", options: ["A. O₂ dan glukosa", "B. CO₂ dan air", "C. O₂ dan air", "D. CO₂ dan glukosa"], answer: 0, explanation: "Fotosintesis: CO₂ + H₂O + cahaya → O₂ + glukosa (C₆H₁₂O₆).", difficulty: "mudah" },
      { id: "sd-s-2", question: "Planet manakah yang paling dekat dengan Matahari?", options: ["A. Merkurius", "B. Venus", "C. Bumi", "D. Mars"], answer: 0, explanation: "Urutan planet dari Matahari: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus.", difficulty: "mudah" },
    ],
    "Bahasa Indonesia": [
      { id: "sd-b-1", question: "Kalimat yang menggunakan ejaan yang benar adalah...", options: ["A. Di mana kamu tinggal?", "B. Dimana kamu tinggal?", "C. Di-mana kamu tinggal?", "D. d'mana kamu tinggal?"], answer: 0, explanation: "'Di mana' ditulis terpisah karena berfungsi sebagai kata tanya, bukan awalan.", difficulty: "sedang" },
    ],
  },
  SMP: {
    "Matematika": [
      { id: "smp-m-1", question: "Jika f(x) = 2x² - 3x + 1, maka f(3) = ...", options: ["A. 10", "B. 12", "C. 8", "D. 16"], answer: 0, explanation: "f(3) = 2(3²) - 3(3) + 1 = 2(9) - 9 + 1 = 18 - 9 + 1 = 10.", difficulty: "sedang" },
      { id: "smp-m-2", question: "Gradien garis yang melalui titik (2, 3) dan (5, 9) adalah...", options: ["A. 2", "B. 3", "C. 1/2", "D. 4"], answer: 0, explanation: "m = (y₂-y₁)/(x₂-x₁) = (9-3)/(5-2) = 6/3 = 2.", difficulty: "sedang" },
      { id: "smp-m-3", question: "Nilai x yang memenuhi persamaan 3x - 7 = 2x + 5 adalah...", options: ["A. 12", "B. 10", "C. 8", "D. 14"], answer: 0, explanation: "3x - 2x = 5 + 7, sehingga x = 12.", difficulty: "mudah" },
    ],
    "IPA": [
      { id: "smp-s-1", question: "Hukum Newton II menyatakan bahwa gaya berbanding lurus dengan...", options: ["A. Percepatan", "B. Kecepatan", "C. Massa", "D. Jarak"], answer: 0, explanation: "F = m × a. Jadi gaya sebanding dengan percepatan (dan juga massa).", difficulty: "mudah" },
      { id: "smp-s-2", question: "Sel tumbuhan memiliki organel yang tidak dimiliki sel hewan, yaitu...", options: ["A. Dinding sel & kloroplas", "B. Mitokondria", "C. Ribosom", "D. Nukleus"], answer: 0, explanation: "Sel tumbuhan memiliki dinding sel dan kloroplas yang tidak dimiliki sel hewan.", difficulty: "sedang" },
    ],
    "IPS": [
      { id: "smp-i-1", question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...", options: ["A. 17 Agustus 1945", "B. 20 Mei 1908", "C. 28 Oktober 1928", "D. 1 Juni 1945"], answer: 0, explanation: "Proklamasi kemerdekaan RI dibacakan oleh Soekarno-Hatta pada 17 Agustus 1945.", difficulty: "mudah" },
    ],
  },
  SMA: {
    "Matematika": [
      { id: "sma-m-1", question: "Nilai dari lim(x→2) (x² - 4)/(x - 2) adalah...", options: ["A. 4", "B. 2", "C. 0", "D. ∞"], answer: 0, explanation: "(x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. Saat x→2, nilai = 2+2 = 4.", difficulty: "sedang" },
      { id: "sma-m-2", question: "Turunan dari f(x) = x³ - 3x² + 2x adalah...", options: ["A. 3x² - 6x + 2", "B. 3x² - 3x + 2", "C. x² - 6x + 2", "D. 3x³ - 6x + 2"], answer: 0, explanation: "f'(x) = 3x² - 6x + 2 (menggunakan aturan pangkat).", difficulty: "sedang" },
      { id: "sma-m-3", question: "Integral dari ∫(2x + 3)dx adalah...", options: ["A. x² + 3x + C", "B. 2x² + 3x + C", "C. x² + 3 + C", "D. 2 + C"], answer: 0, explanation: "∫(2x + 3)dx = x² + 3x + C.", difficulty: "sedang" },
    ],
    "Fisika": [
      { id: "sma-f-1", question: "Kecepatan cahaya dalam ruang hampa adalah...", options: ["A. 3 × 10⁸ m/s", "B. 3 × 10⁶ m/s", "C. 3 × 10¹⁰ m/s", "D. 3 × 10⁴ m/s"], answer: 0, explanation: "Kecepatan cahaya c = 3 × 10⁸ m/s (atau lebih tepat 2.998 × 10⁸ m/s).", difficulty: "mudah" },
    ],
    "Kimia": [
      { id: "sma-k-1", question: "Konfigurasi elektron atom Kalsium (Z=20) adalah...", options: ["A. 2,8,8,2", "B. 2,8,10", "C. 2,8,6,4", "D. 2,10,8"], answer: 0, explanation: "Ca (Z=20): kulit K=2, L=8, M=8, N=2 → konfigurasi 2,8,8,2.", difficulty: "sedang" },
      { id: "sma-k-2", question: "pH larutan HCl 0,01 M adalah...", options: ["A. 2", "B. 12", "C. 1", "D. 7"], answer: 0, explanation: "HCl asam kuat, [H⁺] = 0,01 M = 10⁻² M. pH = -log[H⁺] = -log(10⁻²) = 2.", difficulty: "sedang" },
    ],
    "Biologi": [
      { id: "sma-bio-1", question: "Organel sel yang berfungsi sebagai pusat pengatur aktivitas sel adalah...", options: ["A. Nukleus", "B. Mitokondria", "C. Ribosom", "D. Vakuola"], answer: 0, explanation: "Nukleus (inti sel) mengandung DNA dan mengatur seluruh aktivitas sel.", difficulty: "mudah" },
    ],
  }
};

const DEVELOPER_KEY = "DEV_TKA_2024_ADMIN";

const BADGES = [
  { id: "first_blood", name: "FIRST BLOOD", icon: "⚔️", desc: "Jawab soal pertama", condition: (stats) => stats.totalAnswered >= 1 },
  { id: "streak_3", name: "ON FIRE", icon: "🔥", desc: "3x streak benar", condition: (stats) => stats.maxStreak >= 3 },
  { id: "streak_7", name: "UNSTOPPABLE", icon: "⚡", desc: "7x streak benar", condition: (stats) => stats.maxStreak >= 7 },
  { id: "level_5", name: "RISING STAR", icon: "⭐", desc: "Capai level 5", condition: (stats) => stats.level >= 5 },
  { id: "perfect_10", name: "PERFECT RUN", icon: "💎", desc: "10 jawaban benar berturut", condition: (stats) => stats.maxStreak >= 10 },
  { id: "scholar", name: "SCHOLAR", icon: "📚", desc: "Jawab 50 soal", condition: (stats) => stats.totalAnswered >= 50 },
];

const calcLevel = (xp) => Math.floor(xp / 100) + 1;
const calcXPToNext = (xp) => 100 - (xp % 100);
const calcXPProgress = (xp) => ((xp % 100) / 100) * 100;

// ============================================================
// COMPONENTS
// ============================================================

const FogLayer = () => (
  <div className="fog-layer">
    <div className="fog-blob" />
    <div className="fog-blob" />
    <div className="fog-blob" />
  </div>
);

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const colors = { success: "var(--cyan)", error: "var(--magenta)", gold: "var(--gold)" };
  return (
    <div className="toast">
      <div className="glass" style={{ padding: "14px 20px", borderColor: colors[type], boxShadow: `0 0 30px ${colors[type]}33`, display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: 20 }}>{type === "success" ? "✓" : type === "gold" ? "★" : "✗"}</span>
        <span className="body-font" style={{ color: colors[type], fontWeight: 600 }}>{message}</span>
      </div>
    </div>
  );
};

const LevelUpOverlay = ({ newLevel, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="levelup-overlay" onClick={onClose}>
      <div className="glass fade-in" style={{ padding: "48px", textAlign: "center", borderColor: "var(--gold)", boxShadow: "var(--shadow-glow-gold)", minWidth: 320 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
        <div className="pixel" style={{ fontSize: 10, color: "var(--gold)", marginBottom: 8, letterSpacing: 2 }}>LEVEL UP!</div>
        <div className="vt" style={{ fontSize: 64, color: "var(--gold)", lineHeight: 1 }}>{newLevel}</div>
        <div className="body-font" style={{ color: "var(--muted)", marginTop: 8, fontSize: 14 }}>Kamu makin jago! Terus semangat 💪</div>
      </div>
    </div>
  );
};

// ============================================================
// AUTH SCREEN
// ============================================================
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [devKey, setDevKey] = useState("");
  const [showDev, setShowDev] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // MOCK auth — replace with real Firebase
  const handleSubmit = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);

    if (!email || !password) { setError("Email & password wajib diisi!"); return; }
    if (mode === "register" && !name) { setError("Nama wajib diisi!"); return; }

    // Check developer key
    const isDev = devKey === DEVELOPER_KEY;

    const userData = {
      email,
      name: mode === "register" ? name : email.split("@")[0],
      isDev,
      xp: 0,
      level: 1,
      streak: 0,
      maxStreak: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      badges: [],
      history: [],
      createdAt: new Date().toISOString(),
    };
    onLogin(userData);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 1 }}>
      <div className="glass fade-in" style={{ width: "100%", maxWidth: 420, padding: "48px 40px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="pixel" style={{ fontSize: 18, color: "var(--cyan)", letterSpacing: 2, lineHeight: 1.6 }}>
            TKA<span style={{ color: "var(--magenta)" }}>.</span>GG
          </div>
          <div className="vt" style={{ fontSize: 22, color: "var(--muted)", marginTop: 4 }}>LATIHAN UJIAN NASIONAL</div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, var(--cyan), var(--magenta))", margin: "12px auto 0" }} />
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 2, marginBottom: 28, background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: 3 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "10px", background: mode === m ? "rgba(0,245,212,0.15)" : "transparent",
              border: mode === m ? "1px solid var(--cyan)" : "1px solid transparent",
              color: mode === m ? "var(--cyan)" : "var(--muted)", cursor: "pointer",
              fontFamily: "var(--pixel)", fontSize: 7, borderRadius: 3, transition: "all 0.2s"
            }}>
              {m === "login" ? "MASUK" : "DAFTAR"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <input className="input-pixel" placeholder="Nama lengkap" value={name} onChange={e => setName(e.target.value)} />
          )}
          <input className="input-pixel" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input-pixel" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <div>
            <button onClick={() => setShowDev(!showDev)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--pixel)", fontSize: 7, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: showDev ? "var(--gold)" : "inherit" }}>◆</span> DEVELOPER MODE
            </button>
            {showDev && (
              <div style={{ marginTop: 8 }}>
                <input className="input-pixel" placeholder="Developer secret key" type="password" value={devKey} onChange={e => setDevKey(e.target.value)} style={{ borderColor: devKey === DEVELOPER_KEY ? "var(--gold)" : undefined }} />
                {devKey === DEVELOPER_KEY && <div style={{ color: "var(--gold)", fontFamily: "var(--pixel)", fontSize: 7, marginTop: 6 }}>✓ DEVELOPER ACCESS GRANTED</div>}
              </div>
            )}
          </div>

          {error && <div style={{ color: "var(--magenta)", fontFamily: "var(--pixel)", fontSize: 7, padding: "10px", background: "rgba(247,37,133,0.1)", border: "1px solid var(--magenta)", borderRadius: 3 }}>{error}</div>}

          <button className="btn-pixel" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
            <span>{loading ? "LOADING..." : mode === "login" ? "MASUK" : "MULAI PETUALANGAN"}</span>
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, color: "var(--muted)", fontFamily: "var(--pixel)", fontSize: 7, lineHeight: 2 }}>
          ⚠ CONNECT FIREBASE<br/>
          <span style={{ color: "var(--glass-border)", fontSize: 6 }}>ganti mock auth dengan Firebase SDK</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DEVELOPER PANEL
// ============================================================
const DevPanel = ({ onClose }) => {
  const [selectedJenjang, setSelectedJenjang] = useState("SD");
  const [selectedMapel, setSelectedMapel] = useState("Matematika");
  const [questions, setQuestions] = useState(() => JSON.parse(JSON.stringify(QUESTIONS_DB)));
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [newQ, setNewQ] = useState({ question: "", options: ["A. ", "B. ", "C. ", "D. "], answer: 0, explanation: "", difficulty: "sedang" });

  const mapels = Object.keys(questions[selectedJenjang] || {});
  const currentQs = questions[selectedJenjang]?.[selectedMapel] || [];

  const handleSave = (idx, updated) => {
    const copy = JSON.parse(JSON.stringify(questions));
    copy[selectedJenjang][selectedMapel][idx] = updated;
    setQuestions(copy);
    Object.assign(QUESTIONS_DB[selectedJenjang][selectedMapel][idx], updated);
    setEditing(null);
    setToast({ message: "Soal berhasil diperbarui!", type: "success" });
  };

  const handleDelete = (idx) => {
    const copy = JSON.parse(JSON.stringify(questions));
    copy[selectedJenjang][selectedMapel].splice(idx, 1);
    setQuestions(copy);
    QUESTIONS_DB[selectedJenjang][selectedMapel].splice(idx, 1);
    setToast({ message: "Soal dihapus.", type: "error" });
  };

  const handleAdd = () => {
    const id = `${selectedJenjang.toLowerCase()}-custom-${Date.now()}`;
    const q = { ...newQ, id };
    const copy = JSON.parse(JSON.stringify(questions));
    copy[selectedJenjang][selectedMapel].push(q);
    setQuestions(copy);
    QUESTIONS_DB[selectedJenjang][selectedMapel].push(q);
    setNewQ({ question: "", options: ["A. ", "B. ", "C. ", "D. "], answer: 0, explanation: "", difficulty: "sedang" });
    setToast({ message: "Soal baru ditambahkan!", type: "gold" });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1 }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <div className="pixel" style={{ fontSize: 12, color: "var(--gold)" }}>◆ DEVELOPER PANEL</div>
            <div className="body-font" style={{ color: "var(--muted)", marginTop: 4 }}>Kelola bank soal TKA</div>
          </div>
          <button className="btn-pixel magenta" onClick={onClose}><span>✕ TUTUP</span></button>
        </div>

        {/* Jenjang selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["SD", "SMP", "SMA"].map(j => (
            <button key={j} className="btn-pixel" onClick={() => { setSelectedJenjang(j); setSelectedMapel(Object.keys(questions[j])[0]); }}
              style={{ borderColor: selectedJenjang === j ? "var(--gold)" : undefined, color: selectedJenjang === j ? "var(--gold)" : undefined }}>
              <span>{j}</span>
            </button>
          ))}
        </div>

        {/* Mapel selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {mapels.map(m => (
            <button key={m} onClick={() => setSelectedMapel(m)} className="body-font" style={{
              padding: "8px 16px", background: selectedMapel === m ? "rgba(0,245,212,0.12)" : "var(--glass)",
              border: `1px solid ${selectedMapel === m ? "var(--cyan)" : "var(--glass-border)"}`,
              color: selectedMapel === m ? "var(--cyan)" : "var(--white)", cursor: "pointer", borderRadius: 3, fontSize: 14, fontWeight: 600
            }}>
              {m}
            </button>
          ))}
        </div>

        {/* Question list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {currentQs.map((q, idx) => (
            <div key={q.id} className="glass" style={{ padding: "20px" }}>
              {editing === idx ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <textarea className="input-pixel" rows={3} value={q.question}
                    onChange={e => { const copy = JSON.parse(JSON.stringify(questions)); copy[selectedJenjang][selectedMapel][idx].question = e.target.value; setQuestions(copy); }}
                    style={{ resize: "vertical" }} />
                  {q.options.map((opt, oi) => (
                    <div key={oi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input type="radio" checked={q.answer === oi} onChange={() => { const copy = JSON.parse(JSON.stringify(questions)); copy[selectedJenjang][selectedMapel][idx].answer = oi; setQuestions(copy); }} />
                      <input className="input-pixel" value={opt}
                        onChange={e => { const copy = JSON.parse(JSON.stringify(questions)); copy[selectedJenjang][selectedMapel][idx].options[oi] = e.target.value; setQuestions(copy); }} />
                    </div>
                  ))}
                  <textarea className="input-pixel" rows={2} placeholder="Penjelasan jawaban..." value={q.explanation}
                    onChange={e => { const copy = JSON.parse(JSON.stringify(questions)); copy[selectedJenjang][selectedMapel][idx].explanation = e.target.value; setQuestions(copy); }}
                    style={{ resize: "vertical" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-pixel" onClick={() => handleSave(idx, questions[selectedJenjang][selectedMapel][idx])}><span>SIMPAN</span></button>
                    <button className="btn-pixel magenta" onClick={() => setEditing(null)}><span>BATAL</span></button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <span className="badge" style={{ borderColor: "var(--glass-border)", color: "var(--muted)", marginBottom: 8, display: "inline-flex" }}>{q.difficulty}</span>
                      <div className="body-font" style={{ fontWeight: 600, lineHeight: 1.5 }}>({idx + 1}) {q.question}</div>
                      <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ color: oi === q.answer ? "var(--cyan)" : "var(--muted)", fontFamily: "var(--body)", fontSize: 13 }}>{oi === q.answer ? "✓ " : "  "}{opt}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button className="btn-pixel" onClick={() => setEditing(idx)} style={{ padding: "8px 12px", fontSize: 7 }}><span>EDIT</span></button>
                      <button className="btn-pixel magenta" onClick={() => handleDelete(idx)} style={{ padding: "8px 12px", fontSize: 7 }}><span>DEL</span></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new question */}
        <div className="glass" style={{ padding: "24px", borderColor: "var(--gold)" }}>
          <div className="pixel" style={{ fontSize: 8, color: "var(--gold)", marginBottom: 16 }}>+ TAMBAH SOAL BARU</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <textarea className="input-pixel" rows={3} placeholder="Pertanyaan..." value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} style={{ resize: "vertical" }} />
            {newQ.options.map((opt, oi) => (
              <div key={oi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="radio" checked={newQ.answer === oi} onChange={() => setNewQ({ ...newQ, answer: oi })} />
                <input className="input-pixel" value={opt} placeholder={`Opsi ${["A","B","C","D"][oi]}`}
                  onChange={e => { const opts = [...newQ.options]; opts[oi] = e.target.value; setNewQ({ ...newQ, options: opts }); }} />
              </div>
            ))}
            <textarea className="input-pixel" rows={2} placeholder="Penjelasan jawaban..." value={newQ.explanation} onChange={e => setNewQ({ ...newQ, explanation: e.target.value })} style={{ resize: "vertical" }} />
            <select className="input-pixel" value={newQ.difficulty} onChange={e => setNewQ({ ...newQ, difficulty: e.target.value })} style={{ background: "rgba(255,255,255,0.04)" }}>
              <option value="mudah">Mudah</option>
              <option value="sedang">Sedang</option>
              <option value="sulit">Sulit</option>
            </select>
            <button className="btn-pixel gold" onClick={handleAdd}><span>+ TAMBAH SOAL</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// QUIZ SCREEN
// ============================================================
const QuizScreen = ({ user, jenjang, mapel, questions, onFinish, onXP }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const total = questions.length;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.answer;
    const newStreak = isCorrect ? correctStreak + 1 : 0;
    const xpGain = isCorrect ? (10 + (newStreak >= 3 ? 5 : 0)) : 0;
    setCorrectStreak(newStreak);
    if (isCorrect) setScore(s => s + 1);
    setResults(r => [...r, { q, selected: idx, correct: isCorrect }]);
    if (xpGain > 0) onXP(xpGain, newStreak);
  };

  const handleNext = () => {
    if (current + 1 >= total) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const grade = pct >= 80 ? "S" : pct >= 60 ? "A" : pct >= 40 ? "B" : "C";
    const gradeColor = { S: "var(--gold)", A: "var(--cyan)", B: "var(--purple)", C: "var(--magenta)" }[grade];
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 1 }}>
        <div className="glass fade-in" style={{ maxWidth: 480, width: "100%", padding: "48px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
          <div className="pixel" style={{ fontSize: 8, color: "var(--muted)", marginBottom: 8 }}>HASIL QUIZ</div>
          <div className="vt" style={{ fontSize: 80, color: gradeColor, lineHeight: 1 }}>{grade}</div>
          <div className="body-font" style={{ fontSize: 18, color: "var(--white)", marginTop: 4 }}>{score} / {total} benar</div>
          <div style={{ width: "100%", margin: "24px 0" }}>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${gradeColor}, ${gradeColor}aa)` }} />
            </div>
            <div className="body-font" style={{ color: "var(--muted)", marginTop: 6, fontSize: 13 }}>{pct}% akurasi</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 28 }}>
            {results.map((r, i) => (
              <div key={i} style={{ padding: "10px 14px", background: r.correct ? "rgba(0,245,212,0.06)" : "rgba(247,37,133,0.06)", border: `1px solid ${r.correct ? "rgba(0,245,212,0.2)" : "rgba(247,37,133,0.2)"}`, borderRadius: 3 }}>
                <div className="body-font" style={{ fontSize: 13, color: "var(--white)", marginBottom: 4 }}>{i + 1}. {r.q.question.slice(0, 60)}...</div>
                {!r.correct && <div className="body-font" style={{ fontSize: 12, color: "var(--cyan)" }}>✓ {r.q.options[r.q.answer]}</div>}
                {!r.correct && <div className="body-font" style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{r.q.explanation}</div>}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn-pixel" onClick={() => onFinish("retry")}><span>MAIN LAGI</span></button>
            <button className="btn-pixel magenta" onClick={() => onFinish("home")}><span>HOME</span></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div className="pixel" style={{ fontSize: 8, color: "var(--cyan)" }}>{jenjang} · {mapel}</div>
            <div className="body-font" style={{ color: "var(--muted)", marginTop: 4 }}>Soal {current + 1} dari {total}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="pixel" style={{ fontSize: 8, color: "var(--gold)" }}>STREAK</div>
            <div className="vt" style={{ fontSize: 32, color: correctStreak > 0 ? "var(--gold)" : "var(--muted)" }}>
              {correctStreak > 0 && <span className="flame">🔥</span>} {correctStreak}x
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="xp-bar-track" style={{ marginBottom: 28 }}>
          <div className="xp-bar-fill" style={{ width: `${((current) / total) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="glass fade-in" style={{ padding: "32px", marginBottom: 20 }}>
          <div className="body-font" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6, color: "var(--white)" }}>{q.question}</div>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {q.options.map((opt, idx) => (
            <button key={idx} className={`option-btn ${answered ? (idx === q.answer ? "correct" : idx === selected ? "wrong" : "disabled") : ""}`}
              onClick={() => handleSelect(idx)}>
              <span className="pixel" style={{ fontSize: 8, opacity: 0.6 }}>{["A","B","C","D"][idx]}</span>
              <span>{opt.slice(3)}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="glass fade-in" style={{ padding: "20px", marginBottom: 20, borderColor: selected === q.answer ? "rgba(0,245,212,0.3)" : "rgba(247,37,133,0.3)" }}>
            <div className="pixel" style={{ fontSize: 7, color: selected === q.answer ? "var(--cyan)" : "var(--magenta)", marginBottom: 8 }}>
              {selected === q.answer ? "✓ BENAR!" : "✗ SALAH"}
            </div>
            <div className="body-font" style={{ color: "var(--white)", lineHeight: 1.6 }}>{q.explanation}</div>
          </div>
        )}

        {answered && (
          <button className="btn-pixel" onClick={handleNext} style={{ width: "100%" }}>
            <span>{current + 1 >= total ? "LIHAT HASIL" : "SOAL BERIKUTNYA →"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home"); // home | quiz | dev | profile | leaderboard
  const [selectedJenjang, setSelectedJenjang] = useState(null);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [toast, setToast] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [userData, setUserData] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleLogin = (u) => {
    setUser(u);
    setUserData(u);
    setScreen("home");
    showToast(`Selamat datang, ${u.name}!`, "success");
  };

  const handleXP = (amount, streak) => {
    setUserData(prev => {
      const newXP = prev.xp + amount;
      const oldLevel = calcLevel(prev.xp);
      const newLevel = calcLevel(newXP);
      const newStreak = streak;
      const newMaxStreak = Math.max(prev.maxStreak, streak);
      const newTotalAnswered = prev.totalAnswered + 1;
      const newTotalCorrect = prev.totalCorrect + (amount > 0 ? 1 : 0);

      // Check badges
      const newStats = { level: newLevel, maxStreak: newMaxStreak, totalAnswered: newTotalAnswered };
      const earnedBadges = BADGES.filter(b => !prev.badges.includes(b.id) && b.condition(newStats)).map(b => b.id);

      if (earnedBadges.length > 0) {
        const badge = BADGES.find(b => b.id === earnedBadges[0]);
        showToast(`${badge.icon} Badge baru: ${badge.name}!`, "gold");
      }

      if (newLevel > oldLevel) setLevelUp(newLevel);

      if (streak >= 3) showToast(`🔥 ${streak}x streak! +5 bonus XP!`, "gold");

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        maxStreak: newMaxStreak,
        totalAnswered: newTotalAnswered,
        totalCorrect: newTotalCorrect,
        badges: [...prev.badges, ...earnedBadges],
      };
    });
  };

  const startQuiz = (jenjang, mapel) => {
    setSelectedJenjang(jenjang);
    setSelectedMapel(mapel);
    setScreen("quiz");
  };

  const handleLogout = () => { setUser(null); setUserData(null); setScreen("home"); };

  if (!user) return <><GlobalStyle /><FogLayer /><AuthScreen onLogin={handleLogin} /></>;

  const JENJANG_CONFIG = {
    SD: { color: "var(--cyan)", icon: "🎒", mapels: Object.keys(QUESTIONS_DB.SD) },
    SMP: { color: "var(--purple)", icon: "📚", mapels: Object.keys(QUESTIONS_DB.SMP) },
    SMA: { color: "var(--magenta)", icon: "🎓", mapels: Object.keys(QUESTIONS_DB.SMA) },
  };

  const accuracy = userData.totalAnswered > 0 ? Math.round((userData.totalCorrect / userData.totalAnswered) * 100) : 0;
  const earnedBadges = BADGES.filter(b => userData.badges.includes(b.id));

  const NavBar = () => (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
      <div className="glass" style={{ display: "flex", gap: 4, padding: "8px 12px", borderRadius: 8 }}>
        {[
          { id: "home", icon: "⌂", label: "HOME" },
          { id: "profile", icon: "◈", label: "PROFIL" },
          { id: "leaderboard", icon: "⊛", label: "RANK" },
          ...(userData.isDev ? [{ id: "dev", icon: "◆", label: "DEV", gold: true }] : []),
        ].map(nav => (
          <button key={nav.id} onClick={() => setScreen(nav.id)} style={{
            padding: "10px 16px", background: screen === nav.id ? "rgba(255,255,255,0.1)" : "transparent",
            border: `1px solid ${screen === nav.id ? "var(--cyan)" : "transparent"}`,
            color: nav.gold ? "var(--gold)" : screen === nav.id ? "var(--cyan)" : "var(--muted)",
            cursor: "pointer", borderRadius: 4, fontFamily: "var(--pixel)", fontSize: 7, display: "flex", flexDirection: "column", alignItems: "center", gap: 4
          }}>
            <span style={{ fontSize: 14 }}>{nav.icon}</span>
            <span>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <GlobalStyle />
      <FogLayer />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {levelUp && <LevelUpOverlay newLevel={levelUp} onClose={() => setLevelUp(null)} />}

      {screen === "quiz" && selectedJenjang && selectedMapel ? (
        <QuizScreen
          user={userData}
          jenjang={selectedJenjang}
          mapel={selectedMapel}
          questions={QUESTIONS_DB[selectedJenjang][selectedMapel]}
          onXP={handleXP}
          onFinish={(action) => {
            if (action === "home") setScreen("home");
            else { setScreen("quiz"); } // retry reloads
          }}
        />
      ) : screen === "dev" && userData.isDev ? (
        <DevPanel onClose={() => setScreen("home")} />
      ) : screen === "profile" ? (
        <div style={{ minHeight: "100vh", padding: "24px 24px 120px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <div className="pixel" style={{ fontSize: 12, color: "var(--cyan)" }}>PROFIL</div>
            </div>
            {/* User card */}
            <div className="glass" style={{ padding: "32px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, border: "2px solid var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, background: "rgba(0,245,212,0.08)", fontSize: 28 }}>
                  {userData.isDev ? "◆" : "◈"}
                </div>
                <div>
                  <div className="pixel" style={{ fontSize: 10, color: "var(--white)" }}>{userData.name}</div>
                  <div className="body-font" style={{ color: "var(--muted)", marginTop: 4 }}>{userData.email}</div>
                  {userData.isDev && <span className="badge" style={{ borderColor: "var(--gold)", color: "var(--gold)", marginTop: 6, display: "inline-flex" }}>◆ DEVELOPER</span>}
                </div>
              </div>
              {/* Level & XP */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div className="glass" style={{ flex: 1, padding: "16px", textAlign: "center" }}>
                  <div className="pixel" style={{ fontSize: 7, color: "var(--muted)", marginBottom: 4 }}>LEVEL</div>
                  <div className="vt" style={{ fontSize: 48, color: "var(--cyan)", lineHeight: 1 }}>{userData.level}</div>
                </div>
                <div className="glass" style={{ flex: 1, padding: "16px", textAlign: "center" }}>
                  <div className="pixel" style={{ fontSize: 7, color: "var(--muted)", marginBottom: 4 }}>TOTAL XP</div>
                  <div className="vt" style={{ fontSize: 48, color: "var(--gold)", lineHeight: 1 }}>{userData.xp}</div>
                </div>
                <div className="glass" style={{ flex: 1, padding: "16px", textAlign: "center" }}>
                  <div className="pixel" style={{ fontSize: 7, color: "var(--muted)", marginBottom: 4 }}>AKURASI</div>
                  <div className="vt" style={{ fontSize: 48, color: "var(--magenta)", lineHeight: 1 }}>{accuracy}%</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="pixel" style={{ fontSize: 7, color: "var(--muted)" }}>XP KE LEVEL {userData.level + 1}</span>
                  <span className="pixel" style={{ fontSize: 7, color: "var(--cyan)" }}>{calcXPToNext(userData.xp)} XP LAGI</span>
                </div>
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${calcXPProgress(userData.xp)}%` }} />
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="glass" style={{ padding: "24px", marginBottom: 16 }}>
              <div className="pixel" style={{ fontSize: 8, color: "var(--muted)", marginBottom: 16 }}>STATISTIK</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Soal Dijawab", value: userData.totalAnswered, color: "var(--white)" },
                  { label: "Jawaban Benar", value: userData.totalCorrect, color: "var(--cyan)" },
                  { label: "Max Streak", value: `${userData.maxStreak}x 🔥`, color: "var(--gold)" },
                  { label: "Badge Earned", value: earnedBadges.length, color: "var(--purple)" },
                ].map((s, i) => (
                  <div key={i} className="glass" style={{ padding: "16px" }}>
                    <div className="body-font" style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>{s.label}</div>
                    <div className="vt" style={{ fontSize: 32, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Badges */}
            <div className="glass" style={{ padding: "24px", marginBottom: 16 }}>
              <div className="pixel" style={{ fontSize: 8, color: "var(--muted)", marginBottom: 16 }}>BADGES</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {BADGES.map(badge => {
                  const earned = userData.badges.includes(badge.id);
                  return (
                    <div key={badge.id} className="glass" style={{ padding: "16px", textAlign: "center", opacity: earned ? 1 : 0.3, borderColor: earned ? "var(--gold)" : undefined, transition: "all 0.3s" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.icon}</div>
                      <div className="pixel" style={{ fontSize: 6, color: earned ? "var(--gold)" : "var(--muted)" }}>{badge.name}</div>
                      <div className="body-font" style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>{badge.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="btn-pixel magenta" onClick={handleLogout} style={{ width: "100%" }}><span>LOGOUT</span></button>
          </div>
        </div>
      ) : screen === "leaderboard" ? (
        <div style={{ minHeight: "100vh", padding: "24px 24px 120px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div className="pixel" style={{ fontSize: 12, color: "var(--gold)", marginBottom: 32 }}>⊛ LEADERBOARD</div>
            <div className="glass" style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <div className="pixel" style={{ fontSize: 8, color: "var(--muted)" }}>COMING SOON</div>
              <div className="body-font" style={{ color: "var(--muted)", marginTop: 12, lineHeight: 1.8 }}>
                Leaderboard akan aktif setelah<br />Firebase terhubung & ada lebih banyak player!
              </div>
              <div style={{ marginTop: 24, padding: "20px", background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                <div className="pixel" style={{ fontSize: 7, color: "var(--cyan)", marginBottom: 8 }}>SKOR KAMU SAAT INI</div>
                <div className="vt" style={{ fontSize: 52, color: "var(--gold)" }}>{userData.xp} XP</div>
                <div className="body-font" style={{ color: "var(--muted)", marginTop: 4 }}>Level {userData.level} · {accuracy}% akurasi</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // HOME SCREEN
        <div style={{ minHeight: "100vh", padding: "24px 24px 120px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div>
                <div className="pixel" style={{ fontSize: 14, color: "var(--cyan)", letterSpacing: 2 }}>
                  TKA<span style={{ color: "var(--magenta)" }}>.</span>GG
                </div>
                <div className="body-font" style={{ color: "var(--muted)", marginTop: 2 }}>Halo, {userData.name}! <span className="blink" style={{ color: "var(--cyan)" }}>_</span></div>
              </div>
              {/* Mini XP display */}
              <div className="glass" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <div className="pixel" style={{ fontSize: 6, color: "var(--muted)" }}>LVL</div>
                  <div className="vt" style={{ fontSize: 28, color: "var(--cyan)", lineHeight: 1 }}>{userData.level}</div>
                </div>
                <div style={{ width: 80 }}>
                  <div className="xp-bar-track">
                    <div className="xp-bar-fill" style={{ width: `${calcXPProgress(userData.xp)}%` }} />
                  </div>
                  <div className="pixel" style={{ fontSize: 6, color: "var(--muted)", marginTop: 4 }}>{userData.xp} XP</div>
                </div>
                {userData.streak > 0 && (
                  <div className="vt" style={{ fontSize: 22, color: "var(--gold)" }}>
                    <span className="flame">🔥</span>{userData.streak}
                  </div>
                )}
              </div>
            </div>

            {/* Jenjang selector */}
            <div style={{ marginBottom: 28 }}>
              <div className="pixel" style={{ fontSize: 8, color: "var(--muted)", marginBottom: 14, letterSpacing: 2 }}>PILIH JENJANG</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {Object.entries(JENJANG_CONFIG).map(([j, cfg]) => (
                  <button key={j} onClick={() => setSelectedJenjang(selectedJenjang === j ? null : j)} style={{
                    padding: "24px 16px", background: selectedJenjang === j ? `rgba(${j === "SD" ? "0,245,212" : j === "SMP" ? "123,47,255" : "247,37,133"},0.12)` : "var(--glass)",
                    border: `2px solid ${selectedJenjang === j ? cfg.color : "var(--glass-border)"}`,
                    color: selectedJenjang === j ? cfg.color : "var(--white)", cursor: "pointer", borderRadius: 4,
                    fontFamily: "var(--pixel)", fontSize: 10, textAlign: "center",
                    boxShadow: selectedJenjang === j ? `0 0 30px ${cfg.color}33` : "none",
                    transition: "all 0.25s", backdropFilter: "blur(18px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8
                  }}>
                    <span style={{ fontSize: 28 }}>{cfg.icon}</span>
                    {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Mapel selector */}
            {selectedJenjang && (
              <div className="fade-in" style={{ marginBottom: 28 }}>
                <div className="pixel" style={{ fontSize: 8, color: "var(--muted)", marginBottom: 14, letterSpacing: 2 }}>PILIH MATA PELAJARAN</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {JENJANG_CONFIG[selectedJenjang].mapels.map(m => {
                    const qCount = QUESTIONS_DB[selectedJenjang][m]?.length || 0;
                    return (
                      <button key={m} onClick={() => startQuiz(selectedJenjang, m)} className="glass" style={{
                        padding: "20px", textAlign: "left", cursor: "pointer", border: "1px solid var(--glass-border)",
                        borderRadius: 4, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between"
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = JENJANG_CONFIG[selectedJenjang].color; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.background = "var(--glass)"; }}>
                        <div>
                          <div className="body-font" style={{ fontWeight: 700, fontSize: 15 }}>{m}</div>
                          <div className="pixel" style={{ fontSize: 7, color: "var(--muted)", marginTop: 4 }}>{qCount} SOAL</div>
                        </div>
                        <span style={{ color: JENJANG_CONFIG[selectedJenjang].color, fontSize: 18 }}>→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="glass" style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
              {[
                { label: "Soal dijawab", value: userData.totalAnswered, icon: "📝" },
                { label: "Akurasi", value: `${accuracy}%`, icon: "🎯" },
                { label: "Badges", value: `${earnedBadges.length}/${BADGES.length}`, icon: "🏅" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "8px" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                  <div className="vt" style={{ fontSize: 28, color: "var(--white)" }}>{s.value}</div>
                  <div className="body-font" style={{ color: "var(--muted)", fontSize: 11 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </>
  );
}
