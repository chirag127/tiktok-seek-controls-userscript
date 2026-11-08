// ==UserScript==
// @name         TikTok Seek Controls
// @namespace    https://github.com/chirag127
// @version      1.0.0
// @description  Arrow-key seeking, J/K/L style jumps, speed steps and frame nudges on TikTok, with a small on-screen readout.
// @author       chirag127
// @license      MIT
// @match        https://www.tiktok.com/*
// @icon         https://www.tiktok.com/favicon.ico
// @homepageURL  https://github.com/chirag127/tiktok-seek-controls-userscript
// @supportURL   https://github.com/chirag127/tiktok-seek-controls-userscript/issues
// @downloadURL  https://github.com/chirag127/tiktok-seek-controls-userscript/raw/main/tiktok-seek-controls-userscript.user.js
// @updateURL    https://github.com/chirag127/tiktok-seek-controls-userscript/raw/main/tiktok-seek-controls-userscript.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3];
  const cfg = Object.assign({ step: 5, bigStep: 10, frame: 1 / 30, remember: true }, GM_getValue("cfg", {}));
  const save = () => GM_setValue("cfg", cfg);

  const player = () => document.querySelector("video");
  const typing = () => /input|textarea|select/i.test(document.activeElement.tagName) || document.activeElement.isContentEditable;

  let readout;
  function flash(text) {
    if (!readout) {
      readout = document.createElement("div");
      Object.assign(readout.style, {
        position: "fixed", left: "50%", bottom: "14%", transform: "translateX(-50%)",
        zIndex: 2147483647, background: "rgba(0,0,0,.78)", color: "#fff",
        font: "600 15px Roboto, Arial", padding: "8px 14px", borderRadius: "8px",
        pointerEvents: "none", transition: "opacity .25s", opacity: "1",
      });
      document.body.appendChild(readout);
    }
    readout.textContent = text;
    readout.style.opacity = "1";
    clearTimeout(flash.t);
    flash.t = setTimeout(() => (readout.style.opacity = "0"), 900);
  }

  function seek(delta) {
    const v = player();
    if (!v) return;
    const d = v.duration || 0;
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), d || v.currentTime + delta);
    flash((delta > 0 ? "+" : "") + delta.toFixed(1) + "s");
  }

  function speed(dir) {
    const v = player();
    if (!v) return;
    const i = SPEEDS.indexOf(Number(v.playbackRate)) === -1 ? SPEEDS.indexOf(1) : SPEEDS.indexOf(Number(v.playbackRate));
    const next = SPEEDS[Math.min(SPEEDS.length - 1, Math.max(0, i + dir))];
    v.playbackRate = next;
    if (cfg.remember) GM_setValue("rate", next);
    flash(next + "×");
  }

  function restoreRate() {
    if (!cfg.remember) return;
    const r = GM_getValue("rate", 1);
    const v = player();
    if (v && r !== 1) v.playbackRate = r;
  }

  addEventListener("keydown", (e) => {
    if (typing() || e.ctrlKey || e.metaKey) return;
    const v = player();
    if (!v) return;
    switch (e.key) {
      case "ArrowLeft": seek(e.shiftKey ? -cfg.bigStep : -cfg.step); break;
      case "ArrowRight": seek(e.shiftKey ? cfg.bigStep : cfg.step); break;
      case "j": case "J": seek(-cfg.bigStep); break;
      case "l": case "L": seek(cfg.bigStep); break;
      case "k": case "K": v.paused ? v.play() : v.pause(); flash(v.paused ? "paused" : "playing"); break;
      case ",": v.pause(); seek(-cfg.frame); break;
      case ".": v.pause(); seek(cfg.frame); break;
      case "<": speed(-1); break;
      case ">": speed(1); break;
      case "0": v.playbackRate = 1; flash("1×"); break;
      default: return;
    }
    e.preventDefault();
    e.stopPropagation();
  }, true);

  // TikTok swaps the <video> element on navigation; re-apply the remembered rate.
  new MutationObserver(() => { if (player() && player().playbackRate === 1) restoreRate(); })
    .observe(document.documentElement, { childList: true, subtree: true });

  const chip = document.createElement("button");
  Object.assign(chip.style, {
    position: "fixed", right: "18px", bottom: "56px", zIndex: 2147483646,
    background: "#065fd4", color: "#fff", border: "0", borderRadius: "18px",
    padding: "6px 12px", cursor: "pointer", font: "12px Roboto, Arial",
  });
  chip.textContent = "⏱";
  chip.title = "Seek controls: ←/→ 5s · Shift ±10s · J/L ±10s · K play/pause · , . frame · < > speed";
  chip.onclick = () => flash("←/→ 5s · Shift ±10 · J/L ±10 · K pause · , . frame · < > speed");
  document.body.appendChild(chip);
})();
