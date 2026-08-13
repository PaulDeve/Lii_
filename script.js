/* ============================================================
   CONFIGURACIÓN — edita aquí los datos personales fácilmente
   ============================================================ */
const CONFIG = {
  nombreElla: "Lii",
  apodoMio: "Pausito",
  // Fecha desde la que empezó a contar (año, mes(0-indexado), día, hora, min)
  fechaInicio: new Date(2025, 0, 1, 0, 0, 0),
  frasesSueltas: [
    "Lii detected ❤️",
    "Nivel de estrés: bájalo, por favor",
    "Recuerda tomar agüita",
    "Abrígate",
    "No olvides el bloqueador",
    "Ya desayunaste?",
    "No te me estreses",
    "Sonríe un poquito",
    "Te estoy vigilando… pero con cariño 👀",
    "Diagnóstico: demasiado bonita",
    "Te quiero",
    "jsjsjs",
    "Paul.exe dejó de funcionar xD"
  ],
  cartaLineas: [
    { text: "Lii…", pause: 500 },
    { text: "Quizá no siempre sé cómo decir las cosas", pause: 900 },
    { text: "A veces hago bromas pesadas", pause: 700 },
    { text: "A veces digo tonterías", pause: 700 },
    { text: "A veces me pongo demasiado serio", pause: 900 },
    { text: "Pero hay algo que sí tengo bastante claro…", pause: 1000 },
    { text: "Me importas :)", pause: 900, emphasis: true },
    { text: "Me gusta saber cómo estás", pause: 700 },
    { text: "Me gusta cuando me cuentas tus cosas", pause: 700 },
    { text: "Me gusta cuando nos reímos por cualquier tontería", pause: 800 },
    { text: "Y me gusta saber que, de alguna manera, terminamos formando parte del día", pause: 1100 },
    { text: "No sé exactamente qué nombre tendrá todo esto mañana…", pause: 1000 },
    { text: "Pero hoy sé que eres alguien muy especial para mí", pause: 600, emphasis: true }
  ],
  finalLineas: [
    "Gracias por llegar hasta aquí",
    "Y recuerda…",
    "Si algún día necesitas un lugar donde sentirte acompañada…",
    "Aquí tienes un pequeño espacio",
    "El mío"
  ]
};

/* ============================================================
   UTILIDADES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   CAMPO DE ESTRELLAS (canvas) — sutil, liviano para gama baja
   ============================================================ */
