export function showToast(message, type = 'success', duration = 3000) {
  try {
    const containerId = '__app_toast_container__';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'fixed';
      container.style.right = '16px';
      container.style.top = '16px';
      container.style.zIndex = 9999;
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = 'px-4 py-2 rounded shadow mb-2 text-sm';
    el.style.minWidth = '200px';
    el.style.color = '#fff';
    el.style.fontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
    if (type === 'error') {
      el.style.background = 'linear-gradient(90deg,#ef4444,#dc2626)';
    } else {
      el.style.background = 'linear-gradient(90deg,#10b981,#059669)';
    }
    el.textContent = message;
    container.appendChild(el);

    setTimeout(() => {
      try { container.removeChild(el); } catch (e) {}
      // remove container if empty
      if (container && container.childNodes.length === 0) {
        try { container.parentNode.removeChild(container); } catch (e) {}
      }
    }, duration);
  } catch (e) {
    // fallback
    alert(message);
  }
}
