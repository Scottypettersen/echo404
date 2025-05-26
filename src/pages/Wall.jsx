import React, { useState, useEffect, useRef } from "react";
import { onSnapshot, collection, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { useEcho } from "../context/EchoContext";

const ROWS  = 25;
const COLS  = 40;
const TOTAL = ROWS * COLS;

export default function Wall() {
  const { setWhisper } = useEcho();
  const labelRef = useRef();

  // 0️⃣ — auth loading / error / user
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
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
  // your claimed index (null if none)
  const [myIndex, setMyIndex] = useState(null);

  // 2️⃣ — real-time subscribe *only after* we have a user
  useEffect(() => {
    if (!user) return; // wait for auth
    const unsub = onSnapshot(
      collection(db, "tiles"),
      snap => {
        const updated = Array(TOTAL).fill(null);
        let foundMine = null;
        snap.forEach(d => {
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
      err => {
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

  // 4️⃣ — click handler
  const handleClick = idx => {
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
    setTimeout(() => labelRef.current?.focus(), 100);
  };

  // 5️⃣ — submit new claim
  const submitClaim = async e => {
    e.preventDefault();
    if (!form.label.trim()) {
      labelRef.current.focus();
      return;
    }
    const idx = claimIdx;
    const newTile = {
      index:     idx,
      label:     form.label.slice(0, 3).toUpperCase(),
      color:     form.color,
      message:   form.message.slice(0, 140),
      claimedBy: user.uid,
      timestamp: Date.now()
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

  // 🚦 — auth loading / error states
  if (user === undefined) {
    return <div style={{ color: "#0f0", fontFamily: "monospace" }}>Loading authentication…</div>;
  }
  if (user === null) {
    return <div style={{ color: "#f00", fontFamily: "monospace" }}>Authentication failed. Check console.</div>;
  }

  // ✔️ — main UI
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Echo Wall</h1>
      <p style={styles.subtitle}>
        Click an empty square to leave your trace — everyone sees it.
      </p>

      <div style={styles.gridWrapper}>
        <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${COLS}, 24px)` }}>
          {tiles.map((t, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              title={t ? `${t.label}: ${t.message}` : `Tile #${i}`}
              style={{
                ...styles.tile,
                backgroundColor: t ? t.color : "#111",
                color: t ? "#000" : "transparent",
                cursor: t ? "pointer" : (myIndex === null ? "pointer" : "not-allowed")
              }}
            >
              {t?.label}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Claim Modal ────────────────────────── */}
      {claimIdx !== null && (
        <div style={styles.modalOverlay}>
          <form onSubmit={submitClaim} style={styles.modalBox}>
            <h2>Claim Tile #{claimIdx}</h2>
            <input
              ref={labelRef}
              maxLength={3}
              placeholder="Label (3 chars)"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              style={styles.input}
            />
            <input
              type="color"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{ ...styles.input, width: "3rem", padding: 0, marginLeft: "1rem" }}
            />
            <textarea
              maxLength={140}
              placeholder="Optional message (140 chars)"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={styles.textarea}
            />
            <div style={styles.actions}>
              <button type="button" onClick={() => setClaimIdx(null)} style={styles.button}>
                Cancel
              </button>
              <button type="submit" disabled={!form.label.trim()} style={styles.button}>
                Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── View Modal ─────────────────────────── */}
      {viewTile && (
        <div style={styles.modalOverlay} onClick={() => setViewTile(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <h2>Tile #{viewTile.index} — {viewTile.label}</h2>
            <p><strong>Message:</strong> {viewTile.message || "—"}</p>
            <p><strong>By:</strong> {viewTile.claimedBy === user.uid ? "You" : viewTile.claimedBy}</p>
            <button style={styles.button} onClick={() => setViewTile(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  container:    { background: "#000", color: "#0f0", fontFamily: "monospace", height: "100vh", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" },
  title:        { margin: 0, fontSize: "2rem" },
  subtitle:     { marginBottom: "1rem" },
  gridWrapper:  { flexGrow: 1, overflow: "auto", width: "100%", maxWidth: COLS * 26 },
  grid:         { display: "grid", gap: "2px", justifyContent: "center" },
  tile:         { width:24, height:24, border:"1px solid #0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, userSelect:"none" },
  modalOverlay: { position:"fixed", top:0,left:0,right:0,bottom:0, background:"rgba(0,0,0,0.85)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000 },
  modalBox:     { background:"#000", color:"#0f0", padding:"1rem", border:"1px solid #0f0", width:"90%", maxWidth:360, display:"flex", flexDirection:"column", gap:"0.75rem" },
  input:        { background:"#111", color:"#0f0", border:"1px solid #0f0", padding:"0.5rem", fontFamily:"monospace" },
  textarea:     { background:"#111", color:"#0f0", border:"1px solid #0f0", padding:"0.5rem", fontFamily:"monospace", height:60, resize:"none" },
  actions:      { display:"flex", justifyContent:"space-between", marginTop:"0.5rem" },
  button:       { background:"transparent", color:"#0f0", border:"1px solid #0f0", padding:"0.4rem 1rem", cursor:"pointer", fontFamily:"monospace" }
};