function initStarfield() {
  const canvas = $("#starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(120, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      twinkleOffset: Math.random() * Math.PI * 2
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const twinkle = prefersReducedMotion ? 1 : 0.5 + 0.5 * Math.sin(time / 900 + s.twinkleOffset);
      ctx.globalAlpha = 0.25 + twinkle * 0.6;
      ctx.fillStyle = "#cdbfff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) {
        s.y += s.speed * 0.15;
        if (s.y > h) s.y = 0;
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

/* ============================================================
   CORAZONES FLOTANTES / CONFETI
   ============================================================ */
function spawnHearts(count = 8, originEl = null) {
  const symbols = ["❤️", "💜", "✨", "💫"];
  let originX = window.innerWidth / 2;
  let originY = window.innerHeight / 2;

  if (originEl) {
    const rect = originEl.getBoundingClientRect();
    originX = rect.left + rect.width / 2;
    originY = rect.top + rect.height / 2;
  }

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "floating-heart";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const drift = (Math.random() - 0.5) * 220;
    el.style.setProperty("--drift", `${drift}px`);
    el.style.left = `${originX + (Math.random() - 0.5) * 60}px`;
    el.style.top = `${originY}px`;
    el.style.animationDuration = `${2.2 + Math.random() * 1.4}s`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* ============================================================
   PANTALLA INICIAL → CONTENIDO PRINCIPAL
   ============================================================ */
function initIntro() {
  const introScreen = $("#intro");
  const enterBtn = $("#enter-btn");
  const main = $("#main-content");

  enterBtn.addEventListener("click", async () => {
    introScreen.classList.add("leaving");
    await wait(prefersReducedMotion ? 0 : 750);
    introScreen.remove();
    main.hidden = false;
    window.scrollTo({ top: 0 });
    initMissionTrack();
  });
}

/* ============================================================
   CONTADOR EN VIVO
   ============================================================ */
function initCounter() {
  const els = {
    days: $("#count-days"),
    hours: $("#count-hours"),
    mins: $("#count-mins"),
    secs: $("#count-secs")
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diffMs = Date.now() - CONFIG.fechaInicio.getTime();
    if (diffMs < 0) {
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = "00";
      return;
    }
    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   SECCIÓN 1 — TARJETAS FLIP
   ============================================================ */
function initFlipCards() {
  $$(".flip-card").forEach((card) => {
    card.addEventListener("click", () => {
      const expanded = card.getAttribute("aria-expanded") === "true";
      card.setAttribute("aria-expanded", String(!expanded));
    });
  });
}

/* ============================================================
   SECCIÓN 2 — EL ASTRONAUTA
   ============================================================ */
function initAstro() {
  const whyBtn = $("#astro-why-btn");
  const backBtn = $("#astro-back-btn");
  const nextHint = $("#astro-next-hint");
  const astroEmoji = $("#astro-emoji");

  const showStep = (step) => {
    $$(".astro-step").forEach((el) => {
      if (Number(el.dataset.step) === step) {
        el.hidden = false;
      }
    });
  };

  whyBtn.addEventListener("click", async () => {
    whyBtn.hidden = true;
    astroEmoji.style.transform = "scale(1.15)";
    showStep(3);
    await wait(1000);
    showStep(4);
    backBtn.hidden = false;
    nextHint.hidden = false;
    spawnHearts(6, astroEmoji);
  });

  backBtn.addEventListener("click", () => {
    $("#sec-likes").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

/* ============================================================
   SECCIÓN 4 — DIAGNÓSTICO (¿Hay cura?)
   ============================================================ */
function initDiagnosis() {
  const cureBtn = $("#cure-btn");
  const answer = $("#cure-answer");

  cureBtn.addEventListener("click", async () => {
    cureBtn.disabled = true;
    answer.hidden = false;
    answer.textContent = "No.";
    await wait(1000);
    answer.textContent = "No. Y sinceramente… tampoco quiero encontrarla";
  });
}

/* ============================================================
   SECCIÓN 5 — LISTA DE PENDIENTES
   ============================================================ */
function initTodoList() {
  const checkboxes = $$("#todo-list input[type='checkbox']");
  const complete = $("#todo-complete");

  checkboxes.forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) {
        spawnHearts(2, box);
      }
      const allChecked = checkboxes.every((b) => b.checked);
      if (allChecked) {
        complete.hidden = false;
        spawnHearts(8);
      } else {
        complete.hidden = true;
      }
    });
  });
}

/* ============================================================
   SECCIÓN 6 — CARTA TYPEWRITER
   ============================================================ */
function initLetter() {
  const body = $("#letter-body");
  const skipBtn = $("#letter-skip");
  let done = false;
  let cancelled = false;

  async function playLetter() {
    body.innerHTML = "";
    for (const line of CONFIG.cartaLineas) {
      if (cancelled) break;
      const p = document.createElement("p");
      if (line.emphasis) p.classList.add("emphasis");
      p.textContent = line.text;
      body.appendChild(p);
      await wait(prefersReducedMotion ? 0 : line.pause);
    }
    done = true;
    skipBtn.textContent = "Leído ❤️";
    skipBtn.disabled = true;
  }

  skipBtn.addEventListener("click", () => {
    if (done) return;
    cancelled = true;
    body.innerHTML = "";
    CONFIG.cartaLineas.forEach((line) => {
      const p = document.createElement("p");
      if (line.emphasis) p.classList.add("emphasis");
      p.textContent = line.text;
      p.style.animationDelay = "0s";
      body.appendChild(p);
    });
    done = true;
    skipBtn.textContent = "Leído ❤️";
    skipBtn.disabled = true;
  });

  // Se dispara cuando la sección entra en pantalla
  const section = $("#sec-letter");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && body.children.length === 0) {
        playLetter();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(section);
}

/* ============================================================
   SECCIÓN 7 — BOTÓN TRAMPA
   ============================================================ */
function initTrapButton() {
  const noBtn = $("#trap-no");
  const yesBtn = $("#trap-yes");
  const question = $("#trap-question");
  const result = $("#trap-result");
  const container = $(".trap-buttons");
  let dodgeCount = 0;

  function dodge() {
    const maxX = container.clientWidth - noBtn.offsetWidth - 10;
    const maxY = 40;
    const x = (Math.random() - 0.5) * Math.min(maxX, 160);
    const y = (Math.random() - 0.5) * maxY;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    dodgeCount++;
    if (dodgeCount >= 4) {
      question.textContent = `Lii, vamos… sabemos que ese botón no representa tus verdaderos sentimientos xD`;
    }
  }

  noBtn.addEventListener("mouseenter", () => { if (!prefersReducedMotion) dodge(); });
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dodge();
  });

  yesBtn.addEventListener("click", () => {
    result.hidden = false;
    yesBtn.disabled = true;
    noBtn.disabled = true;
    spawnHearts(10, yesBtn);
  });
}

/* ============================================================
   SECCIÓN 8 — FINAL (typewriter + reinicio)
   ============================================================ */
function initFinal() {
  const box = $("#final-typewriter");
  const loveText = $("#final-love");
  const sign = $("#final-sign");
  const restartBtn = $("#restart-btn");
  let played = false;

  async function playFinal() {
    if (played) return;
    played = true;
    for (const line of CONFIG.finalLineas) {
      const p = document.createElement("p");
      p.textContent = line;
      box.appendChild(p);
      await wait(prefersReducedMotion ? 0 : 950);
    }
    await wait(400);
    loveText.hidden = false;
    sign.hidden = false;
    restartBtn.hidden = false;
    spawnHearts(10);
  }

  const section = $("#sec-final");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) playFinal();
    });
  }, { threshold: 0.5 });
  observer.observe(section);

  restartBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

