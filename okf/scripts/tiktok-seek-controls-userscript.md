---
type: Script
title: TikTok Seek Controls
description: Arrow-key seeking, J/L jumps, frame nudges and speed steps with an on-screen readout.
repo: https://github.com/chirag127/tiktok-seek-controls-userscript
install: https://github.com/chirag127/tiktok-seek-controls-userscript/raw/main/tiktok-seek-controls-userscript.user.js
version: "1.0.0"
tags: [userscript, tiktok]
timestamp: 2026-11-09T00:00:00Z
---

# TikTok Seek Controls

Arrow-key seeking, J/L jumps, frame nudges and speed steps with an on-screen readout.

## Method

Keydown handler with capture, `currentTime` math, `playbackRate` steps, remembered rate re-applied on element swap.

## Limits

- TikTok already binds some arrows on the feed
- Frame step depends on the element frame rate
- Speed resets if you reload without remembering enabled
