// Initialize EventSource to server SSE endpoint and dispatch window events
export function initSSE() {
  if (typeof window === 'undefined') return;
  if (window.__sse_initialized__) return;
  window.__sse_initialized__ = true;

  try {
    const url = (import.meta.env.DEV ? '' : '') + '/api/updates/stream';
    const es = new EventSource(url);

    es.addEventListener('swapAccepted', (e) => {
      try {
        const data = JSON.parse(e.data);
        window.dispatchEvent(new CustomEvent('swapAccepted', { detail: data }));
      } catch (err) { console.error('Failed parse SSE swapAccepted', err); }
    });

    es.addEventListener('error', (err) => {
      console.warn('SSE connection error', err);
    });
  } catch (e) {
    console.warn('SSE not supported', e);
  }
}