/* ============================================================
   EASTER EGG — "No tocar"
   ============================================================ */
function initEasterEgg() {
  const btn = $("#easter-egg");
  const overlay = $("#easter-overlay");
  const textEl = $("#easter-text");

  const lines = [
    "Te dije que no tocaras 😭",
    "Pero ya que estás aquí…",
    "Te quiero mucho. ❤️"
  ];

  btn.addEventListener("click", async () => {
    overlay.hidden = false;
    for (const line of lines) {
      textEl.style.animation = "none";
      // Forzar reflow para reiniciar la animación
      void textEl.offsetWidth;
      textEl.style.animation = "";
      textEl.textContent = line;
      await wait(1500);
    }
    await wait(2200);
    overlay.hidden = true;
  });

  overlay.addEventListener("click", () => { overlay.hidden = true; });
}

/* ============================================================
   MÚSICA (botón flotante, sin autoplay)
   ============================================================ */
function initMusic() {
  const btn = $("#music-toggle");
  const audio = $("#bg-music");
  let playing = false;

  btn.addEventListener("click", async () => {
    if (!playing) {
      try {
        await audio.play();
        playing = true;
        btn.setAttribute("aria-pressed", "true");
        $(".music-label", btn).textContent = "Pausar";
      } catch (err) {
        // Si musica.mp3 no existe o falla, la página sigue funcionando normalmente.
        console.warn("No se pudo reproducir la música (¿falta musica.mp3?)", err);
      }
    } else {
      audio.pause();
      playing = false;
      btn.setAttribute("aria-pressed", "false");
      $(".music-label", btn).textContent = "Música";
    }
  });
}

/* ============================================================
   RUTA DE MISIÓN (astronauta que recorre el progreso)
   ============================================================ */
function initMissionTrack() {
  const astro = $("#mission-astronaut");
  const sections = $$(".story-section");
  if (!astro || sections.length === 0) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
    astro.style.top = `${progress * 100}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ============================================================
   FRASES SUELTAS OCASIONALES (easter details en whispers)
   ============================================================ */
function initWhispers() {
  const whisperEl = $(".whisper");
  if (!whisperEl) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % CONFIG.frasesSueltas.length;
    whisperEl.style.opacity = "0";
    setTimeout(() => {
      whisperEl.textContent = CONFIG.frasesSueltas[i];
      whisperEl.style.opacity = "1";
    }, 300);
  }, 6000);
  whisperEl.style.transition = "opacity 0.3s ease";
}

/* ============================================================
   INICIALIZACIÓN GENERAL
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initStarfield();
  initIntro();
  initFlipCards();
  initAstro();
  initTodoList();
  initLetter();
  initFinal();
  initEasterEgg();
  initMusic();
  initWhispers();
});
