import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

// Utility: format seconds as M:SS
function formatTime(seconds) {
  if (seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Utility: format timestamp for session list
function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// Custom title bar — matches theme, draggable
function TitleBar({ theme, parallaxIntensity, onParallaxChange, pivotMode, onPivotChange, axisLock, onAxisLockChange }) {
  const t = theme || THEMES.laserburn;
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    appWindow.isMaximized().then(setMaximized);
  }, []);

  const btnStyle = {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontSize: 11,
    width: 36,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  };

  return (
    <div
      data-tauri-drag-region
      style={{
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(0,0,0,0.15)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span
          data-tauri-drag-region
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            paddingLeft: 12,
            letterSpacing: "0.5px",
          }}
        >
          CodeBarrie: To-Do
        </span>

        <span style={{
          color: "rgba(255,255,255,0.2)",
          margin: "0 10px",
          fontSize: 12,
        }}>|</span>

        <span style={{
          fontSize: 9,
          color: "rgba(255,255,255,0.35)",
          fontFamily: "'JetBrains Mono', monospace",
          marginRight: 6,
        }}>3D</span>
        <input
          type="range"
          min="0"
          max="1200"
          value={parallaxIntensity}
          onChange={(e) => onParallaxChange(Number(e.target.value))}
          style={{
            width: 70,
            height: 3,
            appearance: "none",
            WebkitAppearance: "none",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 2,
            outline: "none",
            cursor: "pointer",
          }}
        />

        <span style={{
          color: "rgba(255,255,255,0.2)",
          margin: "0 8px",
          fontSize: 12,
        }}>|</span>

        <div
          onClick={() => onPivotChange(pivotMode === "center" ? "left" : "center")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.06)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <span style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>Pivot</span>
          <span style={{
            fontSize: 8,
            color: pivotMode === "left" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            padding: "1px 4px",
            borderRadius: 2,
            background: pivotMode === "left" ? "rgba(255,255,255,0.15)" : "transparent",
            transition: "all 0.15s",
          }}>L</span>
          <span style={{
            fontSize: 8,
            color: pivotMode === "center" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            padding: "1px 4px",
            borderRadius: 2,
            background: pivotMode === "center" ? "rgba(255,255,255,0.15)" : "transparent",
            transition: "all 0.15s",
          }}>C</span>
        </div>

        <span style={{
          color: "rgba(255,255,255,0.2)",
          margin: "0 8px",
          fontSize: 12,
        }}>|</span>

        <div
          onClick={() => onAxisLockChange(!axisLock)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: 4,
            background: axisLock ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = axisLock ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = axisLock ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)")}
        >
          <span style={{
            fontSize: 9,
            color: axisLock ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: axisLock ? 700 : 400,
            transition: "all 0.15s",
          }}>Y-Lock</span>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <button
          style={btnStyle}
          onClick={() => appWindow.minimize()}
          onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.target.style.background = "none")}
        >
          ─
        </button>
        <button
          style={btnStyle}
          onClick={async () => {
            await appWindow.toggleMaximize();
            setMaximized(await appWindow.isMaximized());
          }}
          onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.target.style.background = "none")}
        >
          {maximized ? "❐" : "□"}
        </button>
        <button
          style={{ ...btnStyle, borderRadius: "0 0 0 0" }}
          onClick={() => appWindow.close()}
          onMouseEnter={(e) => (e.target.style.background = "#e81123")}
          onMouseLeave={(e) => (e.target.style.background = "none")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const THEMES = {
  laserburn: {
    name: "Laserburn",
    bg: "linear-gradient(160deg, #E87A10 0%, #D46D0C 25%, #C46008 50%, #B55606 75%, #A04C05 100%)",
    text: "#ffffff",
    textDim: "#ffffff",
    textMuted: "rgba(255,255,255,0.65)",
    accent: "#fff",
    accentAlt: "#FFD9B3",
    accentGlow: "rgba(255,255,255,0.25)",
    headerGradient: "linear-gradient(135deg, #2d1200 0%, #1a0800 50%, #2d1200 100%)",
    headerBarBg: "linear-gradient(135deg, #ffffff 0%, #FFE4C8 50%, #ffffff 100%)",
    subtitleColor: "rgba(255,255,255,0.6)",
    cardBg: "rgba(0,0,0,0.12)",
    cardBorder: "rgba(0,0,0,0.15)",
    cardHoverBorder: "rgba(255,255,255,0.4)",
    sectionDoneBg: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.12) 100%)",
    sectionDoneBorder: "rgba(255,255,255,0.35)",
    sectionTitle: "#ffffff",
    sectionTitleDone: "#FFE4C8",
    taskBg: "rgba(0,0,0,0.08)",
    taskDoneBg: "rgba(0,0,0,0.16)",
    taskDoneBorder: "#ffffff",
    taskBorder: "rgba(0,0,0,0.12)",
    checkBorder: "rgba(255,255,255,0.45)",
    checkDone: "#fff",
    checkText: "#1a0800",
    progressBg: "rgba(0,0,0,0.22)",
    progressFill: "linear-gradient(90deg, #ffffff, #ffffff)",
    progressFillMid: "linear-gradient(90deg, #ffffff, #ffffff)",
    progressFillDone: "linear-gradient(90deg, #ffffff, #FFE4C8)",
    deleteDim: "rgba(0,0,0,0.25)",
    deleteHover: "#3d0000",
    inputBorder: "rgba(0,0,0,0.15)",
    inputFocusBorder: "rgba(255,255,255,0.45)",
    importBorder: "rgba(0,0,0,0.2)",
    importColor: "rgba(255,255,255,0.7)",
    importHoverBg: "rgba(0,0,0,0.1)",
    footerColor: "rgba(255,255,255,0.3)",
    toastBg: "linear-gradient(135deg, #1a0800 0%, #2d1200 100%)",
    toastColor: "#FFD0A0",
    timerBarColor: "rgba(255,255,255,0.18)",
    timerBarDepleted: "rgba(0,0,0,0.06)",
  },
};

const CELEBRATION_MESSAGES = [
  "Done and dusted. Next! ✅",
  "Knocked that one out. 💪",
  "One less thing. Keep going.",
  "Check. Moving on.",
  "That felt good, right?",
  "Crushed it.",
  "Progress is progress. 🟢",
  "Another one down.",
  "You're on a roll.",
  "Momentum is everything.",
  "Clean execution. Next!",
  "Tick. ✓",
  "The list gets shorter.",
  "Smooth. What's next?",
  "That one's behind you now.",
];

const SECTION_COMPLETE_MESSAGES = [
  "🎉 SECTION COMPLETE! Full sweep!",
  "🔥 ENTIRE SECTION CLEARED! You're cooking!",
  "⚡ SECTION DONE! Momentum is real!",
  "💥 BOOM! Full section takedown!",
  "🏁 SECTION WRAPPED! On to the next!",
];

const ALL_COMPLETE_MESSAGES = [
  "🏆 ALL TASKS COMPLETE! Go celebrate!",
  "🎊 EVERYTHING IS DONE! Touch grass!",
  "👑 ABSOLUTE LEGEND. Every. Single. Task.",
  "🚀 MISSION COMPLETE. You're free.",
];

const TIMER_COMPLETE_MESSAGES = [
  "⏰ Time's up!",
  "⏱️ Timer complete!",
  "🔔 Ding! That's time.",
  "⏰ Clock's done — you?",
];

// ── Sound system (Web Audio API) ──
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

