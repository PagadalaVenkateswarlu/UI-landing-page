import { useEffect, useRef } from "react";

// Warn 1 minute before timeout, then call onTimeout. Any user activity resets the timer.
export default function useIdleTimeout({ minutes, onWarn, onTimeout }) {
  const last = useRef(Date.now());
  const warned = useRef(false);

  useEffect(() => {
    const reset = () => { last.current = Date.now(); warned.current = false; };
    const events = ["mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    const timer = setInterval(() => {
      const idleMin = (Date.now() - last.current) / 60000;
      if (idleMin >= minutes) onTimeout();
      else if (idleMin >= minutes - 1 && !warned.current) { warned.current = true; onWarn(); }
    }, 15000);
    return () => { events.forEach((e) => window.removeEventListener(e, reset)); clearInterval(timer); };
  }, [minutes, onWarn, onTimeout]);
}
