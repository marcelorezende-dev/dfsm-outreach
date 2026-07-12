/* =============================================================================
   GGAP explorer — render + filter logic
   ============================================================================ */
(function () {
  "use strict";

  const STATUS = {
    done:    { label: "Accomplished", cls: "st-done" },
    ongoing: { label: "Ongoing",      cls: "st-ongoing" },
    todo:    { label: "Not started",  cls: "st-todo" },
  };

  // active filter state
  const state = {
    pillar: "all",        // single
    leads: new Set(),     // multi
    status: new Set(),    // multi
    years: new Set(),     // multi (numbers)
    q: "",
  };

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------------------------------------------------------- build filters */
  function buildFilters() {
    // pillar (single-select, includes All)
    const pbox = $("#f-pillar");
    const pillarOpts = [["all", "All pillars", ""], ...Object.entries(PILLARS).map(
      ([k, v]) => [k, v.label, v.cls])];
    pillarOpts.forEach(([key, label, cls]) => {
      const c = el("button", "chip" + (key === "all" ? " neutral" : " " + cls));
      if (key !== "all") c.appendChild(swatch(PILLARS[key].color));
      c.appendChild(document.createTextNode(label));
      if (key === "all") c.classList.add("on");
      c.addEventListener("click", () => {
        state.pillar = key;
        [...pbox.children].forEach(ch => ch.classList.remove("on"));
        c.classList.add("on");
        render();
      });
      pbox.appendChild(c);
    });

    // lead (multi)
    const lbox = $("#f-lead");
    Object.keys(LEADS).forEach(name => {
      const c = el("button", "chip");
      c.appendChild(swatch(LEADS[name].color));
      c.appendChild(document.createTextNode(name));
      c.addEventListener("click", () => toggleMulti(state.leads, name, c));
      lbox.appendChild(c);
    });

    // status (multi)
    const sbox = $("#f-status");
    Object.entries(STATUS).forEach(([key, v]) => {
      const c = el("button", "chip");
      const colours = { done: "var(--forest)", ongoing: "var(--amber)", todo: "var(--ink-3)" };
      c.appendChild(swatch(colours[key]));
      c.appendChild(document.createTextNode(v.label));
      c.addEventListener("click", () => toggleMulti(state.status, key, c));
      sbox.appendChild(c);
    });

    // years (multi)
    const ybox = $("#f-year");
    [1, 2, 3, 4, 5].forEach(y => {
      const c = el("button", "chip", "Y" + y);
      c.addEventListener("click", () => toggleMulti(state.years, y, c));
      ybox.appendChild(c);
    });

    // search
    $("#searchbox").addEventListener("input", e => {
      state.q = e.target.value.trim().toLowerCase();
      render();
    });

    // clear
    $("#clearbtn").addEventListener("click", clearAll);
  }

  function swatch(color) {
    const s = el("span", "sw");
    s.style.background = color;
    return s;
  }

  function toggleMulti(set, val, chip) {
    if (set.has(val)) { set.delete(val); chip.classList.remove("on"); }
    else { set.add(val); chip.classList.add("on"); }
    render();
  }

  function clearAll() {
    state.pillar = "all";
    state.leads.clear(); state.status.clear(); state.years.clear();
    state.q = "";
    $("#searchbox").value = "";
    document.querySelectorAll(".filterbar .chip.on").forEach(c => c.classList.remove("on"));
    const first = $("#f-pillar").firstChild;
    if (first) first.classList.add("on");
    render();
  }

  /* ---------------------------------------------------------- filtering */
  function matches(a) {
    if (state.pillar !== "all" && a.pillar !== state.pillar) return false;
    if (state.leads.size && !a.leads.some(l => state.leads.has(l))) return false;
    if (state.status.size && !state.status.has(a.status)) return false;
    if (state.years.size && !a.years.some(y => state.years.has(y))) return false;
    if (state.q) {
      const hay = (a.code + " " + a.title + " " + a.output + " " + a.verify + " " +
        a.rf + " " + a.leads.join(" ")).toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  }

  /* ---------------------------------------------------------- render cards */
  function actionCard(a) {
    const p = PILLARS[a.pillar];
    const st = STATUS[a.status];
    const card = el("div", "act");
    card.style.setProperty("--accentc", p.color);

    const top = el("div", "top");
    top.appendChild(el("span", "code", a.code));
    top.appendChild(el("span", "ptag", p.tag));
    const status = el("span", "status " + st.cls);
    status.appendChild(swatch(""));
    status.lastChild.style.background = "currentColor";
    status.appendChild(document.createTextNode(st.label));
    top.appendChild(status);
    card.appendChild(top);

    card.appendChild(el("h4", null, a.title));

    const leads = el("div", "leads");
    a.leads.forEach(name => {
      const l = el("span", "lead");
      const d = el("span", "d"); d.style.background = LEADS[name].color;
      l.appendChild(d);
      l.appendChild(document.createTextNode(name));
      leads.appendChild(l);
    });
    card.appendChild(leads);

    const detail = el("div", "detail");
    detail.appendChild(dl("Output", a.output));
    detail.appendChild(dl("Verify", a.verify));
    if (a.rf) detail.appendChild(dl("Results FW", a.rf, true));
    card.appendChild(detail);

    // timeline
    const tl = el("div", "timeline");
    [1, 2, 3, 4, 5].forEach(y => {
      const yr = el("div", "yr" + (a.years.includes(y) ? " act-on" : ""));
      const bar = el("div", "bar");
      if (a.years.includes(y)) bar.style.background = p.color;
      yr.appendChild(bar);
      yr.appendChild(el("div", "yl", "Y" + y));
      tl.appendChild(yr);
    });
    card.appendChild(tl);

    return card;
  }

  function dl(k, v, rf) {
    const row = el("div", "dl");
    row.appendChild(el("div", "k", k));
    row.appendChild(el("div", "v" + (rf ? " rf" : ""), v));
    return row;
  }

  /* ---------------------------------------------------------- render */
  function render() {
    const grid = $("#grid");
    grid.innerHTML = "";
    const shown = ACTIONS.filter(matches);
    shown.forEach(a => grid.appendChild(actionCard(a)));

    $("#empty").classList.toggle("show", shown.length === 0);

    // result count + status breakdown
    const by = { done: 0, ongoing: 0, todo: 0 };
    shown.forEach(a => by[a.status]++);
    $("#resultcount").innerHTML =
      `Showing <b>${shown.length}</b> of ${ACTIONS.length} actions` +
      (shown.length
        ? ` &nbsp;·&nbsp; ${by.done} accomplished · ${by.ongoing} ongoing · ${by.todo} not started`
        : "");

    // clear button visibility
    const dirty = state.pillar !== "all" || state.leads.size || state.status.size ||
      state.years.size || state.q;
    $("#clearbtn").classList.toggle("show", !!dirty);

    if (window.lucide) lucide.createIcons();
  }

  /* ---------------------------------------------------------- static blocks */
  function buildStatic() {
    const pg = $("#pcagrid");
    PCAS.forEach((p, i) => {
      const c = el("div", "pca");
      const ic = el("div", "pi", `<i data-lucide="${p.icon}"></i>`);
      c.appendChild(ic);
      c.appendChild(el("div", "dsl-kicker", "PCA " + String(i + 1).padStart(2, "0")));
      c.appendChild(el("h4", null, p.t));
      pg.appendChild(c);
    });

    const rl = $("#reqlist");
    GEF_REQS.forEach((r, i) => {
      const row = el("div", "req");
      row.appendChild(el("div", "rq", String(i + 1)));
      const mid = el("div");
      mid.appendChild(el("div", "rt", r.t));
      mid.appendChild(el("div", "rd", r.d));
      row.appendChild(mid);
      row.appendChild(el("div", "met", `<i data-lucide="check"></i> Progress`));
      rl.appendChild(row);
    });
  }

  /* ---------------------------------------------------------- init */
  function init() {
    buildFilters();
    buildStatic();
    render();
    if (window.lucide) lucide.createIcons();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