// Play a single tone with envelope
function playNote(freq, duration = 0.18, volume = 0.18, delay = 0) {
  const ctx = getAudioCtx();
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.015);
  gain.gain.setValueAtTime(volume, t + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// C major pentatonic (C D E G A) — every note harmonizes with every other
// Spanning C3 to A5, 16 notes total. Always sounds musical regardless of task count.
const PENTA_FREQS = [
  130.81, 146.83, 164.81, 196.00, 220.00, // C3 D3 E3 G3 A3
  261.63, 293.66, 329.63, 392.00, 440.00, // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.00, // C5 D5 E5 G5 A5
  1046.50, // C6 (reserved for final task)
];

function playCheckNote(doneCount, totalCount) {
  if (totalCount <= 0) return;
  // Dynamically pick evenly-spaced notes so any task count sounds like a phrase
  const maxIdx = PENTA_FREQS.length - 2; // cap at A5, save C6 for very last
  const idx = totalCount === 1
    ? maxIdx
    : Math.min(maxIdx, Math.round(((doneCount - 1) / (totalCount - 1)) * maxIdx));
  playNote(PENTA_FREQS[idx], 0.22, 0.2);
}

// Final Fantasy–style victory fanfare
function playFanfare() {
  const ctx = getAudioCtx();
  const vol = 0.16;
  // Iconic pattern: short repeated notes → ascending resolution (octave 5–6)
  const fanfare = [
    // Opening triplet hits
    [932.33, 0.12, 0],      // Bb5
    [932.33, 0.12, 0.14],   // Bb5
    [932.33, 0.12, 0.28],   // Bb5
    [932.33, 0.38, 0.42],   // Bb5 (held)
    // Descent and resolve
    [739.99, 0.38, 0.82],   // Gb5
    [830.61, 0.38, 1.22],   // Ab5
    [932.33, 0.28, 1.62],   // Bb5
    // Final rising phrase
    [830.61, 0.16, 1.92],   // Ab5
    [932.33, 0.55, 2.10],   // Bb5 (held)
    // Harmony layer (major third above, quieter)
    [1174.66, 0.12, 0],     // D6
    [1174.66, 0.12, 0.14],  // D6
    [1174.66, 0.12, 0.28],  // D6
    [1174.66, 0.38, 0.42],  // D6
    [932.33, 0.38, 0.82],   // Bb5
    [1046.50, 0.38, 1.22],  // C6
    [1174.66, 0.28, 1.62],  // D6
    [1046.50, 0.16, 1.92],  // C6
    [1174.66, 0.55, 2.10],  // D6
  ];
  const half = Math.floor(fanfare.length / 2);
  fanfare.forEach(([freq, dur, delay], i) => {
    playNote(freq, dur, i < half ? vol : vol * 0.55, delay);
  });
}

// Confetti particle system
function Confetti({ trigger, intensity = "normal", burstRect = null }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const prevTriggerRef = useRef(0);
  const burstRectRef = useRef(null);

  // Always keep ref in sync so the useEffect reads the latest value
  burstRectRef.current = burstRect;

  const colors = [
    "#FF6B35", "#F7C948", "#4ECDC4", "#45B7D1", "#96CEB4",
    "#FF4757", "#2ED573", "#FFA502", "#3742FA", "#A55EEA",
    "#FF6348", "#7BED9F", "#70A1FF", "#ECCC68", "#FF7979",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (trigger > prevTriggerRef.current) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const newParticles = [];

      const burst = burstRectRef.current;
      if (burst) {
        // Burst from edges of rect — particles explode outward from underneath
        burstRectRef.current = null; // consume it
        const count = 200;
        const r = burst;
        for (let i = 0; i < count; i++) {
          // Spawn along all four edges of the rect, exploding outward
          let x, y, vx, vy;
          const edge = Math.random();
          if (edge < 0.25) {
            // Top edge — burst upward
            x = r.left + Math.random() * r.width;
            y = r.top;
            vx = (Math.random() - 0.5) * 10;
            vy = -(2 + Math.random() * 6);
          } else if (edge < 0.5) {
            // Bottom edge — burst downward
            x = r.left + Math.random() * r.width;
            y = r.top + r.height;
            vx = (Math.random() - 0.5) * 10;
            vy = 2 + Math.random() * 6;
          } else if (edge < 0.75) {
            // Left edge — burst left
            x = r.left;
            y = r.top + Math.random() * r.height;
            vx = -(3 + Math.random() * 6);
            vy = (Math.random() - 0.5) * 6;
          } else {
            // Right edge — burst right
            x = r.left + r.width;
            y = r.top + Math.random() * r.height;
            vx = 3 + Math.random() * 6;
            vy = (Math.random() - 0.5) * 6;
          }

          newParticles.push({
            x, y,
            w: 4 + Math.random() * 8,
            h: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx,
            vy,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 18,
            wobble: Math.random() * 10,
            wobbleSpeed: 0.03 + Math.random() * 0.06,
            drag: 0.97 + Math.random() * 0.02,
          });
        }
      } else {
        // Normal top-down confetti rain
        const count = intensity === "mega" ? 1500 : intensity === "section" ? 600 : 250;
        for (let i = 0; i < count; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 600,
            w: 5 + Math.random() * 12,
            h: 8 + Math.random() * 16,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 8,
            vy: 2 + Math.random() * 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            wobble: Math.random() * 10,
            wobbleSpeed: 0.03 + Math.random() * 0.06,
            drag: 0.98 + Math.random() * 0.015,
          });
        }
      }
      particlesRef.current = [...particlesRef.current, ...newParticles];

      if (!animRef.current) {
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particlesRef.current = particlesRef.current.filter((p) =>
            p.y <= canvas.height + 60 && p.x >= -60 && p.x <= canvas.width + 60
          );

          if (particlesRef.current.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animRef.current = null;
            return;
          }

          particlesRef.current.forEach((p) => {
            p.vx *= p.drag;
            p.x += p.vx + Math.sin(p.wobble) * 0.8;
            p.y += p.vy;
            p.wobble += p.wobbleSpeed;
            p.rotation += p.rotationSpeed;
            p.vy += 0.06;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = 1;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
          });

          animRef.current = requestAnimationFrame(animate);
        };
        animate();
      }
    }
    prevTriggerRef.current = trigger;
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

// Toast notification — springs in from center
function Toast({ message, visible, type = "task", theme }) {
  const t = theme || THEMES.laserburn;
  const bgColor =
    type === "mega"
      ? "linear-gradient(135deg, #FF6B35 0%, #F7C948 50%, #FF4757 100%)"
      : type === "section"
      ? "linear-gradient(135deg, #2ED573 0%, #4ECDC4 100%)"
      : type === "timer"
      ? "linear-gradient(135deg, #F7C948 0%, #FF6B35 100%)"
      : t.toastBg;

  const textColor = type === "mega" || type === "section" || type === "timer" ? "#fff" : t.toastColor;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: visible
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0)",
        opacity: visible ? 1 : 0,
        background: bgColor,
        color: textColor,
        padding: type === "mega" ? "28px 48px" : type === "section" ? "22px 40px" : "16px 32px",
        borderRadius: 16,
        fontSize: type === "mega" ? 22 : type === "section" ? 18 : 15,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontWeight: type === "mega" ? 800 : 600,
        boxShadow: visible
          ? "0 16px 64px rgba(0,0,0,0.5), 0 0 80px " + t.accentGlow
          : "none",
        border: "1px solid rgba(255,255,255,0.12)",
        transition: "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.6), opacity 0.35s ease",
        zIndex: 9998,
        textAlign: "center",
        maxWidth: "85vw",
        letterSpacing: type === "mega" ? "0.5px" : "0.3px",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

// Session dropdown — manages multiple session lists
function SessionDropdown({ sessions, activeId, onSwitch, onCreate, onRename, onDelete, theme }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const dropRef = useRef(null);
  const editRef = useRef(null);
  const t = theme || THEMES.laserburn;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  const activeSession = sessions.find((s) => s.id === activeId);

  const saveRename = () => {
    if (editName.trim() && editingId) {
      onRename(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div ref={dropRef} style={{ position: "relative", zIndex: 500 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.8)",
          borderRadius: 8,
          padding: "5px 12px",
          cursor: "pointer",
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          letterSpacing: "0.3px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.25)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.15)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        }}
      >
        <span style={{ fontSize: 10, opacity: 0.5 }}>📁</span>
        {activeSession?.name || "Default"}
        <span style={{ fontSize: 8, opacity: 0.5, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            minWidth: 240,
            background: "rgba(15,8,2,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "6px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            backdropFilter: "blur(20px)",
          }}
        >
          {sessions.map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 6,
                background: s.id === activeId ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (s.id !== activeId) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (s.id !== activeId) e.currentTarget.style.background = "transparent";
              }}
            >
              {editingId === s.id ? (
                <input
                  ref={editRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: "none",
                  }}
                />
              ) : (
                <>
                  <span
                    onClick={() => {
                      onSwitch(s.id);
                      setOpen(false);
                    }}
                    style={{
                      flex: 1,
                      color: s.id === activeId ? "#fff" : "rgba(255,255,255,0.7)",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: s.id === activeId ? 700 : 400,
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "'JetBrains Mono', monospace",
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(s.lastModified)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(s.id);
                      setEditName(s.name);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      fontSize: 11,
                      padding: "0 3px",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.3)")}
                  >
                    ✎
                  </button>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.2)",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "0 3px",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#e81123")}
                      onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.2)")}
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: 4,
              paddingTop: 4,
            }}
          >
            <button
              onClick={() => {
                onCreate();
                setOpen(false);
              }}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                padding: "7px 10px",
                borderRadius: 6,
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.06)";
                e.target.style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "none";
                e.target.style.color = "rgba(255,255,255,0.5)";
              }}
            >
              + New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Timer preset picker — appears when clicking clock icon
