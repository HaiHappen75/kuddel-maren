/* =========================================================
   Kuddel & Maren — App-Logik
   Rendering · Sticky-Nav Scroll-Spy · Konfetti
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Kategorien & Chips aus DRINKS rendern ---------- */
  const menu = document.getElementById("menu");
  const track = document.getElementById("catnav-track");

  DRINKS.forEach(function (cat) {
    // Chip
    const chip = document.createElement("a");
    chip.className = "chip";
    chip.href = "#" + cat.id;
    chip.dataset.target = cat.id;
    chip.textContent = cat.title;
    track.appendChild(chip);

    // Sektion
    const section = document.createElement("section");
    section.className = "category";
    section.id = cat.id;

    const head = document.createElement("h2");
    head.className = "category__head";
    head.innerHTML =
      '<span class="category__emoji">' + cat.emoji + "</span>" +
      "<span>" + cat.title + "</span>";
    section.appendChild(head);

    const card = document.createElement("div");
    card.className = "category__card";
    cat.items.forEach(function (name) {
      const row = document.createElement("div");
      row.className = "drink";
      row.innerHTML = '<span class="drink__dot"></span><span>' + name + "</span>";
      card.appendChild(row);
    });
    section.appendChild(card);
    menu.appendChild(section);
  });

  const chips = Array.prototype.slice.call(track.querySelectorAll(".chip"));

  /* ---------- 2. Sanftes Scrollen + aktiven Chip mittig halten ---------- */
  chips.forEach(function (chip) {
    chip.addEventListener("click", function (e) {
      e.preventDefault();
      const el = document.getElementById(chip.dataset.target);
      if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  function setActive(id) {
    chips.forEach(function (chip) {
      const active = chip.dataset.target === id;
      chip.classList.toggle("is-active", active);
      if (active) {
        chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  }

  /* ---------- 3. Scroll-Spy via IntersectionObserver ---------- */
  const sections = DRINKS.map(function (c) { return document.getElementById(c.id); });
  const visible = new Map();

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible.set(entry.target.id, entry.intersectionRatio);
    });
    // wähle die Sektion mit der größten Sichtbarkeit
    let best = null, bestRatio = 0;
    visible.forEach(function (ratio, id) {
      if (ratio > bestRatio) { bestRatio = ratio; best = id; }
    });
    if (best) setActive(best);
  }, {
    rootMargin: "-30% 0px -55% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });
  sections.forEach(function (s) { if (s) observer.observe(s); });

  if (chips[0]) chips[0].classList.add("is-active");

  /* ---------- 4. Konfetti-Begrüßung ---------- */
  function fireConfetti() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    const colors = ["#ff2e97", "#16e0ff", "#c026ff", "#ffd166", "#3df5a0", "#ffffff"];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const N = Math.min(160, Math.round(window.innerWidth / 4));
    const pieces = [];
    for (let i = 0; i < N; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.cos(i) * 40),
        y: canvas.height * 0.28 + (Math.sin(i) * 20),
        vx: (((i * 37) % 100) / 100 - 0.5) * 14,
        vy: -(6 + ((i * 53) % 80) / 10),
        size: 5 + (i % 6),
        color: colors[i % colors.length],
        rot: (i % 360) * (Math.PI / 180),
        vr: ((i % 7) - 3) * 0.12,
        life: 0,
      });
    }

    const gravity = 0.32;
    const maxLife = 220;
    let frame = 0;

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach(function (p) {
        if (p.life > maxLife) return;
        alive = true;
        p.life++;
        p.vy += gravity;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        const fade = 1 - p.life / maxLife;
        ctx.save();
        ctx.globalAlpha = Math.max(0, fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      frame++;
      if (alive && frame < maxLife + 20) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.removeEventListener("resize", resize);
      }
    }
    requestAnimationFrame(tick);
  }

  if (!reduceMotion) {
    // kurz warten, damit Layout & Fonts stehen
    window.setTimeout(fireConfetti, 350);
  }
})();
