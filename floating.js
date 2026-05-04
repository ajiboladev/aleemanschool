(function () {
  const DEFAULT = 'Set for 2025/2026';

  function getText() {
    return (window.FLOATING_TEXT || DEFAULT).toString();
  }

  function formatText(str) {
    return str.replace(/(\d{4})\s*\/\s*(\d{4})/, '$1 / $2');
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'floating-years';
  container.setAttribute('role', 'note');
  container.setAttribute('aria-label', 'Academic year');

  // Styles
  Object.assign(container.style, {
    position: 'fixed',
    left: '16px',
    bottom: '100px',
    padding: '10px 14px',
    borderRadius: '12px',
    fontFamily: 'system-ui, Segoe UI, Roboto, Arial, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    zIndex: '2147483647',
    userSelect: 'none',
    cursor: 'default',

    // Glass effect
    background: 'rgba(20, 20, 20, 0.55)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
  });

  // Set text
  function update() {
    container.textContent = formatText(getText());
  }

  update();

  // ✅ Responsive (NO hiding on mobile)
  const mq = window.matchMedia('(max-width: 600px)');

  function applyMobileStyle(e) {
    if (e.matches) {
      container.style.padding = '8px 10px';
      container.style.fontSize = '12px';
      container.style.left = '10px';
      container.style.bottom = '25px';
      container.style.borderRadius = '10px';
      container.style.opacity = '0.95';
    } else {
      container.style.padding = '10px 14px';
      container.style.fontSize = '14px';
      container.style.left = '16px';
      container.style.bottom = '20px';
      container.style.borderRadius = '12px';
      container.style.opacity = '1';
    }
  }

  applyMobileStyle(mq);
  mq.addEventListener?.('change', applyMobileStyle) ||
    mq.addListener?.(applyMobileStyle);

  // Mount safely
  function mount() {
    if (!document.body.contains(container)) {
      document.body.appendChild(container);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  // Public API
  window.floatingYears = {
    set(value) {
      window.FLOATING_TEXT = value;
      update();
    },
    get() {
      return getText();
    },
    element() {
      return container;
    }
  };
})();