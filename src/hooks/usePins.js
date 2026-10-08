import { useState, useCallback } from "react";

// Pins are a per-viewer convenience only (not sensitive), so localStorage is fine here.
const KEY = "ptof.pins";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };

export default function usePins() {
  const [pins, setPins] = useState(read);
  const toggle = useCallback((slug) => {
    setPins((p) => {
      const next = p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);
  return [pins, toggle];
}
