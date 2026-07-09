// ── State ─────────────────────────────────────────────────────────────────────

let provider = null;
const state = {};

function allTests() {
  return GROUPS.flatMap((g) => g.tests);
}

// ── Provider discovery ────────────────────────────────────────────────────────

function discover() {
  const timeout = setTimeout(() => {
    document.getElementById("pdot").className = "dot error";
    document.getElementById("ptxt").textContent =
      "No provider found — install a Neo wallet extension and reload";
  }, 5000);

  window.addEventListener(
    "Neo.DapiProvider.ready",
    (e) => {
      clearTimeout(timeout);
      provider = e.detail.provider;
      document.getElementById("pdot").className = "dot found";
      document.getElementById("ptxt").innerHTML =
        "Provider: <strong>" + provider.name + "</strong> v" + provider.version;
      document.getElementById("btnRun").disabled = false;
      document.getElementById("sbar").textContent =
        "Ready · " + allTests().length + " tests";
    },
    { once: true },
  );

  window.dispatchEvent(new Event("Neo.DapiProvider.request"));
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  document.getElementById("groups").innerHTML = GROUPS.map(
    (g) => `
    <div class="group">
      <div class="group-head">
        <span class="group-title">${g.title}</span>
        <span class="group-badge" id="badge-${g.id}"></span>
        <span class="chev open" id="chev-${g.id}" onclick="toggleGrp('${g.id}')">▶</span>
      </div>
      <div class="group-body" id="body-${g.id}">
        ${g.tests
          .map(
            (t) => `
          <div class="trow">
            <div class="tmain" onclick="toggleDet('${t.id}')">
              <span class="ticon s-idle" id="ico-${t.id}">○</span>
              <span class="tname">${t.name}</span>
              ${t.tag ? '<span class="ttag">' + t.tag + "</span>" : ""}
              <span class="tdur" id="dur-${t.id}"></span>
              <span class="tstat s-idle" id="st-${t.id}">—</span>
              <button class="btn-run" onclick="event.stopPropagation(); runOne('${t.id}')">▶</button>
            </div>
            <div class="tdetail hide" id="det-${t.id}">
              <div class="terror hide" id="err-${t.id}"></div>
              <div class="tres" id="res-${t.id}"></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
  ).join("");
}

// ── Run ───────────────────────────────────────────────────────────────────────

async function runTest(t) {
  if (!provider) return;
  setState(t.id, "run");
  const t0 = performance.now();
  try {
    const r = await t.fn(provider);
    setState(t.id, "pass", r, null, Math.round(performance.now() - t0));
  } catch (e) {
    setState(t.id, "fail", null, e, Math.round(performance.now() - t0));
  }
}

async function runOne(id) {
  const t = allTests().find((t) => t.id === id);
  if (t) await runTest(t);
}

async function runAll() {
  if (!provider) return;
  document.getElementById("btnRun").disabled = true;
  document.getElementById("summary").classList.add("hide");
  const t0 = performance.now();
  for (const g of GROUPS)
    for (const t of g.tests) {
      await runTest(t);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  showSummary(Math.round(performance.now() - t0));
  document.getElementById("btnRun").disabled = false;
}

// ── State updates ─────────────────────────────────────────────────────────────

function setState(id, status, result, err, ms) {
  state[id] = { status, result, err, ms };

  const ICONS = { idle: "○", run: "◌", pass: "✓", fail: "✗" };
  const LABELS = { idle: "—", run: "…", pass: "PASS", fail: "FAIL" };
  const COLORS = {
    pass: "var(--pass)",
    fail: "var(--fail)",
    run: "var(--info)",
    idle: "var(--dim)",
  };

  const ico = document.getElementById("ico-" + id);
  ico.textContent = ICONS[status];
  ico.style.color = COLORS[status];

  const st = document.getElementById("st-" + id);
  st.className = "tstat s-" + status;
  st.textContent = LABELS[status];

  if (ms != null) document.getElementById("dur-" + id).textContent = ms + "ms";

  const errEl = document.getElementById("err-" + id);
  if (err) {
    errEl.textContent = err.message || String(err);
    errEl.classList.remove("hide");
    document.getElementById("det-" + id).classList.remove("hide");
  } else {
    errEl.classList.add("hide");
  }

  if (result != null)
    document.getElementById("res-" + id).textContent = JSON.stringify(
      result,
      null,
      2,
    );

  updateBadge(id);
  updateBar();
}

function updateBadge(tid) {
  for (const g of GROUPS) {
    if (!g.tests.find((t) => t.id === tid)) continue;
    const pass = g.tests.filter((t) => state[t.id]?.status === "pass").length;
    const fail = g.tests.filter((t) => state[t.id]?.status === "fail").length;
    const el = document.getElementById("badge-" + g.id);
    if (!el) continue;
    if (fail)
      el.innerHTML =
        '<span style="color:var(--fail)">' + fail + " failed</span>";
    else if (pass === g.tests.length)
      el.innerHTML = '<span style="color:var(--pass)">all passed</span>';
    else if (pass)
      el.innerHTML =
        '<span style="color:var(--muted)">' +
        pass +
        "/" +
        g.tests.length +
        "</span>";
    else el.innerHTML = "";
  }
}

function updateBar() {
  const all = allTests();
  const done = all.filter(
    (t) => state[t.id]?.status === "pass" || state[t.id]?.status === "fail",
  ).length;
  document.getElementById("sbar").textContent =
    done + " / " + all.length + " run";
}

function showSummary(ms) {
  const all = allTests();
  document.getElementById("sPass").textContent = all.filter(
    (t) => state[t.id]?.status === "pass",
  ).length;
  document.getElementById("sFail").textContent = all.filter(
    (t) => state[t.id]?.status === "fail",
  ).length;
  document.getElementById("sSkip").textContent = all.filter(
    (t) => !state[t.id] || state[t.id]?.status === "idle",
  ).length;
  document.getElementById("sTime").textContent = ms + "ms total";
  document.getElementById("summary").classList.remove("hide");
}

// ── UI toggles ────────────────────────────────────────────────────────────────

function resetAll() {
  Object.keys(state).forEach((k) => delete state[k]);
  render();
  document.getElementById("summary").classList.add("hide");
  document.getElementById("sbar").textContent = provider
    ? "Ready · " + allTests().length + " tests"
    : "—";
}

function toggleGrp(id) {
  document.getElementById("body-" + id).classList.toggle("hide");
  document.getElementById("chev-" + id).classList.toggle("open");
}

function toggleDet(id) {
  document.getElementById("det-" + id).classList.toggle("hide");
}

// ── Boot ──────────────────────────────────────────────────────────────────────

render();
discover();