function TimerPresets({ onSelect, onClose, theme }) {
  const presets = [
    { label: "5m", seconds: 300 },
    { label: "15m", seconds: 900 },
    { label: "25m", seconds: 1500 },
    { label: "60m", seconds: 3600 },
  ];
  const [custom, setCustom] = useState("");
  const ref = useRef(null);
  const t = theme || THEMES.laserburn;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btnStyle = {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.85)",
    borderRadius: 5,
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    transition: "all 0.15s",
  };

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        right: 36,
        top: -2,
        background: "rgba(15,8,2,0.95)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 8,
        padding: "6px 8px",
        display: "flex",
        gap: 4,
        alignItems: "center",
        zIndex: 100,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
      }}
    >
      {presets.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p.seconds)}
          style={btnStyle}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.1)";
          }}
        >
          {p.label}
        </button>
      ))}
      <input
        value={custom}
        onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && custom) {
            onSelect(Number(custom) * 60);
          }
          if (e.key === "Escape") onClose();
        }}
        placeholder="min"
        style={{
          width: 36,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 5,
          padding: "4px 5px",
          color: "#fff",
          fontSize: 10,
          fontFamily: "'JetBrains Mono', monospace",
          outline: "none",
          textAlign: "center",
        }}
        autoFocus
      />
    </div>
  );
}

