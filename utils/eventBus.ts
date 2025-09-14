type Callback = (payload?: any) => void;

const listeners: Record<string, Callback[]> = {};

export function subscribe(event: string, cb: Callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(cb);
  return () => {
    listeners[event] = listeners[event].filter(l => l !== cb);
  };
}

export function emit(event: string, payload?: any) {
  const list = listeners[event] || [];
  list.forEach(cb => {
    try { cb(payload); } catch (e) { /* ignore listener errors */ }
  });
}

export default { subscribe, emit };
