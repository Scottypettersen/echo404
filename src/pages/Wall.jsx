// src/pages/Wall.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { onSnapshot, collection, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { useEcho } from "../context/EchoContext";
import "./Wall.css"; // Import the CSS

const ROWS = 25;
const COLS = 40;
const TOTAL = ROWS * COLS;

export default function Wall() {
  const { setWhisper } = useEcho();
  const labelRef = useRef(null); // Initialize with null
  const colorInputRef = useRef(null); // Initialize with null
  const messageTextareaRef = useRef(null); // New ref for the message textarea
  const isPhone = useMediaQuery('(max-width: 600px)');
  const hasInteractedRef = useRef(false); // Track if user has interacted

  // 0️⃣ — auth loading / error / user
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setWhisper("ECHO WALL LOADED");
      } else {
        setWhisper("AUTH FAILED");
      }
    });
    return unsub;
  }, [setWhisper]);

  // 1️⃣ — tiles grid
  const [tiles, setTiles] = useState(Array(TOTAL).fill(null));
  const [myIndex, setMyIndex] = useState(null);

  // 2️⃣ — real-time subscribe
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, "tiles"),
      (snap) => {
        const updated = Array(TOTAL).fill(null);
        let foundMine = null;
        snap.forEach((d) => {
          const data = d.data();
          updated[data.index] = data;
          if (data.claimedBy === user.uid) {
            foundMine = data.index;
          }
        });
        setTiles(updated);
        setMyIndex(foundMine);
        if (foundMine !== null) {
          setWhisper(`YOU ALREADY CLAIMED #${foundMine}`);
        }
      },
      (err) => {
        console.error("Firestore listen error:", err);
        setWhisper("OFFLINE MODE");
      }
    );
    return () => unsub();
  }, [user, setWhisper]);

  // 3️⃣ — UI state
  const [claimIdx, setClaimIdx] = useState(null);
  const [viewTile, setViewTile] = useState(null);
  const [form, setForm] = useState({ label: "", color: "#0f0", message: "" });
  const [firstBoot, setFirstBoot] = useState(true);

  // 4️⃣ — click handler
  const handleClick = useCallback(
    (idx) => {
      setFirstBoot(false); // User has interacted
      hasInteractedRef.current = true;
      if (tiles[idx]) {
        setViewTile({ ...tiles[idx], index: idx });
        setWhisper(`VIEWING #${idx}`);
        return;
      }
      if (myIndex !== null) {
        setWhisper(`ONE TILE ONLY (#${myIndex})`);
        return;
      }
      setClaimIdx(idx);
      setForm({ label: "", color: "#0f0", message: "" });
      setWhisper(`CLAIMING #${idx}`);
      // Focus input and set title after modal renders
      setTimeout(() => {
        labelRef.current?.focus();
        if (colorInputRef.current) {
          colorInputRef.current.title = "Click to change tile color!";
        }
      }, 100);
    },
    [tiles, myIndex, setWhisper]
  );

  // 5️⃣ — submit new claim
  const submitClaim = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) {
      labelRef.current?.focus(); // Use optional chaining
      return;
    }
    const idx = claimIdx;
    const newTile = {
      index: idx,
      label: form.label.slice(0, 3).toUpperCase(),
      color: form.color,
      message: form.message.slice(0, 140),
      claimedBy: user.uid,
      timestamp: Date.now(),
    };
    try {
      await setDoc(doc(db, "tiles", String(idx)), newTile);
      setWhisper(`#${idx} CLAIMED`);
      setClaimIdx(null);
    } catch (err) {
      console.error("Save error:", err);
      setWhisper("SAVE FAILED—RETRY");
    }
  };

  // 6️⃣ — Subtle Whispers (Enhanced)
  const triggerWhispers = useCallback(() => {
    // Clear any existing timeout to prevent multiple loops
    if (triggerWhispers.timeoutId) clearTimeout(triggerWhispers.timeoutId);

    if (!user || !hasInteractedRef.current) {
      triggerWhispers.timeoutId = setTimeout(triggerWhispers, 5000); // Re-check after a delay if not ready
      return;
    }

    const delay = 15000 + Math.random() * 15000;
    const emptyTileCount = tiles.filter((tile) => !tile).length;
    let hint = "";

    if (emptyTileCount > 0 && myIndex === null) {
      hint = getRandomElement([
        "... an empty space awaits...",
        "... leave your mark...",
        "... the wall is listening...",
        "... a blank canvas calls...",
        "... tap to claim...", // Interaction hint
        "... click a square...", // Interaction hint
      ]);
    } else if (myIndex !== null && viewTile?.claimedBy !== user.uid) {
      hint = getRandomElement([
        "... others have left their echoes...",
        "... see what others have shared...",
        "... a story in every square...",
      ]);
    } else if (myIndex !== null && viewTile?.claimedBy === user.uid) {
      hint = getRandomElement([
        "... you've made your mark...",
        "... your echo resonates...",
      ]);
    } else if (emptyTileCount === 0) {
      hint = getRandomElement([
        "... the wall is full...",
        "... every space claimed...",
      ]);
    } else if (myIndex === null && emptyTileCount < TOTAL) {
      hint = getRandomElement([
        "... the wall is filling...",
        "... more echoes appear...",
      ]);
    }

    if (hint) { // Only set whisper if a relevant hint is found
      setWhisper(hint);
    }

    triggerWhispers.timeoutId = setTimeout(triggerWhispers, delay);
  }, [user, tiles, myIndex, viewTile, setWhisper]);

  useEffect(() => {
    // Initial call to start whispers
    triggerWhispers();
    // Cleanup on unmount
    return () => {
      if (triggerWhispers.timeoutId) clearTimeout(triggerWhispers.timeoutId);
    };
  }, [triggerWhispers]);


  // 7️⃣ — Modal Keyboard Visibility Adjustment for Mobile
  useEffect(() => {
    if (!isPhone || claimIdx === null) return; // Only apply on phone when claim modal is open

    const adjustModalForKeyboard = () => {
      const modalOverlay = document.querySelector('.modal-overlay');
      if (modalOverlay) {
        // A simple adjustment: push the modal up from the bottom
        // This might need fine-tuning based on actual keyboard height
        modalOverlay.style.alignItems = 'flex-start';
        modalOverlay.style.paddingTop = '20px'; // Add some top padding
        modalOverlay.style.paddingBottom = '100px'; // Add padding at bottom to reveal content above keyboard
        modalOverlay.style.overflowY = 'auto'; // Ensure modal content is scrollable
      }
    };

    const resetModalPosition = () => {
      const modalOverlay = document.querySelector('.modal-overlay');
      if (modalOverlay) {
        modalOverlay.style.alignItems = 'center'; // Reset to center
        modalOverlay.style.paddingTop = '0';
        modalOverlay.style.paddingBottom = '0';
        modalOverlay.style.overflowY = 'hidden'; // Reset overflow
      }
    };

    const inputs = [labelRef.current, messageTextareaRef.current];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('focus', adjustModalForKeyboard);
        input.addEventListener('blur', resetModalPosition);
      }
    });

    // Cleanup listeners
    return () => {
      inputs.forEach(input => {
        if (input) {
          input.removeEventListener('focus', adjustModalForKeyboard);
          input.removeEventListener('blur', resetModalPosition);
        }
      });
    };
  }, [isPhone, claimIdx]);


  // 🚦 — auth loading / error states
  if (user === undefined) {
    return <div className="loading-auth">Loading authentication…</div>;
  }
  if (user === null) {
    return <div className="auth-failed">Authentication failed. Check console.</div>;
  }

  // ✔️ — main UI
  return (
    <main className="wall-container">
      <h1 className="wall-title">Echo Wall</h1>
      <p className="wall-subtitle">
        Click an empty square to leave your trace — everyone sees it.
      </p>

      {firstBoot && (
        <div className="first-boot-overlay">
          <p className="first-boot-message">
            Tap or click any empty square to begin!
          </p>
          <div className="arrow-down-animation">↓</div>
        </div>
      )}

      <div className="grid-wrapper">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, var(--tile-size))` }}>
          {tiles.map((t, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              title={t ? `${t.label}: ${t.message}` : `Tile #${i}`}
              className={`tile ${t ? "claimed" : "empty"} ${
                myIndex === null ? "can-claim" : "cannot-claim"
              } ${i === myIndex ? "my-claimed-tile" : ""}`}
              style={{ backgroundColor: t ? t.color : undefined }}
            >
              {t?.label}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Claim Modal ────────────────────────── */}
      {claimIdx !== null && (
        <div className="modal-overlay">
          <form onSubmit={submitClaim} className="modal-box">
            <h2>Claim Tile #{claimIdx}</h2>
            <div className="modal-form-row">
              <input
                ref={labelRef}
                maxLength={3}
                placeholder="Label (3 chars)"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="modal-input"
              />
              <input
                ref={colorInputRef}
                type="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="modal-color-input"
                title="Click to change tile color!"
              />
            </div>
            <textarea
              ref={messageTextareaRef} // Attach ref here
              maxLength={140}
              placeholder="Optional message (140 chars)"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="modal-textarea"
            />
            <div className="modal-actions">
              <button type="button" onClick={() => setClaimIdx(null)} className="modal-button">
                Cancel
              </button>
              <button type="submit" disabled={!form.label.trim()} className="modal-button primary-button">
                Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── View Modal ─────────────────────────── */}
      {viewTile && (
        <div className="modal-overlay" onClick={() => setViewTile(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>
              Tile #{viewTile.index} — {viewTile.label}
            </h2>
            <p>
              <strong>Message:</strong> {viewTile.message || "—"}
            </p>
            <p>
              <strong>By:</strong> {viewTile.claimedBy === user.uid ? "You" : viewTile.claimedBy}
            </p>
            <button className="modal-button" onClick={() => setViewTile(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}