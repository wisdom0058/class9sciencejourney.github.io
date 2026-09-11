/* ============================================================
   Journey Inside the Atom — Chapter 8
   Animated demo labs (pure SVG/DOM, works fully offline)
   Each lab is attached to <div class="demo" data-demo="id">.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ELEM = { 1: "Hydrogen", 2: "Helium", 3: "Lithium", 4: "Beryllium", 5: "Boron", 6: "Carbon",
    7: "Nitrogen", 8: "Oxygen", 9: "Fluorine", 10: "Neon", 11: "Sodium", 12: "Magnesium",
    13: "Aluminium", 14: "Silicon", 15: "Phosphorus", 16: "Sulfur", 17: "Chlorine", 18: "Argon",
    19: "Potassium", 20: "Calcium" };
  var SYM = { 1: "H", 2: "He", 3: "Li", 4: "Be", 5: "B", 6: "C", 7: "N", 8: "O", 9: "F", 10: "Ne",
    11: "Na", 12: "Mg", 13: "Al", 14: "Si", 15: "P", 16: "S", 17: "Cl", 18: "Ar", 19: "K", 20: "Ca" };

  function shellFill(z) {                       // Bohr-Bury distribution (Z up to 20)
    var out = [], rem = z;
    var k = Math.min(2, rem); out.push(k); rem -= k;
    if (rem > 0) { var l = Math.min(8, rem); out.push(l); rem -= l; }
    if (rem > 0) { var m = Math.min(8, rem); out.push(m); rem -= m; }   // outermost shell stops at 8
    if (rem > 0) { out.push(rem); }
    return out;
  }

  function lab(id, build) {
    $$('.demo[data-demo="' + id + '"]').forEach(function (root) { try { build(root); } catch (e) {} });
  }
  function setCap(root, html) { var c = $('.cap', root); if (c) c.innerHTML = html; }
  function bar(root) { return $('.lab-bar', root); }
  function stage(root) { return $('.stage', root); }
  function btn(label, fn, cls) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "lab-btn" + (cls ? " " + cls : "");
    b.innerHTML = label; b.addEventListener("click", fn); return b;
  }
  function sel(opts, fn) {
    var s = document.createElement("select");
    s.className = "lab-btn";
    opts.forEach(function (o) {
      var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; s.appendChild(op);
    });
    s.addEventListener("change", function () { fn(s.value); });
    return s;
  }
  function range(min, max, val, fn) {
    var r = document.createElement("input");
    r.type = "range"; r.min = min; r.max = max; r.value = val;
    r.style.width = "150px";
    r.addEventListener("input", function () { fn(+r.value); });
    return r;
  }
  function chip(t) { var s = document.createElement("span"); s.className = "lab-chip"; s.innerHTML = t; return s; }
  function lbl(t) { var s = document.createElement("label"); s.innerHTML = t; return s; }

  var GOLD = "#ffd24d", BLUE = "#8fb2ff", PINK = "#ff9ad5", GREEN = "#7ef0c0";

  /* ==================================================== 1. ROOTS */
  lab("roots", function (root) {
    var level = 0, MAX = 4;
    var S = stage(root); S.innerHTML =
      '<svg viewBox="0 0 640 230" width="100%" height="230" role="img" aria-label="dividing clay">' +
      '<g id="balls"></g></svg>';
    var B = bar(root);
    var capTxt = ["<b>Level 0:</b> one piece of matter (dravya).",
      "<b>Level 1:</b> divide once \u2014 two pieces.",
      "<b>Level 2:</b> divide again \u2014 four pieces.",
      "<b>Level 3:</b> eight pieces \u2014 getting very small.",
      "<b>Level 4:</b> the <b>parmanu</b> \u2014 Kanada reasoned that division must stop here. " +
      "A parmanu is indivisible and cannot be cut further."];
    function draw() {
      var n = Math.pow(2, Math.min(level, MAX)), g = $("#balls", S), out = "", i;
      var cols = Math.ceil(Math.sqrt(n)), r = Math.max(7, 46 / Math.sqrt(n) + 3);
      for (i = 0; i < n; i++) {
        var x = 60 + (i % cols) * (520 / Math.max(cols - 1, 1) || 0);
        var y = 60 + Math.floor(i / Math.max(cols, 1)) * (110 / Math.max(Math.ceil(n / cols), 1));
        out += '<circle cx="' + (n === 1 ? 320 : x) + '" cy="' + (n === 1 ? 115 : y) + '" r="' + r +
          '" fill="url(#clay)" stroke="#8a5a2b" stroke-width="1.5"/>';
      }
      out = '<defs><radialGradient id="clay"><stop offset="0%" stop-color="#ffbc73"/>' +
        '<stop offset="100%" stop-color="#c97a3a"/></radialGradient></defs>' + out;
      if (level >= MAX) {
        out += '<text x="320" y="215" text-anchor="middle" fill="#ffd24d" font-size="16" ' +
          'font-weight="700">parmanu \u2014 cannot be divided further</text>';
      }
      g.innerHTML = out;
    }
    draw();
    B.appendChild(btn("\u2702\uFE0F Divide", function () {
      if (level < MAX) { level++; draw(); }
      setCap(root, capTxt[level]);
    }));
    B.appendChild(btn("\U0001F504 Start again", function () { level = 0; draw(); setCap(root, capTxt[0]); }));
    B.appendChild(btn("\U0001F517 Show a dyad (pair)", function () {
      S.querySelector("svg").innerHTML = '<defs><radialGradient id="clay2"><stop offset="0%" ' +
        'stop-color="#ffbc73"/><stop offset="100%" stop-color="#c97a3a"/></radialGradient></defs>' +
        '<circle cx="300" cy="110" r="26" fill="url(#clay2)" stroke="#8a5a2b" stroke-width="2"/>' +
        '<circle cx="352" cy="110" r="26" fill="url(#clay2)" stroke="#8a5a2b" stroke-width="2"/>' +
        '<text x="326" y="185" text-anchor="middle" fill="#ffd24d" font-size="15" font-weight="700">' +
        'dyad = two parmanus joined</text>';
      setCap(root, "Parmanus do not stay alone. Two join to form a <b>dyad</b>.");
    }));
    B.appendChild(btn("\U0001F517 Show a triad (triplet)", function () {
      S.querySelector("svg").innerHTML = '<circle cx="280" cy="80" r="24" fill="#c97a3a" stroke="#8a5a2b" stroke-width="2"/>' +
        '<circle cx="340" cy="80" r="24" fill="#c97a3a" stroke="#8a5a2b" stroke-width="2"/>' +
        '<circle cx="310" cy="135" r="24" fill="#c97a3a" stroke="#8a5a2b" stroke-width="2"/>' +
        '<text x="310" y="205" text-anchor="middle" fill="#ffd24d" font-size="15" font-weight="700">' +
        'triad = three parmanus joined</text>';
      setCap(root, "Three parmanus form a <b>triad</b>. Dyads and triads build all substances.");
    }));
    setCap(root, capTxt[0]);
  });

  /* ==================================================== 2. THOMSON */
  lab("thomson", function (root) {
    var volt = 60, magnet = false, mat = "iron";
    var S = stage(root); S.innerHTML =
      '<svg viewBox="0 0 660 250" width="100%" height="240" role="img" aria-label="cathode ray tube">' +
      '<rect x="20" y="55" width="620" height="140" rx="34" fill="#0d1230" stroke="#5b64b8" stroke-width="2"/>' +
      '<rect x="52" y="75" width="12" height="100" rx="5" fill="#9aa3d8"/>' +
      '<text x="58" y="205" fill="#9aa3d8" font-size="13" text-anchor="middle">cathode \u2212</text>' +
      '<rect x="430" y="75" width="12" height="100" rx="5" fill="#ff9a6a"/>' +
      '<text x="436" y="205" fill="#ff9a6a" font-size="13" text-anchor="middle">anode +</text>' +
      '<rect x="470" y="60" width="8" height="130" fill="#12351f" stroke="#7ef0c0"/>' +
      '<text x="560" y="205" fill="#7ef0c0" font-size="13" text-anchor="middle">ZnS screen</text>' +
      '<path id="beam" d="" stroke="#7ef0c0" stroke-width="4" fill="none" stroke-linecap="round" ' +
      'stroke-dasharray="14 8"><animate attributeName="stroke-dashoffset" from="44" to="0" ' +
      'dur="0.6s" repeatCount="indefinite"/></path>' +
      '<circle id="spot" cx="474" cy="125" r="9" fill="#c8ffe6" opacity=".9"/>' +
      '<text x="330" y="35" fill="#c9cff5" font-size="14" text-anchor="middle">' +
      'low-pressure gas discharge tube</text></svg>';
    function path() {
      var bend = magnet ? 40 : 0;
      var d = "M64 125 C 200 125, 260 " + (125 - bend) + ", 470 " + (125 - 2 * bend) + "";
      $("#beam", S).setAttribute("d", d);
      $("#spot", S).setAttribute("cy", 125 - 2 * bend);
      $("#beam", S).setAttribute("stroke-width", (2 + volt / 30).toFixed(1));
      $("#spot", S).setAttribute("r", (4 + volt / 22).toFixed(1));
    }
    var B = bar(root);
    B.appendChild(lbl("\u26A1 Voltage")); B.appendChild(range(0, 100, volt, function (v) { volt = v; path(); }));
    B.appendChild(btn("\U0001F9F2 Toggle magnet on/off", function () { magnet = !magnet; path(); setCap(root, magnet ?
      "The magnet bends the beam \u2014 so cathode rays are <b>charged particles</b>, not ordinary light. They bend away from the negative pole, so the charge is <b>negative</b>." :
      "With no field the beam goes straight from the <b>cathode</b> to the <b>anode</b> and makes a bright spot on the ZnS screen."); }));
    var s = sel([["iron", "Cathode: iron"], ["copper", "Cathode: copper"], ["aluminium", "Cathode: aluminium"],
      ["carbon", "Cathode: carbon"]], function (v) { mat = v; });
    B.appendChild(lbl("Cathode material")); B.appendChild(s);
    B.appendChild(sel([["air", "Gas: air"], ["hydrogen", "Gas: hydrogen"], ["nitrogen", "Gas: nitrogen"]],
      function () { }));
    B.appendChild(btn("\U0001F50D Same rays in every case?", function () {
      setCap(root, "Try any cathode material and any gas: the rays are <b>identical</b> every time. " +
        "That is why Thomson concluded that <b>electrons are present in all atoms</b> of all elements.");
    }));
    path();
    setCap(root, "Cathode rays are <b>streams of electrons</b> travelling from the negative cathode to the " +
      "positive anode. Increase the voltage and the beam gets brighter and thicker.");
  });

  /* ==================================================== 3. GOLD FOIL */
  lab("goldfoil", function (root) {
    var mode = "rutherford", running = true, parts = [], counts = { s: 0, d: 0, b: 0 }, last = 0, acc = 0;
    var nuclei = [30, 62, 94, 126, 158, 190, 222];
    var S = stage(root); S.innerHTML =
      '<svg viewBox="0 0 660 260" width="100%" height="260" role="img" aria-label="gold foil scattering">' +
      '<rect x="0" y="0" width="660" height="260" fill="none"/>' +
      '<rect x="500" y="8" width="34" height="244" fill="#b8860b" opacity=".22" stroke="#ffd24d" ' +
      'stroke-opacity=".5"/>' +
      '<g id="nuc">' + nuclei.map(function (y) {
        return '<circle cx="517" cy="' + y + '" r="4" fill="#ffe9a8"/>';
      }).join("") + '</g>' +
      '<text x="517" y="20" fill="#ffd24d" font-size="12" text-anchor="middle">gold foil</text>' +
      '<text x="70" y="26" fill="#8fb2ff" font-size="13">\u03b1 source \u2192</text>' +
      '<g id="ps"></g></svg>';
    $("#nuc", S).style.display = "block";
    var B = bar(root);
    B.appendChild(chip("Mode:"));
    B.appendChild(sel([["rutherford", "\U0001F947 Rutherford's nucleus"], ["thomson", "\U0001F36E Thomson's plum pudding"]],
      function (v) {
        mode = v; counts = { s: 0, d: 0, b: 0 }; parts = [];
        setCap(root, mode === "rutherford" ?
          "<b>Rutherford mode:</b> most \u03b1-particles go straight, some are sharply deflected and a few " +
          "bounce straight back \u2014 only possible if a tiny, very dense positive nucleus is present." :
          "<b>Thomson mode:</b> the positive charge is spread everywhere, so nothing can ever bounce back; " +
          "at most a slight bend. Compare the counters!");
      }));
    B.appendChild(btn("\u23F8 Pause / play", function () { running = !running; }));
    B.appendChild(btn("\U0001F504 Reset counters", function () { counts = { s: 0, d: 0, b: 0 }; parts = []; }));
    var out = chip("");
    B.appendChild(out);
    function spawn() {
      var y = 26 + Math.random() * 205;
      var near = nuclei.reduce(function (a, b) { return Math.abs(b - y) < Math.abs(a - y) ? b : a; }, nuclei[0]);
      var d = Math.abs(near - y), kind = "s";
      if (mode === "rutherford") {
        if (d < 7) kind = "b"; else if (d < 34) kind = "d";
      } else { if (d < 26) kind = "d"; }
      parts.push({ y: y, x: 20, kind: kind, dir: 1, ang: (Math.random() * 0.55 + (y < near ? -1 : 1) * 0.45),
        done: false });
    }
    function tick(ts) {
      var dt = Math.min(40, ts - last || 16); last = ts;
      acc += dt;
      if (running && acc > 170 && parts.length < 130) { acc = 0; spawn(); }
      var g = $("#ps", S), html = "";
      parts.forEach(function (p) {
        var sp = 6.2 * dt / 16;
        if (p.kind === "s") { p.x += sp; }
        else if (p.kind === "d") {
          if (p.x < 495) { p.x += sp; }
          else { p.x += sp; p.y += Math.tan(p.ang) * sp; }
        } else {                       // bounce back
          if (p.x < 495) { p.x += sp; } else { p.x -= sp; p.y -= 0.12 * sp; }
        }
        var col = p.kind === "s" ? GOLD : (p.kind === "d" ? PINK : "#ff6b6b");
        html += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="3.1" fill="' + col + '"/>';
        if (p.x > 680 || p.x < -20 || p.y < -20 || p.y > 280) {
          if (!p.done) { p.done = true; if (p.kind === "s") counts.s++; else if (p.kind === "d") counts.d++; else counts.b++; }
        }
      });
      parts = parts.filter(function (p) { return !p.done; });
      g.innerHTML = html;
      out.innerHTML = "straight: <b>" + counts.s + "</b> \u00b7 deflected: <b>" + counts.d +
        "</b> \u00b7 bounced back: <b>" + counts.b + "</b>";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    setCap(root, "Watch the three kinds of results. In Rutherford's model only a very small, extremely dense " +
      "positive nucleus can throw an \u03b1-particle straight back \u2014 that single observation demolished " +
      "Thomson's model.");
  });

  /* ==================================================== 4. BOHR */
  lab("bohr", function (root) {
    var z = 11, cfg = shellFill(z), jump = 0, msg = "";
    var S = stage(root); S.innerHTML =
      '<svg viewBox="0 0 560 300" width="100%" height="290" role="img" aria-label="Bohr atom">' +
      '<defs><radialGradient id="nucG"><stop offset="0%" stop-color="#ffe9a8"/>' +
      '<stop offset="100%" stop-color="#e0a020"/></radialGradient></defs>' +
      '<circle cx="280" cy="150" r="150" fill="none" stroke="#5b64b8" stroke-dasharray="4 6"/>' +
      '<circle cx="280" cy="150" r="108" fill="none" stroke="#5b64b8" stroke-dasharray="4 6"/>' +
      '<circle cx="280" cy="150" r="64" fill="none" stroke="#5b64b8" stroke-dasharray="4 6"/>' +
      '<text x="280" y="14" fill="#8fb2ff" font-size="12" text-anchor="middle">N</text>' +
      '<text x="418" y="152" fill="#8fb2ff" font-size="12">M</text>' +
      '<text x="380" y="52" fill="#8fb2ff" font-size="12">L</text>' +
      '<text x="330" y="96" fill="#8fb2ff" font-size="12">K</text>' +
      '<circle cx="280" cy="150" r="17" fill="url(#nucG)"/>' +
      '<text x="280" y="155" text-anchor="middle" font-size="12" font-weight="700" fill="#6b4a00">+</text>' +
      '<g id="els"></g><g id="phot"></g>' +
      '<text id="note" x="280" y="292" text-anchor="middle" fill="#ffd24d" font-size="13"></text></svg>';
    var radii = [64, 108, 150];
    function draw() {
      var g = $("#els", S), out = "", shells = [0, 1, 2];
      cfg = shellFill(z);
      shells.forEach(function (si) {
        var n = cfg[si] || 0, r = radii[si];
        for (var i = 0; i < n; i++) {
          var a = (i / Math.max(n, 1)) * Math.PI * 2 + si * 0.4 + jump * (si === cfg.length - 1 ? 0.14 : 0);
          var x = 280 + Math.cos(a) * r, y = 150 + Math.sin(a) * r;
          out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6" fill="' +
            (si === cfg.length - 1 ? GREEN : BLUE) + '"/>';
        }
      });
      g.innerHTML = out;
      $("#note", S).textContent = msg || (ELEM[z] + "  \u00b7  " + z + " electrons  \u00b7  configuration " +
        cfg.join(", "));
      $("#phot").innerHTML = msg ? '<text x="280" y="278" text-anchor="middle" font-size="15" ' +
        (msg.indexOf("absorb") > -1 ? 'fill="#7ef0c0"' : 'fill="#ff9ad5"') + '>' +
        (msg.indexOf("absorb") > -1 ? "\u2b06 photon absorbed" : "\u2b07 photon released") + '</text>' : "";
    }
    var B = bar(root);
    B.appendChild(lbl("Element"));
    B.appendChild(sel([[1, "Hydrogen"], [2, "Helium"], [3, "Lithium"], [6, "Carbon"], [9, "Fluorine"],
      [11, "Sodium"], [12, "Magnesium"], [17, "Chlorine"], [18, "Argon"]],
      function (v) { z = +v; jump = 0; msg = ""; draw(); }));
    B.appendChild(btn("\u2b06 Give energy (electron jumps out)", function () {
      msg = "The electron absorbs a fixed amount of energy and jumps to a higher shell.";
      jump += 1; draw();
      setTimeout(function () { jump = 0; draw(); }, 1400);
    }));
    B.appendChild(btn("\u2b07 Lose energy (falls back in)", function () {
      msg = "The electron releases a fixed amount of energy as it falls to a lower shell.";
      draw(); setTimeout(function () { msg = ""; draw(); }, 1800);
    }));
    draw();
    setCap(root, "In Bohr's model an electron stays in its shell without losing energy. It changes shells only " +
      "by <b>absorbing</b> energy (jump outward) or <b>releasing</b> energy (fall inward). That is why the " +
      "atom never collapses.");
  });

  /* ==================================================== 5. NEUTRON */
  lab("neutron", function (root) {
    var p = 1, n = 0;
    var S = stage(root); S.innerHTML =
      '<svg viewBox="0 0 560 280" width="100%" height="270" role="img" aria-label="nucleus builder">' +
      '<circle cx="280" cy="130" r="112" fill="#1b2050" stroke="#4b54a8" stroke-dasharray="5 7"/>' +
      '<g id="nuc"></g>' +
      '<text id="mass" x="280" y="266" text-anchor="middle" fill="#ffd24d" font-size="14"></text></svg>';
    function draw() {
      var total = p + n, g = $("#nuc", S), out = "", i;
      var maxr = 92, r = Math.min(maxr, 20 + total * 7);
      for (i = 0; i < total; i++) {
        var ang = i * 2.399, rad = 0.55 * r * Math.sqrt(i + 0.6) / Math.sqrt(total + 0.6);
        var x = 280 + Math.cos(ang) * rad * 1.15, y = 130 + Math.sin(ang) * rad;
        var isP = i < p;
        out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="13" fill="' +
          (isP ? "#ff8f6a" : "#9aa3d8") + '" stroke="#0d1230" stroke-width="1"/>' +
          '<text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle" ' +
          'font-size="11" font-weight="700" fill="#11142c">' + (isP ? "+" : "0") + '</text>';
      }
      g.innerHTML = out;
      var sym = SYM[p] || "?", name = ELEM[p] || "unknown";
      $("#mass", S).innerHTML = "protons " + p + "  \u00b7  neutrons " + n + "  \u00b7  charge " +
        (p - p > 0 ? "" : "") + (p + n > 0 ? "" : "") + "0  \u00b7  mass number A = " + (p + n) +
        "  \u00b7   " + (p >= 1 ? name + " (" + sym + "), Z = " + p : "");
      return { sym: sym, name: name };
    }
    var B = bar(root);
    B.appendChild(btn("\u2795 Add proton p\u207a", function () { if (p < 20) { p++; draw(); } }));
    B.appendChild(btn("\u2795 Add neutron n\u2070", function () { if (n < 24) { n++; draw(); } }));
    B.appendChild(btn("\u2796 Remove proton", function () { if (p > 1) { p--; draw(); } }));
    B.appendChild(btn("\u2796 Remove neutron", function () { if (n > 0) { n--; draw(); } }));
    B.appendChild(btn("\U0001F504 Reset", function () { p = 1; n = 0; draw(); }));
    draw();
    setCap(root, "The <b>charge depends only on the protons</b> (red, +) \u2014 neutrons (grey, 0) add mass " +
      "but no charge. Ordinary hydrogen is 1 proton + 0 neutrons; adding neutrons gives deuterium and " +
      "tritium, which are heavier isotopes of the same element.");
  });

  /* ==================================================== 6. SYMBOLS */
  lab("symbols", function (root) {
    var data = [
      ["Hydrogen", "H", "first letter only", "English", "Hydrogen"],
      ["Cobalt", "Co", "first letter capital + second small", "English", "Cobalt"],
      ["Chlorine", "Cl", "first letter + another letter of the name", "English", "Chlorine"],
      ["Zinc", "Zn", "first letter + another letter (Z was taken)", "English", "Zinc"],
      ["Iron", "Fe", "from the Latin name", "Latin \u2014 Ferrum", "Iron"],
      ["Copper", "Cu", "from the Latin name", "Latin \u2014 Cuprum", "Copper"],
      ["Gold", "Au", "from the Latin name", "Latin \u2014 Aurum", "Gold"],
      ["Mercury", "Hg", "from the Greek name", "Greek \u2014 Hydrargyros", "Mercury"],
      ["Tungsten", "W", "from the German name", "German \u2014 Wolfram", "Tungsten"],
      ["Sodium", "Na", "from the Latin name", "Latin \u2014 Natrium", "Sodium"],
      ["Potassium", "K", "from the Latin name", "Latin \u2014 Kalium", "Potassium"],
      ["Lead", "Pb", "from the Latin name", "Latin \u2014 Plumbum", "Lead"]
    ];
    var S = stage(root);
    S.innerHTML = '<div class="sym-grid">' + data.map(function (d, i) {
      return '<button class="sym-card" data-i="' + i + '"><b>' + d[1] + '</b><span>' + d[0] + '</span></button>';
    }).join("") + '</div><div id="sym-info" class="sym-info"></div>';
    var B = bar(root);
    function show(i) {
      var d = data[i];
      $("#sym-info", S).innerHTML = '<b>Symbol: ' + d[1] + '</b> \u2014 ' + d[0] +
        '<br>Rule used: ' + d[2] + '. Source name: ' + d[3] + '.' +
        '<br>First letter <b>capital</b>, second letter <b>lowercase</b> \u2192 ' + d[1] +
        ' follows the IUPAC rule.' + (d[1].length === 1 ? " A one-letter symbol is allowed when it is free." : "");
    }
    $$(".sym-card", S).forEach(function (b) { b.addEventListener("click", function () { show(+b.getAttribute("data-i")); }); });
    show(0);
    var game = [["Co", 1], ["CO", 0], ["AL", 0], ["Al", 1], ["ZN", 0], ["Zn", 1], ["Fe", 1], ["fe", 0]];
    B.appendChild(btn("\U0001F3B2 Symbol Check game", function () {
      var pick = game[Math.floor(Math.random() * game.length)];
      setCap(root, "Symbol shown: <b style='font-size:20px'>" + pick[0] + "</b> \u2014 is it written " +
        "correctly as per IUPAC rules? (Tap the button again for a new symbol. Correct answers: <b>Co, Al, " +
        "Zn, Fe</b> are right; <b>CO, AL, ZN, fe</b> break the capital/small letter rule.)");
    }));
    setCap(root, "Tap any element to see <b>how its symbol was built</b>: which letter is capital, which is " +
      "small, and whether the name comes from English, Latin, Greek or German.");
  });

  /* ==================================================== 7. MASS NUMBER */
  lab("massnumber", function (root) {
    var p = 6, n = 6;
    var S = stage(root);
    S.innerHTML = '<div class="big-note" id="nota"></div>';
    function draw() {
      var a = p + n, z = p, sym = SYM[z] || "X", name = ELEM[z] || "unknown element";
      $("#nota", S).innerHTML =
        '<div class="notation"><sup>' + a + '</sup><sub>' + z + '</sub>' + sym + '</div>' +
        '<div class="nota-rows">' +
        '<div><span>Atomic number Z</span><b>' + z + '</b></div>' +
        '<div><span>Mass number A</span><b>' + a + '</b></div>' +
        '<div><span>Protons</span><b>' + p + '</b></div>' +
        '<div><span>Neutrons (A \u2212 Z)</span><b>' + n + '</b></div>' +
        '<div><span>Electrons (neutral atom)</span><b>' + z + '</b></div>' +
        '<div><span>Element</span><b>' + name + ' (' + sym + ')</b></div></div>' +
        '<div class="nota-eq">A = protons + neutrons = ' + p + ' + ' + n + ' = <b>' + a + '</b>' +
        ' &nbsp; \u00b7 &nbsp; neutrons = A \u2212 Z = ' + a + ' \u2212 ' + z + ' = <b>' + n + '</b></div>';
    }
    var B = bar(root);
    B.appendChild(lbl("Protons (Z)")); B.appendChild(range(1, 20, p, function (v) { p = v; draw(); }));
    B.appendChild(lbl("Neutrons")); B.appendChild(range(0, 30, n, function (v) { n = v; draw(); }));
    B.appendChild(btn("\U0001F504 Carbon-12", function () { p = 6; n = 6; $$("input[type=range]", B).forEach(function (r, i) { r.value = i ? 6 : 6; }); draw(); }));
    draw();
    setCap(root, "Now the notation %sX is never a mystery: the top number is the mass number (nucleons) and "
      .replace("%s", "A/Z") + "the bottom number is the atomic number (protons).");
  });

  /* ==================================================== 8. CONFIGURATION */
  lab("configuration", function (root) {
    var z = 11;
    var S = stage(root); S.innerHTML =
      '<svg viewBox="0 0 560 300" width="100%" height="290" role="img" aria-label="shell filling">' +
      '<defs><radialGradient id="nucC"><stop offset="0%" stop-color="#ffe9a8"/>' +
      '<stop offset="100%" stop-color="#e0a020"/></radialGradient></defs>' +
      [150, 112, 74].map(function (r) {
        return '<circle cx="280" cy="160" r="' + r + '" fill="none" stroke="#5b64b8" stroke-dasharray="4 6"/>';
      }).join("") +
      '<circle cx="280" cy="160" r="18" fill="url(#nucC)"/>' +
      '<text x="280" y="165" text-anchor="middle" font-size="12" font-weight="700" fill="#6b4a00">Z</text>' +
      '<g id="sh"></g>' +
      '<text id="cfinfo" x="280" y="292" text-anchor="middle" fill="#ffd24d" font-size="14"></text></svg>';
    function draw() {
      var cfg = shellFill(z), r = [74, 112, 150], names = ["K", "L", "M", "N"], out = "", i, j;
      for (i = 0; i < cfg.length; i++) {
        for (j = 0; j < cfg[i]; j++) {
          var a = (j / cfg[i]) * Math.PI * 2 + i * 0.5;
          var max = Math.min(cfg[i], 18);
          var step = Math.max(1, Math.round(cfg[i] / 18));
          if (j % step) { continue; }
          var ang = (j / cfg[i]) * Math.PI * 2 + i * 0.5;
          out += '<circle cx="' + (280 + Math.cos(ang) * r[i]).toFixed(1) + '" cy="' +
            (160 + Math.sin(ang) * r[i]).toFixed(1) + '" r="5.5" fill="' +
            (i === cfg.length - 1 ? GREEN : BLUE) + '"/>';
        }
      }
      $("#sh", S).innerHTML = out;
      var val = cfg[cfg.length - 1];
      $("#cfinfo", S).innerHTML = (ELEM[z] || "?") + " (" + (SYM[z] || "?") + ")  \u00b7  Z = " + z +
        "  \u00b7  configuration <b>" + cfg.join(", ") + "</b>  \u00b7  valence electrons = " + val;
    }
    var B = bar(root);
    B.appendChild(lbl("Atomic number Z")); B.appendChild(range(1, 20, z, function (v) { z = v; draw(); }));
    B.appendChild(btn("\u25B6 Watch K \u2192 L \u2192 M filling", function () {
      var start = 1; z = 1; draw();
      var t = setInterval(function () {
        z++; draw();
        if (z >= 20) { clearInterval(t); }
      }, 180);
    }));
    draw();
    setCap(root, "Rule 1: a shell holds a maximum of <b>2n\u00b2</b> electrons (K = 2, L = 8, M = 18). " +
      "Rule 2: the outermost shell stops at <b>8</b>. Rule 3: shells fill from the inside out, one step at " +
      "a time \u2014 never skipping the K-shell.");
  });

  /* ==================================================== 9. VALENCY */
  lab("valency", function (root) {
    var z = 11;
    var S = stage(root); S.innerHTML = '<div class="val-wrap" id="vw"></div>';
    function info(zz) {
      var cfg = shellFill(zz), val = cfg[cfg.length - 1], act, valency;
      if (val === 8 || (zz === 2)) { act = "already stable \u2014 does not combine"; valency = 0; }
      else if (val < 4) { act = "lose " + val + " electron" + (val > 1 ? "s" : ""); valency = val; }
      else if (val > 4) { act = "gain " + (8 - val) + " electron" + ((8 - val) > 1 ? "s" : ""); valency = 8 - val; }
      else { act = "share 4 electrons"; valency = 4; }
      return { cfg: cfg, val: val, act: act, valency: valency };
    }
    function draw() {
      var d = info(z), name = ELEM[z] || "?", sym = SYM[z] || "?";
      var pct = Math.round((d.val / 8) * 360);
      $("#vw", S).innerHTML =
        '<div class="val-ring" style="background:conic-gradient(' + GREEN + ' 0deg ' + pct + 'deg,' +
        '#2a2f63 ' + pct + 'deg 360deg)"><span>' + d.val + '<small>/8</small></span></div>' +
        '<div class="val-info"><h4>' + name + ' (' + sym + ') \u00b7 Z = ' + z + '</h4>' +
        '<p>Electronic configuration: <b>' + d.cfg.join(", ") + '</b></p>' +
        '<p>Valence electrons: <b>' + d.val + '</b> in the outermost shell</p>' +
        '<p>To complete its octet this atom will <b>' + d.act + '</b></p>' +
        '<p class="val-big">Valency = <b>' + d.valency + '</b></p></div>';
    }
    var B = bar(root);
    B.appendChild(lbl("Atomic number")); B.appendChild(range(1, 20, z, function (v) { z = v; draw(); }));
    B.appendChild(sel([[1, "Hydrogen (1)"], [6, "Carbon (6)"], [7, "Nitrogen (7)"], [8, "Oxygen (8)"],
      [9, "Fluorine (9)"], [10, "Neon (10)"], [11, "Sodium (11)"], [12, "Magnesium (12)"],
      [13, "Aluminium (13)"], [17, "Chlorine (17)"], [18, "Argon (18)"]],
      function (v) { z = +v; draw(); }));
    draw();
    setCap(root, "Fewer than 4 valence electrons \u2192 the atom <b>loses</b> them. More than 4 \u2192 it " +
      "<b>gains</b> the remaining electrons to make 8. Exactly 4 \u2192 it <b>shares</b>. A full shell " +
      "means valency 0.");
  });

  /* ==================================================== 10. ISOTOPES */
  lab("isotopes", function (root) {
    var sets = {
      "Hydrogen": { sym: "H", z: 1, list: [["Protium", 1, 0, 99.98], ["Deuterium", 2, 1, 0.015], ["Tritium", 3, 2, 0.005]] },
      "Carbon": { sym: "C", z: 6, list: [["Carbon-12", 12, 6, 98.9], ["Carbon-13", 13, 7, 1.1], ["Carbon-14", 14, 8, 0.0000001]] },
      "Chlorine": { sym: "Cl", z: 17, list: [["Chlorine-35", 35, 18, 75], ["Chlorine-37", 37, 20, 25]] },
      "Bromine": { sym: "Br", z: 35, list: [["Bromine-79", 79, 44, 49.7], ["Bromine-81", 81, 46, 50.3]] }
    };
    var key = "Chlorine", i1 = 75;
    var S = stage(root);
    S.innerHTML = '<div class="iso-wrap" id="iw"></div>';
    function draw() {
      var d = sets[key], L = d.list;
      var a1 = (i1 / 100), a2 = 1 - a1;
      var avg = (L[0][1] * a1 + L[1][1] * a2);
      var rows = L.map(function (x, i) {
        return '<div class="iso-card"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>';
      }).join("");
      var calc = L.length > 1 ?
        '= (' + L[0][1] + ' \u00d7 ' + (a1 * 100).toFixed(1) + '/100) + (' + L[1][1] + ' \u00d7 ' +
        (a2 * 100).toFixed(1) + '/100) = <b>' + avg.toFixed(2) + ' u</b>' : "";
      $("#iw", S).innerHTML =
        '<div class="iso-row">' + rows + '</div>' +
        '<div class="iso-facts">' + L.map(function (x) {
          return '<p>' + x[0] + ': Z = ' + d.z + ' (same!), A = ' + x[1] + ', neutrons = ' + x[2] +
            ' \u2192 ' + (x[2] === 0 ? "no neutron" : x[2] + " neutrons") + '</p>';
        }).join("") + '<p class="mut">Same atomic number \u2192 same element \u2192 same chemical ' +
        'properties. Different mass number \u2192 different physical properties. These are <b>isotopes</b>.</p>' +
        (L.length > 1 ? '<p><b>Weighted average atomic mass</b> ' + calc + '</p>' +
          '<p class="mut">Simple mean would give ' + ((L[0][1] + L[1][1]) / 2) +
          ' u \u2014 that is <b>wrong</b>, because it ignores how common each isotope is.</p>' : "") +
        '</div>';
    }
    var B = bar(root);
    B.appendChild(lbl("Element")); B.appendChild(sel([["Hydrogen", "Hydrogen isotopes"], ["Carbon", "Carbon isotopes"],
      ["Chlorine", "Chlorine isotopes"], ["Bromine", "Bromine isotopes"]],
      function (v) { key = v; draw(); }));
    B.appendChild(lbl("Abundance of first isotope")); B.appendChild(range(10, 90, i1, function (v) { i1 = v; draw(); }));
    draw();
    setCap(root, "Move the abundance slider. Only when both isotopes are equally common does the weighted " +
      "average equal the simple mean. In real chlorine (75% / 25%) the average is <b>35.5 u</b>.");
  });

  /* attach anything left over */
  document.addEventListener("DOMContentLoaded", function () { /* already run inline */ });
})();
