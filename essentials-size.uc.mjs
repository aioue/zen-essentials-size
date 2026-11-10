// Optional (needs a userChrome script loader such as Sine): adds a slider +
// integer field for the Essentials icon size. Without it, the text field in the
// mod's settings still works and updates live; this only adds nicer UI.
//
// Open it by right-clicking an Essential -> "Resize Essentials...".
// Both controls write the same pref the CSS reads, so the two UIs stay in sync.
(() => {
  const PREF = "uc.essentials.size";
  const VAR = "--uc-essentials-size";
  const MIN = 25, MAX = 300, DEF = 100;
  const HTML = "http://www.w3.org/1999/xhtml";
  const clamp = n => Math.min(MAX, Math.max(MIN, n));

  const read = () => {
    const n = parseInt(Services.prefs.getStringPref(PREF, String(DEF)), 10);
    return Number.isFinite(n) ? clamp(n) : DEF;
  };
  // Set the root var directly as well as the pref: Zen's own refresh of the
  // var is debounced, and the slider must update on every input event.
  const apply = n => {
    document.documentElement.style.setProperty(VAR, String(n));
    Services.prefs.setStringPref(PREF, String(n));
  };

  const el = (tag, props = {}) =>
    Object.assign(document.createElementNS(HTML, tag), props);

  const range = el("input", { type: "range", min: MIN, max: MAX, step: 1 });
  const num = el("input", { type: "number", min: MIN, max: MAX, step: 1 });
  num.style.width = "5em";
  range.style.flex = "1";
  const reset = el("button", { textContent: "Reset" });

  const sync = (n, from) => {
    n = clamp(n);
    if (from !== range) range.value = n;
    if (from !== num) num.value = n;
    apply(n);
  };
  range.addEventListener("input", () => sync(range.valueAsNumber, range));
  // Typing "1" on the way to "150" must not clamp mid-edit; only live-apply
  // once the number is in range, and fix the field up on change/blur.
  num.addEventListener("input", () => {
    const v = num.valueAsNumber;
    if (v >= MIN && v <= MAX) sync(v, num);
  });
  num.addEventListener("change", () => sync(num.valueAsNumber || DEF));
  reset.addEventListener("click", () => sync(DEF));

  const row = el("div");
  row.style.cssText = "display:flex;gap:8px;align-items:center;padding:10px;width:300px";
  const pct = el("span", { textContent: "%" });
  row.append(range, num, pct, reset);

  const panel = document.createXULElement("panel");
  panel.id = "uc-essentials-size-panel";
  panel.setAttribute("type", "arrow");
  panel.append(row);
  document.getElementById("mainPopupSet").append(panel);

  const item = document.createXULElement("menuitem");
  item.id = "uc-essentials-size-item";
  item.setAttribute("label", "Resize Essentials icons…");
  item.addEventListener("command", () => {
    sync(read());
    panel.openPopup(TabContextMenu.contextTab, "after_start");
  });
  const menu = document.getElementById("tabContextMenu");
  menu.prepend(item);
  menu.addEventListener("popupshowing", () => {
    item.hidden = !TabContextMenu.contextTab?.hasAttribute("zen-essential");
  });

  // Follow edits made from the settings text field or about:config.
  Services.prefs.addObserver(PREF, () => {
    const n = read();
    document.documentElement.style.setProperty(VAR, String(n));
    range.value = num.value = n;
  });
  document.documentElement.style.setProperty(VAR, String(read()));
})();