// Individual task item — each one independently tracks the mouse + optional timer
function TaskItem({ task, sectionId, onToggle, onDelete, onEdit, onSetTimer, onCancelTimer, onTimerComplete, theme, mousePos, pScale, pivotMode, axisLock, isDragging, onPointerDownDrag }) {
  const t = theme || THEMES.laserburn;
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [showTimerPresets, setShowTimerPresets] = useState(false);
  const [timerDisplay, setTimerDisplay] = useState(null);
  const [flashing, setFlashing] = useState(false);
  const inputRef = useRef(null);
  const cardRef = useRef(null);
  const [localTilt, setLocalTilt] = useState({ rx: 0, ry: 0, z: 0 });
  const completedRef = useRef(false);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  // Timer tick — only runs for tasks with active timers
  useEffect(() => {
    if (!task.timer || !task.timer.running) {
      setTimerDisplay(null);
      completedRef.current = false;
      return;
    }

    completedRef.current = false;

    const tick = () => {
      const elapsed = (Date.now() - task.timer.startedAt) / 1000;
      const remaining = Math.max(0, task.timer.duration - elapsed);
      const pct = task.timer.duration > 0 ? remaining / task.timer.duration : 0;
      setTimerDisplay({ remaining, pct });

      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        onTimerComplete(task.id);
      }
    };

    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [task.timer?.running, task.timer?.startedAt, task.timer?.duration]);

  // Flash effect when timer completes
  useEffect(() => {
    if (task.timer && !task.timer.running && task.timer.duration > 0 && timerDisplay?.remaining === 0) {
      setFlashing(true);
      const id = setTimeout(() => setFlashing(false), 1500);
      return () => clearTimeout(id);
    }
  }, [task.timer?.running]);

  // Calculate tilt relative to this card's center
  useEffect(() => {
    if (!cardRef.current || !mousePos || pScale === 0) {
      setLocalTilt({ rx: 0, ry: 0, z: 0 });
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Radius scales with intensity (double at max), inverse square falloff
    const baseRadius = 400;
    const maxDist = baseRadius * (1 + pScale);
    const normalized = Math.min(1, dist / maxDist);
    const influence = Math.max(0, 1 - normalized * normalized);
    const strength = influence * pScale;

    const maxAngle = 18;
    const rawRy = (dx / maxDist) * maxAngle * strength;
    const rawRx = (dy / maxDist) * maxAngle * strength;

    const cap = 35;
    const ry = axisLock ? 0 : Math.max(-cap, Math.min(cap, rawRy));
    const rx = Math.max(-cap, Math.min(cap, rawRx));

    setLocalTilt({ rx, ry });
  }, [mousePos, pScale, axisLock]);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
    }
    setEditing(false);
  };

  const handleCardClick = (e) => {
    // Block click if we just finished a drag (prevents accidental toggle/delete)
    if (window.__cbDragJustEnded) return;
    if (editing || showTimerPresets) return;
    onToggle(task.id);
  };

  const handleCardDblClick = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x > 44 && x < rect.width - 70) {
      setEditing(true);
      setEditText(task.text);
    }
  };

  const timerPct = timerDisplay ? timerDisplay.pct : 0;
  const hasRunningTimer = task.timer?.running && timerDisplay;

  return (
    <div
      ref={cardRef}
      data-task-id={task.id}
      data-section-id={sectionId}
      style={{
        marginBottom: 4,
        cursor: "default",
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 6,
        opacity: isDragging ? 0.15 : 1,
        transform: isDragging ? "scale(0.97)" : "scale(1)",
        transition: isDragging ? "opacity 0.3s, transform 0.3s" : "opacity 0.2s, transform 0.15s",
        filter: isDragging ? "blur(1px)" : "none",
      }}
    >
      {/* Visual tilting wrapper — clickable/draggable card */}
      <div
        onClick={handleCardClick}
        onDoubleClick={handleCardDblClick}
        onPointerDown={(e) => {
          if (editing || showTimerPresets) return;
          if (e.button !== 0) return;
          onPointerDownDrag(e, task.id, sectionId, cardRef.current);
        }}
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: task.done ? t.taskDoneBg : t.taskBg,
          borderRadius: 8,
          borderLeft: `3px solid ${task.done ? t.taskDoneBorder : t.taskBorder}`,
          transition: "transform 0.12s ease-out, opacity 0.3s ease, background 0.3s ease",
          opacity: task.done ? 0.6 : 1,
          transform: `perspective(600px) rotateX(${localTilt.rx}deg) rotateY(${localTilt.ry}deg)`,
          transformOrigin: pivotMode === "left" ? "25px center" : "center center",
          willChange: "transform",
          overflow: "hidden",
          animation: flashing ? "timerFlash 0.3s ease 5" : "none",
        }}
      >
        {/* Timer bar — behind everything */}
        {hasRunningTimer && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${timerPct * 100}%`,
              background: t.timerBarColor || "rgba(255,255,255,0.18)",
              borderRadius: "8px 0 0 8px",
              transition: "width 0.15s linear",
              zIndex: 0,
            }}
          />
        )}

        {/* Checkbox */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            border: `2px solid ${task.done ? t.checkDone : t.checkBorder}`,
            background: task.done ? t.checkDone : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: task.done ? "#1a0800" : "transparent",
            fontSize: 13,
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          {task.done ? "✓" : ""}
        </div>

        {/* Task text */}
        {editing ? (
          <div style={{ flex: 1, height: 24, zIndex: 1 }} />
        ) : (
          <span
            style={{
              flex: 1,
              color: task.done ? t.textMuted : t.text,
              textDecoration: task.done ? "line-through" : "none",
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineHeight: 1.5,
              zIndex: 1,
            }}
          >
            {task.text}
          </span>
        )}

        {/* Timer display / clock icon */}
        {hasRunningTimer ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: timerPct > 0.5 ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
              padding: "2px 6px",
              borderRadius: 4,
              background: timerPct > 0.5 ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              flexShrink: 0,
              zIndex: 1,
              minWidth: 40,
              textAlign: "center",
              transition: "color 0.3s, background 0.3s",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCancelTimer(task.id);
            }}
          >
            {formatTime(timerDisplay.remaining)}
          </span>
        ) : (
          <span
            style={{
              fontSize: 18,
              color: "rgba(0,0,0,0.5)",
              padding: "2px 6px",
              flexShrink: 0,
              zIndex: 1,
              pointerEvents: "auto",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowTimerPresets(true);
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(0,0,0,0.5)")}
          >
            ⏱
          </span>
        )}

      </div>

      {/* Delete button — separate, no parallax */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.__cbDragJustEnded) return;
          onDelete(task.id);
        }}
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 6,
          color: "rgba(255,255,255,0.25)",
          fontSize: 14,
          cursor: "pointer",
          transition: "background 0.15s, color 0.15s, border-color 0.15s",
          padding: 0,
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,0,0,0.2)";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = "rgba(255,0,0,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.1)";
          e.currentTarget.style.color = "rgba(255,255,255,0.25)";
          e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
        }}
      >
        ×
      </button>

      {/* Timer presets popup */}
      {showTimerPresets && (
        <TimerPresets
          theme={t}
          onSelect={(seconds) => {
            onSetTimer(task.id, seconds);
            setShowTimerPresets(false);
          }}
          onClose={() => setShowTimerPresets(false)}
        />
      )}

      {/* Edit input floats above when active */}
      {editing && (
        <div style={{
          position: "absolute",
          top: 0, left: 44, right: 70, bottom: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
          zIndex: 5,
        }}>
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
            style={{
              flex: 1,
              background: t.cardBg,
              border: `1px solid ${t.inputFocusBorder}`,
              borderRadius: 6,
              padding: "4px 8px",
              color: t.text,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              outline: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Section component — with reorder buttons + animation
function Section({ section, sectionIndex, totalSections, onToggleTask, onDeleteTask, onEditTask, onDeleteSection, onAddTask, onSetTimer, onCancelTimer, onTimerComplete, onMoveUp, onMoveDown, theme, mousePos, pScale, pivotMode, axisLock, dragTask, dragOverTask, onPointerDownDrag, landedTaskId, collapsingSlot }) {
  const t = theme || THEMES.laserburn;
  const [newTask, setNewTask] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const total = section.tasks.length;
  const done = section.tasks.filter((t) => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const reorderBtnStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4,
    color: t.deleteDim,
    cursor: "pointer",
    fontSize: 13,
    padding: "4px 7px",
    lineHeight: 1,
    transition: "all 0.15s",
  };

  return (
    <div
      style={{
        background: allDone ? t.sectionDoneBg : t.cardBg,
        borderRadius: 12,
        padding: "16px 18px",
        marginBottom: 12,
        border: `1px solid ${allDone ? t.sectionDoneBorder : t.cardBorder}`,
        transition: "all 0.4s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: collapsed ? 0 : 12,
          cursor: "pointer",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span
          style={{
            color: t.textDim,
            fontSize: 12,
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ▼
        </span>

        <span
          style={{
            flex: 1,
            fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: allDone ? t.sectionTitleDone : t.sectionTitle,
          }}
        >
          {section.name} {allDone && "✓"}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 80,
              height: 4,
              background: t.progressBg,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: allDone ? t.progressFillDone : pct > 50 ? t.progressFillMid : t.progressFill,
                borderRadius: 2,
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              color: t.textDim,
              fontFamily: "'JetBrains Mono', monospace",
              minWidth: 42,
              textAlign: "right",
            }}
          >
            {done}/{total}
          </span>
        </div>

        {/* Reorder buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMoveUp(section.id)}
            disabled={sectionIndex === 0}
            style={{
              ...reorderBtnStyle,
              opacity: sectionIndex === 0 ? 0.2 : 1,
              cursor: sectionIndex === 0 ? "default" : "pointer",
            }}
            onMouseEnter={(e) => { if (sectionIndex > 0) e.target.style.color = "rgba(255,255,255,0.8)"; }}
            onMouseLeave={(e) => (e.target.style.color = t.deleteDim)}
          >
            ▲
          </button>
          <button
            onClick={() => onMoveDown(section.id)}
            disabled={sectionIndex === totalSections - 1}
            style={{
              ...reorderBtnStyle,
              opacity: sectionIndex === totalSections - 1 ? 0.2 : 1,
              cursor: sectionIndex === totalSections - 1 ? "default" : "pointer",
            }}
            onMouseEnter={(e) => { if (sectionIndex < totalSections - 1) e.target.style.color = "rgba(255,255,255,0.8)"; }}
            onMouseLeave={(e) => (e.target.style.color = t.deleteDim)}
          >
            ▼
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteSection(section.id);
          }}
          style={{
            background: "none",
            border: "none",
            color: t.deleteDim,
            cursor: "pointer",
            fontSize: 14,
            padding: "2px 4px",
          }}
          onMouseEnter={(e) => (e.target.style.color = t.deleteHover)}
          onMouseLeave={(e) => (e.target.style.color = t.deleteDim)}
        >
          ×
        </button>
      </div>

      {!collapsed && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, perspective: 600 }}>
            {section.tasks.map((task, taskIndex) => {
              const isOver = dragOverTask?.taskId === task.id && dragTask?.taskId !== task.id;
              const gapAbove = isOver && !dragOverTask?.below;
              const gapBelow = isOver && dragOverTask?.below;
              const isBeingDragged = dragTask?.taskId === task.id;
              const justLanded = landedTaskId === task.id;
              // Ripple: tasks near the landed task get pushed away briefly
              const landedIdx = landedTaskId ? section.tasks.findIndex((t) => t.id === landedTaskId) : -1;
              const dist = landedIdx >= 0 && !justLanded ? taskIndex - landedIdx : 0;
              const absDist = Math.abs(dist);
              // Inverse square falloff: 42 / dist² — radiates up to 6 neighbors
              const ripplePx = absDist > 0 ? Math.round(42 / (absDist * absDist)) : 0;
              const isRipple = absDist > 0 && absDist <= 6 && ripplePx >= 1;
              const rippleDir = dist < 0 ? "rippleUp" : "rippleDown";
              // Stagger delay so the ripple radiates outward
              const rippleDelay = (absDist - 1) * 0.04;
              // Check if a collapsing placeholder should appear before this task
              const slotBefore = collapsingSlot && collapsingSlot.sectionId === section.id && collapsingSlot.index === taskIndex;
              // Or after the last task
              const slotAfter = collapsingSlot && collapsingSlot.sectionId === section.id && collapsingSlot.index === taskIndex + 1 && taskIndex === section.tasks.length - 1;
              return (
                <Fragment key={task.id}>
                  {slotBefore && (
                    <div style={{
                      height: collapsingSlot.height,
                      transition: "height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      overflow: "hidden",
                      pointerEvents: "none",
                    }} />
                  )}
                  <div
                    style={{
                      paddingTop: gapAbove ? 44 : 0,
                      paddingBottom: gapBelow ? 44 : 0,
                      transition: "padding 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      position: "relative",
                      "--ripple-dist": `${ripplePx}px`,
                      animation: justLanded
                        ? "taskLand 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        : isRipple
                          ? `${rippleDir} 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) ${rippleDelay}s both`
                          : "none",
                    }}
                  >
                    {/* Drop indicator — centered in the gap */}
                    {(gapAbove || gapBelow) && (
                      <div style={{
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        height: 2,
                        borderRadius: 2,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                        boxShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)",
                        animation: "dropGlow 0.8s ease-in-out infinite alternate",
                        ...(gapAbove ? { top: 20 } : { bottom: 20 }),
                      }} />
                    )}
                    {/* Dark highlight overlay — fades out as task settles in */}
                    {justLanded && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.25)",
                        borderRadius: 8,
                        pointerEvents: "none",
                        zIndex: 2,
                        animation: "landFadeIn 0.6s ease forwards",
                      }} />
                    )}
                    <TaskItem
                      task={task}
                      sectionId={section.id}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                      onSetTimer={onSetTimer}
                      onCancelTimer={onCancelTimer}
                      onTimerComplete={onTimerComplete}
                      theme={t}
                      mousePos={mousePos}
                      pScale={pScale}
                      pivotMode={pivotMode}
                      axisLock={axisLock}
                      isDragging={isBeingDragged}
                      onPointerDownDrag={onPointerDownDrag}
                    />
                  </div>
                  {slotAfter && (
                    <div style={{
                      height: collapsingSlot.height,
                      transition: "height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      overflow: "hidden",
                      pointerEvents: "none",
                    }} />
                  )}
                </Fragment>
              );
            })}
            {/* Collapsing slot when the removed task was the only one or at the end and list is now empty */}
            {collapsingSlot && collapsingSlot.sectionId === section.id && collapsingSlot.index >= section.tasks.length && section.tasks.length > 0 && (
              <div style={{
                height: collapsingSlot.height,
                transition: "height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                overflow: "hidden",
                pointerEvents: "none",
              }} />
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTask.trim()) {
                  onAddTask(section.id, newTask.trim());
                  setNewTask("");
                }
              }}
              placeholder="+ add task..."
              style={{
                flex: 1,
                background: t.cardBg,
                border: `1px solid ${t.inputBorder}`,
                borderRadius: 6,
                padding: "6px 10px",
                color: t.textMuted,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = t.inputFocusBorder)}
              onBlur={(e) => (e.target.style.borderColor = t.inputBorder)}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Parse markdown checklist into sections and tasks
function parseMarkdownChecklist(mdText) {
  const lines = mdText.split("\n");
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();

    const headerMatch = trimmed.match(/^#{1,6}\s+(.+)/);
    if (headerMatch) {
      const name = headerMatch[1].replace(/[*_`]/g, "").trim();
      if (name) {
        currentSection = {
          id: `s${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name,
          tasks: [],
        };
        sections.push(currentSection);
      }
      continue;
    }

    const checkboxMatch = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.+)/);
    if (checkboxMatch) {
      const done = checkboxMatch[1].toLowerCase() === "x";
      const text = checkboxMatch[2].replace(/[*_`]/g, "").trim();

      if (!currentSection) {
        currentSection = {
          id: `s${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: "Imported Tasks",
          tasks: [],
        };
        sections.push(currentSection);
      }

      currentSection.tasks.push({
        id: `t${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        done,
      });
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(?!\[)(.+)/);
    if (listMatch) {
      const text = listMatch[1].replace(/[*_`]/g, "").trim();
      if (!text) continue;

      if (!currentSection) {
        currentSection = {
          id: `s${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: "Imported Tasks",
          tasks: [],
        };
        sections.push(currentSection);
      }

      currentSection.tasks.push({
        id: `t${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        done: false,
      });
    }
  }

  return sections.filter((s) => s.tasks.length > 0);
}

// Session helpers
const SESSIONS_KEY = "codebarrie-todo-sessions";
const ACTIVE_SESSION_KEY = "codebarrie-todo-active-session";
function sessionDataKey(id) {
  return `codebarrie-todo-session-${id}`;
}

function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function loadSessionData(id) {
  try {
    const raw = localStorage.getItem(sessionDataKey(id));
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveSessionData(id, sections) {
  localStorage.setItem(sessionDataKey(id), JSON.stringify(sections));
}

// Main app
export default function App() {
  // Session state
  const [sessionList, setSessionList] = useState([]); // [{id, name, lastModified}]
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Working data
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [confetti, setConfetti] = useState({ trigger: 0, intensity: "normal" });
  const [toast, setToast] = useState({ message: "", visible: false, type: "task" });
  const [loaded, setLoaded] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [themeKey, setThemeKey] = useState("laserburn");
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState(null);
  const [parallaxIntensity, setParallaxIntensity] = useState(600);
  const [pivotMode, setPivotMode] = useState("center");
  const [axisLock, setAxisLock] = useState(false);
  const theme = THEMES[themeKey] || THEMES.laserburn;
  const pScale = parallaxIntensity / 200;

  // Title editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const activeSessionName = sessionList.find((s) => s.id === activeSessionId)?.name || "CodeBarrie: To-Do";

  // Quick-add state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddName, setQuickAddName] = useState("");
  const quickAddRef = useRef(null);

  // Section reorder animation state
  const [reorderAnim, setReorderAnim] = useState(null);
  // { id, neighborId, direction, phase, moveDistance, neighborDistance }
  const sectionRefs = useRef(new Map());

  // Drag-and-drop task reorder state
  const [dragTask, setDragTask] = useState(null); // { taskId, sectionId }
  const [dragOverTask, setDragOverTask] = useState(null); // { taskId, sectionId }

  // Focus quick-add input when opened
  useEffect(() => {
    if (quickAddOpen && quickAddRef.current) quickAddRef.current.focus();
  }, [quickAddOpen]);

  // Parallax tilt — track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;
      setTilt({ x, y });
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
      setMousePos(null);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Load theme from storage
  useEffect(() => {
    const saved = localStorage.getItem("codebarrie-todo-theme");
    if (saved && THEMES[saved]) {
      setThemeKey(saved);
    }
  }, []);

  // Save theme on change
  useEffect(() => {
    localStorage.setItem("codebarrie-todo-theme", themeKey);
  }, [themeKey]);

  // ── Session load / migration ──
  useEffect(() => {
    let sessions = loadSessions();
    let activeId = localStorage.getItem(ACTIVE_SESSION_KEY);

    if (!sessions) {
      // First time or migration from old format
      const oldData = localStorage.getItem("codebarrie-todo-data");
      const defaultId = `session-${Date.now()}`;
      const defaultSession = { id: defaultId, name: "Default", lastModified: Date.now() };
      sessions = [defaultSession];

      if (oldData) {
        try {
          saveSessionData(defaultId, JSON.parse(oldData));
        } catch {}
      } else {
        // Default test project so the app isn't empty on first launch
        const defaultSections = [
          {
            id: "s-welcome", name: "Welcome to CodeBarrie: To-Do", collapsed: false,
            tasks: [
              { id: "t-w1", text: "Check off a task (click the left side)", done: false },
              { id: "t-w2", text: "Double-click a task to edit it", done: false },
              { id: "t-w3", text: "Drag tasks to reorder them", done: false },
              { id: "t-w4", text: "Try the timer (clock icon on the right)", done: false },
              { id: "t-w5", text: "Check off all tasks to hear the fanfare!", done: false },
            ],
          },
          {
            id: "s-features", name: "Features to Try", collapsed: false,
            tasks: [
              { id: "t-f1", text: "Reorder sections with the arrow buttons", done: false },
              { id: "t-f2", text: "Create a new session from the dropdown", done: false },
              { id: "t-f3", text: "Rename this project with the pencil icon", done: false },
              { id: "t-f4", text: "Adjust the 3D parallax slider in the title bar", done: false },
              { id: "t-f5", text: "Import a markdown checklist at the bottom", done: false },
            ],
          },
        ];
        defaultSession.name = "My First Project";
        saveSessionData(defaultId, defaultSections);
      }

      saveSessions(sessions);
      activeId = defaultId;
      localStorage.setItem(ACTIVE_SESSION_KEY, activeId);
    }

    // Ensure activeId is valid
    if (!activeId || !sessions.find((s) => s.id === activeId)) {
      activeId = sessions[0].id;
      localStorage.setItem(ACTIVE_SESSION_KEY, activeId);
    }

    setSessionList(sessions);
    setActiveSessionId(activeId);
    setSections(loadSessionData(activeId));

    // Check for expired timers on load
    const loadedSections = loadSessionData(activeId);
    let modified = false;
    const now = Date.now();
    const fixedSections = loadedSections.map((s) => ({
      ...s,
      tasks: s.tasks.map((t) => {
        if (t.timer && t.timer.running) {
          const elapsed = (now - t.timer.startedAt) / 1000;
          if (elapsed >= t.timer.duration) {
            modified = true;
            return { ...t, timer: { ...t.timer, running: false } };
          }
        }
        return t;
      }),
    }));
    if (modified) {
      setSections(fixedSections);
    } else {
      setSections(loadedSections);
    }

    setLoaded(true);
  }, []);

  // ── Save sections to active session on change ──
  useEffect(() => {
    if (!loaded || !activeSessionId) return;
    try {
      saveSessionData(activeSessionId, sections);
      // Update lastModified in session list
      setSessionList((prev) => {
        const next = prev.map((s) =>
          s.id === activeSessionId ? { ...s, lastModified: Date.now() } : s
        );
        saveSessions(next);
        return next;
      });
    } catch (e) {
      console.error("Save failed:", e);
    }
  }, [sections, loaded]);

  // ── Session management ──
  const switchSession = useCallback(
    (newId) => {
      if (newId === activeSessionId) return;
      // Save current
      if (activeSessionId) {
        saveSessionData(activeSessionId, sections);
      }
      // Load new
      const data = loadSessionData(newId);
      setSections(data);
      setActiveSessionId(newId);
      localStorage.setItem(ACTIVE_SESSION_KEY, newId);
    },
    [activeSessionId, sections]
  );

  const createSession = useCallback(() => {
    const id = `session-${Date.now()}`;
    const name = `Session ${sessionList.length + 1}`;
    const newSession = { id, name, lastModified: Date.now() };
    saveSessionData(id, []);
    const next = [...sessionList, newSession];
    setSessionList(next);
    saveSessions(next);
    switchSession(id);
  }, [sessionList, switchSession]);

  const renameSession = useCallback(
    (id, newName) => {
      setSessionList((prev) => {
        const next = prev.map((s) => (s.id === id ? { ...s, name: newName } : s));
        saveSessions(next);
        return next;
      });
    },
    []
  );

  const deleteSession = useCallback(
    (id) => {
      if (sessionList.length <= 1) return;
      localStorage.removeItem(sessionDataKey(id));
      const next = sessionList.filter((s) => s.id !== id);
      setSessionList(next);
      saveSessions(next);
      if (id === activeSessionId) {
        switchSession(next[0].id);
      }
    },
    [sessionList, activeSessionId, switchSession]
  );

  // ── Import markdown ──
  const handleImportMarkdown = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const imported = parseMarkdownChecklist(text);

      if (imported.length === 0) {
        setToast({ message: "No tasks found in that file. Use - [ ] or ## headers.", visible: true, type: "task" });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
        return;
      }

      setSections((prev) => [...prev, ...imported]);

      const totalTasks = imported.reduce((sum, s) => sum + s.tasks.length, 0);
      setToast({
        message: `Imported ${imported.length} section${imported.length > 1 ? "s" : ""} with ${totalTasks} tasks from ${file.name}`,
        visible: true,
        type: "section",
      });
      setConfetti((c) => ({ trigger: c.trigger + 1, intensity: "normal" }));
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
    };
    reader.readAsText(file);

    e.target.value = "";
  };

  const toastTimerRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const activeCelebrationRef = useRef(null);

  const showCelebration = (type = "task") => {
    // If a "mega" celebration is active, don't let anything override it
    if (activeCelebrationRef.current === "mega" && type !== "mega") return;

    const messages =
      type === "mega"
        ? ALL_COMPLETE_MESSAGES
        : type === "section"
        ? SECTION_COMPLETE_MESSAGES
        : type === "timer"
        ? TIMER_COMPLETE_MESSAGES
        : CELEBRATION_MESSAGES;

    const msg = messages[Math.floor(Math.random() * messages.length)];

    // Clear any pending hide/shake timers so they can't cut us short
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);

    activeCelebrationRef.current = type;
    setToast({ message: msg, visible: true, type });
    setConfetti((c) => ({ trigger: c.trigger + 1, intensity: type === "mega" ? "mega" : type === "section" ? "section" : "normal" }));
    setShaking(true);

    const shakeDuration = type === "mega" ? 2000 : type === "section" ? 1200 : 500;
    const toastDuration = type === "mega" ? 10500 : type === "section" ? 5000 : 3500;
    shakeTimerRef.current = setTimeout(() => setShaking(false), shakeDuration);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      activeCelebrationRef.current = null;
    }, toastDuration);
  };

  const toggleTask = (taskId) => {
    setSections((prev) => {
      const next = prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
      }));

      const section = next.find((s) => s.tasks.some((t) => t.id === taskId));
      const task = section?.tasks.find((t) => t.id === taskId);

      if (task?.done) {
        // Sound: ascending note scale based on progress
        const totalTasks = next.reduce((s, sec) => s + sec.tasks.length, 0);
        const doneTasks = next.reduce((s, sec) => s + sec.tasks.filter((t) => t.done).length, 0);
        const allDone = next.every((s) => s.tasks.every((t) => t.done));

        if (allDone && next.some((s) => s.tasks.length > 0)) {
          playFanfare();
          setTimeout(() => showCelebration("mega"), 200);
        } else if (section && section.tasks.every((t) => t.done)) {
          playCheckNote(doneTasks, totalTasks);
          setTimeout(() => showCelebration("section"), 200);
        } else {
          playCheckNote(doneTasks, totalTasks);
          setTimeout(() => showCelebration("task"), 100);
        }
      }

      return next;
    });
  };

  const addTask = (sectionId, text) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, tasks: [...s.tasks, { id: `t${Date.now()}`, text, done: false }] }
          : s
      )
    );
  };

  const deleteTask = (taskId) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.filter((t) => t.id !== taskId),
      }))
    );
  };

  const editTask = (taskId, newText) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, text: newText } : t)),
      }))
    );
  };

  const addSection = () => {
    if (!newSectionName.trim()) return;
    setSections((prev) => [
      ...prev,
      { id: `s${Date.now()}`, name: newSectionName.trim(), tasks: [] },
    ]);
    setNewSectionName("");
  };

  const deleteSectionFromList = (sectionId) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  // ── Quick-add section (inserts at top) ──
  const quickAddSection = () => {
    if (!quickAddName.trim()) return;
    setSections((prev) => [
      { id: `s${Date.now()}`, name: quickAddName.trim(), tasks: [] },
      ...prev,
    ]);
    setQuickAddName("");
    setQuickAddOpen(false);
  };

  // ── Timer functions ──
  const setTaskTimer = (taskId, duration) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, timer: { duration, running: true, startedAt: Date.now() } }
            : t
        ),
      }))
    );
  };

  const cancelTaskTimer = (taskId) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, timer: null } : t
        ),
      }))
    );
  };

  const handleTimerComplete = useCallback((taskId) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId && t.timer
            ? { ...t, timer: { ...t.timer, running: false } }
            : t
        ),
      }))
    );
    showCelebration("timer");
  }, []);

  // ── Section reorder with cinematic animation ──
  const moveSection = useCallback(
    (sectionId, direction) => {
      if (reorderAnim) return;

      const idx = sections.findIndex((s) => s.id === sectionId);
      if (direction === "up" && idx <= 0) return;
      if (direction === "down" && idx >= sections.length - 1) return;

      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      const neighborId = sections[swapIdx].id;

      const movingEl = sectionRefs.current.get(sectionId);
      const neighborEl = sectionRefs.current.get(neighborId);
      if (!movingEl || !neighborEl) return;

      const movingRect = movingEl.getBoundingClientRect();
      const neighborRect = neighborEl.getBoundingClientRect();
      const gap = 12; // marginBottom
      const scrollYBefore = window.scrollY;

      // How far each element travels
      const moveDistance = direction === "up"
        ? -(neighborRect.height + gap)
        : (neighborRect.height + gap);
      const neighborDistance = direction === "up"
        ? (movingRect.height + gap)
        : -(movingRect.height + gap);

      // Pre-compute where the section will land in DOCUMENT coordinates
      // After swap: the moved section takes the neighbor's slot in the flow
      // Moving UP → section lands at neighbor's document-Y
      // Moving DOWN → section lands at its own document-Y + neighbor height + gap
      const landedDocTop = direction === "up"
        ? neighborRect.top + scrollYBefore
        : movingRect.top + scrollYBefore + neighborRect.height + gap;
      const landedLeft = movingRect.left;
      const landedWidth = movingRect.width;
      const landedHeight = movingRect.height;

      // Phase 1: Scale up + lift (200ms)
      setReorderAnim({
        id: sectionId, neighborId, direction, phase: "lift",
        moveDistance: 0, neighborDistance: 0,
      });

      // Phase 2: Slide over (starts at 200ms, runs 500ms)
      setTimeout(() => {
        setReorderAnim({
          id: sectionId, neighborId, direction, phase: "slide",
          moveDistance, neighborDistance,
        });

        // Scroll locks to the moving section throughout the slide
        window.scrollBy({ top: moveDistance, behavior: "smooth" });

        // Phase 3: Land — swap data + bounce (at 700ms)
        setTimeout(() => {
          // Swap data
          setSections((prev) => {
            const next = [...prev];
            [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
            return next;
          });

          // Land bounce + effects
          setReorderAnim({ id: sectionId, neighborId, direction, phase: "land", moveDistance: 0, neighborDistance: 0 });
          setShaking(true);

          // Confetti burst from pre-computed landing position
          // Convert document coords to current viewport coords using current scrollY
          const viewportTop = landedDocTop - window.scrollY;
          setConfetti((c) => ({
            trigger: c.trigger + 1,
            intensity: "normal",
            burstRect: { top: viewportTop, left: landedLeft, width: landedWidth, height: landedHeight },
          }));

          setTimeout(() => setShaking(false), 500);
          setTimeout(() => setReorderAnim(null), 500);
        }, 500);
      }, 220);
    },
    [sections, reorderAnim]
  );

  // ── Custom pointer-based task drag ("soul pull" ghost) ──
  const dragRef = useRef(null); // { taskId, sectionId, startX, startY, ghost, active }
  const ghostRef = useRef(null); // DOM node for the floating ghost
  const dragOverRef = useRef(null); // always-current drag-over target (avoids stale closure)

  // Cleanup helper — ensures ghost is removed and state is reset
  // softClose: if true, delay clearing dragOverTask so the gap closes smoothly via CSS transition
  const cleanupDrag = useCallback((softClose = false) => {
    if (dragRef.current?.scrollRAF) {
      cancelAnimationFrame(dragRef.current.scrollRAF);
    }
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }
    document.body.style.userSelect = "";
    document.body.style.WebkitUserSelect = "";
    const cursorStyle = document.getElementById("cb-drag-cursor");
    if (cursorStyle) cursorStyle.remove();
    setDragTask(null);
    dragRef.current = null;
    if (softClose) {
      // Let the padding transition animate to 0 before clearing
      setTimeout(() => {
        setDragOverTask(null);
        dragOverRef.current = null;
      }, 50);
    } else {
      setDragOverTask(null);
      dragOverRef.current = null;
    }
  }, []);

  // Track which task just landed for the landing animation
  const [landedTaskId, setLandedTaskId] = useState(null);
  // Collapsing placeholder at the old position so removal feels smooth
  const [collapsingSlot, setCollapsingSlot] = useState(null); // { sectionId, index, height }

  const handlePointerDownDrag = useCallback((e, taskId, sectionId, el) => {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragRef.current = {
      taskId, sectionId,
      startX: e.clientX, startY: e.clientY,
      offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top,
      width: rect.width, height: rect.height,
      text: el.querySelector("span")?.textContent || "",
      active: false,
      lastClientY: e.clientY,
      scrollRAF: null,
    };

    const detachAll = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onLostFocus);
      document.removeEventListener("visibilitychange", onLostFocus);
    };

    const finishDrag = () => {
      detachAll();

      const d = dragRef.current;
      if (!d || !d.active) {
        dragRef.current = null;
        return;
      }

      // Animate ghost to the drop target position before removing
      const overTask = dragOverRef.current;
      const ghost = ghostRef.current;

      // Find drop target element to animate toward
      let targetEl = null;
      if (overTask) {
        targetEl = document.querySelector(`[data-task-id="${overTask.taskId}"]`);
      }

      const doReorder = () => {
        window.__cbDragJustEnded = true;
        setTimeout(() => { window.__cbDragJustEnded = false; }, 50);

        if (overTask && overTask.taskId !== d.taskId) {
          const movedId = d.taskId;

          // Place a collapsing placeholder at the old position so the
          // space smoothly shrinks closed instead of an instant jump-up
          const srcEl = document.querySelector(`[data-task-id="${movedId}"]`);
          const slotHeight = srcEl ? srcEl.getBoundingClientRect().height + 4 : 48;
          // Find original index from the DOM (avoids stale closure on sections)
          const allTaskEls = Array.from(
            document.querySelectorAll(`[data-section-id="${d.sectionId}"][data-task-id]`)
          );
          const srcIdx = allTaskEls.findIndex(
            (el) => el.getAttribute("data-task-id") === movedId
          );
          if (srcIdx !== -1) {
            setCollapsingSlot({ sectionId: d.sectionId, index: srcIdx, height: slotHeight });
            // Kick off the collapse after a frame so the initial height renders first
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setCollapsingSlot((prev) => prev ? { ...prev, height: 0 } : null);
              });
            });
            setTimeout(() => setCollapsingSlot(null), 400);
          }

          setSections((prev) => {
            const next = prev.map((s) => ({ ...s, tasks: [...s.tasks] }));
            const srcSection = next.find((s) => s.id === d.sectionId);
            const srcI = srcSection?.tasks.findIndex((t) => t.id === movedId);
            if (!srcSection || srcI === -1) return prev;
            const [movedTask] = srcSection.tasks.splice(srcI, 1);
            const destSection = next.find((s) => s.id === overTask.sectionId);
            let destIdx = destSection?.tasks.findIndex((t) => t.id === overTask.taskId);
            if (!destSection || destIdx === -1) return prev;
            if (overTask.below) destIdx += 1;
            destSection.tasks.splice(destIdx, 0, movedTask);
            return next;
          });
          setLandedTaskId(movedId);
          setTimeout(() => setLandedTaskId(null), 600);
        }

        cleanupDrag(true);
      };

      // Instant drop: fade ghost in place, reorder immediately so task
      // materializes in the already-open gap. Other tasks slide to close
      // the old position via CSS padding transitions.
      if (ghost) {
        ghost.style.transition = "opacity 0.15s ease, transform 0.15s ease";
        ghost.style.opacity = "0";
        ghost.style.transform = "scale(0.95)";
        setTimeout(() => {
          if (ghostRef.current) { ghostRef.current.remove(); ghostRef.current = null; }
        }, 150);
      }
      doReorder();
    };

    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.startX;
      const dy = ev.clientY - d.startY;

      if (!d.active && Math.abs(dx) + Math.abs(dy) < 6) return;

      // Track cursor Y for the auto-scroll rAF loop
      d.lastClientY = ev.clientY;

      if (!d.active) {
        d.active = true;
        document.body.style.userSelect = "none";
        document.body.style.WebkitUserSelect = "none";
        // Force grabbing cursor globally via style tag so no element can override it
        const cursorStyle = document.createElement("style");
        cursorStyle.id = "cb-drag-cursor";
        cursorStyle.textContent = "* { cursor: grabbing !important; }";
        document.head.appendChild(cursorStyle);
        window.getSelection()?.removeAllRanges();
        setDragTask({ taskId: d.taskId, sectionId: d.sectionId });

        const ghost = document.createElement("div");
        ghost.style.cssText = `
          position: fixed; z-index: 99999; pointer-events: none;
          width: ${d.width}px; padding: 10px 14px; box-sizing: border-box;
          background: rgba(255,255,255,0.06); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
          color: rgba(255,255,255,0.45); font-size: 14px; opacity: 0.7;
          font-family: 'JetBrains Mono', monospace; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          transform: scale(1.02);
        `;
        ghost.textContent = d.text;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;

        // Start auto-scroll rAF loop — scrolls when cursor is in edge zones
        const scrollLoop = () => {
          const dr = dragRef.current;
          if (!dr || !dr.active) return;
          const vh = window.innerHeight;
          const edgeZone = vh * 0.25;
          const maxSpeed = 14;
          const cy = dr.lastClientY;
          if (cy < edgeZone) {
            const pct = 1 - cy / edgeZone;
            window.scrollBy(0, -Math.round(maxSpeed * pct * pct));
          } else if (cy > vh - edgeZone) {
            const pct = 1 - (vh - cy) / edgeZone;
            window.scrollBy(0, Math.round(maxSpeed * pct * pct));
          }
          dr.scrollRAF = requestAnimationFrame(scrollLoop);
        };
        d.scrollRAF = requestAnimationFrame(scrollLoop);
      }

      if (ghostRef.current) {
        ghostRef.current.style.left = `${ev.clientX - d.offsetX}px`;
        ghostRef.current.style.top = `${ev.clientY - d.offsetY}px`;
      }

      // Hit-test: find the gap between tasks where the cursor is
      // We always express the drop as "below task X" so there's only ONE
      // indicator line between any two adjacent tasks (no flicker)
      const els = [...document.querySelectorAll("[data-task-id]")];
      // Filter out the dragged task and sort by vertical position
      const others = els
        .filter((taskEl) => taskEl.getAttribute("data-task-id") !== d.taskId)
        .map((taskEl) => ({
          el: taskEl,
          tid: taskEl.getAttribute("data-task-id"),
          sid: taskEl.getAttribute("data-section-id"),
          rect: taskEl.getBoundingClientRect(),
        }))
        .sort((a, b) => a.rect.top - b.rect.top);

      let result = null;
      if (others.length > 0) {
        // Check if cursor is above the first task
        if (ev.clientY < others[0].rect.top + others[0].rect.height / 2) {
          result = { taskId: others[0].tid, sectionId: others[0].sid, below: false };
        } else {
          // Find which task the cursor is below (always express as "below taskX")
          for (let i = others.length - 1; i >= 0; i--) {
            const cy = others[i].rect.top + others[i].rect.height / 2;
            if (ev.clientY >= cy) {
              result = { taskId: others[i].tid, sectionId: others[i].sid, below: true };
              break;
            }
          }
        }
      }
      dragOverRef.current = result;
      setDragOverTask(result);
    };

    const onUp = () => finishDrag();
    const onLostFocus = () => finishDrag();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onLostFocus);
    document.addEventListener("visibilitychange", onLostFocus);
  }, [cleanupDrag]);

  // Stats
  const totalTasks = sections.reduce((sum, s) => sum + s.tasks.length, 0);
  const doneTasks = sections.reduce((sum, s) => sum + s.tasks.filter((t) => t.done).length, 0);
  const globalPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const shakeIntensity = Math.max(1, Math.round((globalPct / 100) * 20));
  const shakeSpeed = globalPct > 80 ? "40ms" : globalPct > 50 ? "55ms" : "70ms";

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes shake {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(${shakeIntensity}px, ${-shakeIntensity * 0.5}px) rotate(${shakeIntensity * 0.15}deg); }
          50% { transform: translate(${-shakeIntensity * 0.7}px, ${shakeIntensity * 0.3}px) rotate(${-shakeIntensity * 0.1}deg); }
          75% { transform: translate(${-shakeIntensity * 0.5}px, ${-shakeIntensity * 0.7}px) rotate(${shakeIntensity * 0.12}deg); }
          100% { transform: translate(${shakeIntensity * 0.3}px, ${shakeIntensity * 0.2}px) rotate(0deg); }
        }
        @keyframes timerFlash {
          0%, 100% { box-shadow: none; }
          50% { box-shadow: inset 0 0 30px rgba(255,200,0,0.4), 0 0 20px rgba(255,200,0,0.3); }
        }
        @keyframes landBounce {
          0% { transform: scale(1.08) translateY(-8px); }
          40% { transform: scale(0.97) translateY(3px); }
          70% { transform: scale(1.02) translateY(-1px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes sectionRipple {
          0% { transform: translateY(0); }
          25% { transform: translateY(8px); }
          55% { transform: translateY(-4px); }
          80% { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }
        @keyframes dropGlow {
          0% { opacity: 0.6; box-shadow: 0 0 6px rgba(255,255,255,0.3); }
          100% { opacity: 1; box-shadow: 0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.2); }
        }
        @keyframes taskLand {
          0% { transform: scale(1.03); }
          40% { transform: scale(0.98); }
          70% { transform: scale(1.01); }
          100% { transform: scale(1); }
        }
        @keyframes landFadeIn {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes rippleUp {
          0% { transform: translateY(0); }
          8% { transform: translateY(calc(-0.1 * var(--ripple-dist, 8px))); }
          20% { transform: translateY(calc(-0.5 * var(--ripple-dist, 8px))); }
          40% { transform: translateY(calc(-1 * var(--ripple-dist, 8px))); }
          100% { transform: translateY(0); }
        }
        @keyframes rippleDown {
          0% { transform: translateY(0); }
          8% { transform: translateY(calc(0.1 * var(--ripple-dist, 8px))); }
          20% { transform: translateY(calc(0.5 * var(--ripple-dist, 8px))); }
          40% { transform: translateY(var(--ripple-dist, 8px)); }
          100% { transform: translateY(0); }
        }
        .cb-add-btn:hover {
          background: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <TitleBar theme={theme} parallaxIntensity={parallaxIntensity} onParallaxChange={setParallaxIntensity} pivotMode={pivotMode} onPivotChange={setPivotMode} axisLock={axisLock} onAxisLockChange={setAxisLock} />
      <Confetti trigger={confetti.trigger} intensity={confetti.intensity} burstRect={confetti.burstRect || null} />
      <Toast message={toast.message} visible={toast.visible} type={toast.type} theme={theme} />

      <div
        style={{
          padding: "48px 24px 32px",
          minHeight: "100vh",
          animation: shaking ? `shake ${shakeSpeed} infinite` : "none",
        }}
      >

      {/* Session dropdown — sticky below title bar */}
      <div style={{
        position: "sticky",
        top: 32,
        zIndex: 500,
        paddingBottom: 8,
        display: "flex",
        alignItems: "center",
      }}>
        <SessionDropdown
          sessions={sessionList}
          activeId={activeSessionId}
          onSwitch={switchSession}
          onCreate={createSession}
          onRename={renameSession}
          onDelete={deleteSession}
          theme={theme}
        />
      </div>

      {/* Header — floats at a higher depth */}
      <div style={{
        marginBottom: 32,
        textAlign: "center",
        transform: `translate(${tilt.x * 6 * pScale}px, ${tilt.y * 4 * pScale}px)`,
        transition: "transform 0.15s ease-out",
      }}>
        <div style={{
          position: "relative",
          display: "inline-block",
          transform: `rotateY(${tilt.x * 3 * pScale}deg) rotateX(${-tilt.y * 2 * pScale}deg)`,
          transition: "transform 0.15s ease-out",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #FFE4C8 50%, #ffffff 100%)",
            borderRadius: 8,
            padding: "8px 24px",
            display: "inline-block",
          }}>
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && titleDraft.trim()) {
                  renameSession(activeSessionId, titleDraft.trim());
                  setEditingTitle(false);
                } else if (e.key === "Escape") {
                  setEditingTitle(false);
                }
              }}
              onBlur={() => {
                if (titleDraft.trim()) renameSession(activeSessionId, titleDraft.trim());
                setEditingTitle(false);
              }}
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#2d1200",
                letterSpacing: "-0.5px",
                fontFamily: "inherit",
                width: `${Math.max(3, titleDraft.length) * 0.65}em`,
                minWidth: 80,
              }}
            />
          ) : (
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                background: "linear-gradient(135deg, #2d1200 0%, #1a0800 50%, #2d1200 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
              }}
            >
              {activeSessionName}
            </h1>
          )}
          </div>
          {!editingTitle && (
            <button
              onClick={() => {
                setTitleDraft(activeSessionName);
                setEditingTitle(true);
              }}
              style={{
                position: "absolute",
                right: -28,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                transition: "opacity 0.15s",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
              title="Rename session"
            >
              &#9998;
            </button>
          )}
        </div>

        {/* Global progress — slight offset from header */}
        <div style={{
          marginTop: 16,
          maxWidth: 400,
          margin: "16px auto 0",
          transform: `translate(${tilt.x * 3 * pScale}px, ${tilt.y * 2 * pScale}px)`,
          transition: "transform 0.2s ease-out",
          position: "relative",
        }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: theme.textDim,
              marginBottom: 6,
            }}
          >
            <span>
              {doneTasks} of {totalTasks} tasks
            </span>
            <span>{globalPct}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 6,
              background: theme.progressBg,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${globalPct}%`,
                height: "100%",
                background:
                  globalPct === 100
                    ? theme.progressFillDone
                    : globalPct > 60
                    ? theme.progressFillMid
                    : theme.progressFill,
                borderRadius: 3,
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Sections — deeper layer, moves less */}
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        transform: `translate(${tilt.x * 2 * pScale}px, ${tilt.y * 1.5 * pScale}px)`,
        transition: "transform 0.2s ease-out",
        position: "relative",
      }}>

        {/* Quick-add section button */}
        {!quickAddOpen && (
          <button
            onClick={() => setQuickAddOpen(true)}
            style={{
              position: "absolute",
              right: 0,
              top: -28,
              background: "rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              borderRadius: 6,
              width: 26,
              height: 26,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.25)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
            title="Quick-add section"
          >
            +
          </button>
        )}

        {/* Quick-add inline input — appears at TOP of sections */}
        {quickAddOpen && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "10px 14px",
              background: theme.cardBg,
              borderRadius: 12,
              border: `1px dashed rgba(255,255,255,0.3)`,
              marginBottom: 12,
              animation: "fadeSlideIn 0.2s ease-out",
            }}
          >
            <input
              ref={quickAddRef}
              value={quickAddName}
              onChange={(e) => setQuickAddName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") quickAddSection();
                if (e.key === "Escape") {
                  setQuickAddOpen(false);
                  setQuickAddName("");
                }
              }}
              onBlur={(e) => {
                // Don't close if clicking the Add or × buttons
                if (e.relatedTarget?.closest?.("[data-quickadd-action]")) return;
                if (!quickAddName.trim()) {
                  setQuickAddOpen(false);
                  setQuickAddName("");
                }
              }}
              placeholder="New section name..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: theme.text,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                letterSpacing: "0.5px",
              }}
            />
            <button
              className="cb-add-btn"
              data-quickadd-action
              onClick={quickAddSection}
              style={{
                background: `${theme.accent}18`,
                border: `1px solid ${theme.accent}33`,
                color: "#000",
                borderRadius: 6,
                padding: "4px 14px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              Add
            </button>
            <button
              data-quickadd-action
              onClick={() => {
                setQuickAddOpen(false);
                setQuickAddName("");
              }}
              style={{
                background: "none",
                border: "none",
                color: theme.deleteDim,
                cursor: "pointer",
                fontSize: 14,
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {sections.length === 0 && !quickAddOpen && (
          <div style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div>Import a checklist or add a section to get started</div>
          </div>
        )}
        {sections.map((section, idx) => {
          // Compute animation wrapper styles
          let wrapStyle = {};
          if (reorderAnim) {
            const isMoving = reorderAnim.id === section.id;
            const isNeighbor = reorderAnim.neighborId === section.id;

            if (isMoving) {
              if (reorderAnim.phase === "lift") {
                wrapStyle = {
                  transform: "scale(1.05)",
                  zIndex: 10,
                  borderRadius: 12,
                  boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
                  transition: "transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease",
                  position: "relative",
                };
              } else if (reorderAnim.phase === "slide") {
                wrapStyle = {
                  transform: `scale(1.05) translateY(${reorderAnim.moveDistance}px)`,
                  zIndex: 10,
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  transition: "transform 0.5s cubic-bezier(0.22, 0.68, 0.35, 1.0), box-shadow 0.3s ease",
                  position: "relative",
                };
              } else if (reorderAnim.phase === "land") {
                wrapStyle = {
                  animation: "landBounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  zIndex: 10,
                  position: "relative",
                };
              }
            } else if (isNeighbor) {
              if (reorderAnim.phase === "slide") {
                wrapStyle = {
                  transform: `translateY(${reorderAnim.neighborDistance}px)`,
                  transition: "transform 0.5s cubic-bezier(0.22, 0.68, 0.35, 1.0)",
                  position: "relative",
                };
              } else if (reorderAnim.phase === "land") {
                wrapStyle = {
                  animation: "sectionRipple 0.5s ease-out",
                  position: "relative",
                };
              }
            }
          }

          return (
            <div
              key={section.id}
              ref={(el) => {
                if (el) sectionRefs.current.set(section.id, el);
                else sectionRefs.current.delete(section.id);
              }}
              style={wrapStyle}
            >
              <Section
                section={section}
                sectionIndex={idx}
                totalSections={sections.length}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
                onDeleteSection={deleteSectionFromList}
                onAddTask={addTask}
                onSetTimer={setTaskTimer}
                onCancelTimer={cancelTaskTimer}
                onTimerComplete={handleTimerComplete}
                onMoveUp={(id) => moveSection(id, "up")}
                onMoveDown={(id) => moveSection(id, "down")}
                theme={theme}
                mousePos={mousePos}
                pScale={pScale}
                pivotMode={pivotMode}
                axisLock={axisLock}
                dragTask={dragTask}
                dragOverTask={dragOverTask}
                onPointerDownDrag={handlePointerDownDrag}
                landedTaskId={landedTaskId}
                collapsingSlot={collapsingSlot}
              />
            </div>
          );
        })}

        {/* Add section + Import */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "12px 14px",
              background: theme.cardBg,
              borderRadius: 12,
              border: `1px dashed ${theme.cardBorder}`,
            }}
          >
            <input
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSection();
              }}
              placeholder="+ new section..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: theme.textMuted,
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                letterSpacing: "0.5px",
              }}
            />
            <button
              className="cb-add-btn"
              onClick={addSection}
              style={{
                background: `${theme.accent}18`,
                border: `1px solid ${theme.accent}33`,
                color: "#000",
                borderRadius: 6,
                padding: "4px 14px",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              Add
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt,.markdown"
            onChange={handleImportMarkdown}
            style={{ display: "none" }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: theme.cardBg,
              border: `1px dashed ${theme.importBorder}`,
              color: theme.importColor,
              borderRadius: 12,
              padding: "10px 14px",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              letterSpacing: "0.5px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.importHoverBg;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.cardBg;
            }}
          >
            📋 Import Checklist (.md)
          </button>
        </div>

        {/* Footer spacer */}
        <div style={{ height: 40 }} />
      </div>
      </div>{/* end shake container */}
    </div>
  );
}
