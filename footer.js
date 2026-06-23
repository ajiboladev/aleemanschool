(function () {
  const DEFAULT = 'Set for 2025/2026';

  function getText() {
    return (window.FLOATING_TEXT || DEFAULT).toString();
  }

  function formatText(str) {
    return str.replace(/(\d{4})\s*\/\s*(\d{4})/, '$1 / $2');
  }

  /* ----------------------------------------------------
     INJECT STYLES (keyframes + pseudo-elements need real CSS)
  ---------------------------------------------------- */
  const STYLE_ID = 'floating-years-styles';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #floating-years-wrap {
        position: fixed;
        left: 16px;
        bottom: 20px;
        z-index: 2147483647;
        user-select: none;
        cursor: default;
        font-family: 'system-ui', 'Segoe UI', Roboto, Arial, sans-serif;
      }

      /* Rotating glow halo sitting behind the badge */
      #floating-years-wrap::before {
        content: '';
        position: absolute;
        inset: -10px;
        border-radius: 18px;
        z-index: -1;
        background: conic-gradient(
          from 0deg,
          #0b3d22,
          #2e8b57,
          #3cb371,
          #7fffa0,
          #2e8b57,
          #0b3d22
        );
        filter: blur(14px) saturate(150%);
        opacity: 0.85;
        animation: fy-spin 6s linear infinite;
        background-size: 200% 200%;
      }

      /* Soft secondary glow pulse, slightly offset for depth */
      #floating-years-wrap::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 14px;
        z-index: -1;
        background: radial-gradient(circle at 50% 50%, rgba(124, 255, 165, 0.45), transparent 70%);
        animation: fy-pulse 3s ease-in-out infinite;
      }

      #floating-years {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.2px;
        color: #eafff0;
        background: linear-gradient(135deg, rgba(10, 30, 20, 0.92), rgba(15, 45, 30, 0.88));
        border: 1px solid rgba(124, 255, 165, 0.35);
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
        box-shadow:
          0 8px 24px rgba(0, 60, 30, 0.35),
          inset 0 0 12px rgba(124, 255, 165, 0.08);
        overflow: hidden;
        isolation: isolate;
      }

      /* Shimmer sweep across the text/background */
      #floating-years::before {
        content: '';
        position: absolute;
        top: 0;
        left: -150%;
        width: 60%;
        height: 100%;
        background: linear-gradient(
          100deg,
          transparent,
          rgba(255, 255, 255, 0.18),
          transparent
        );
        animation: fy-shimmer 3.2s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }

      #floating-years .fy-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: radial-gradient(circle, #b9ffd2, #2e8b57);
        box-shadow: 0 0 8px 2px rgba(124, 255, 165, 0.9);
        animation: fy-dot-pulse 2s ease-in-out infinite;
        flex-shrink: 0;
      }

      #floating-years .fy-text {
        position: relative;
        z-index: 2;
        background: linear-gradient(90deg, #eafff0, #b9ffd2, #eafff0);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: fy-text-shine 4s linear infinite;
      }

      @keyframes fy-spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes fy-pulse {
        0%, 100% { opacity: 0.5; transform: scale(0.96); }
        50%      { opacity: 0.9; transform: scale(1.04); }
      }

      @keyframes fy-shimmer {
        0%   { left: -150%; }
        100% { left: 150%; }
      }

      @keyframes fy-dot-pulse {
        0%, 100% { opacity: 0.6; transform: scale(0.85); }
        50%      { opacity: 1;   transform: scale(1.15); }
      }

      @keyframes fy-text-shine {
        0%   { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      /* Mobile adjustments */
      @media (max-width: 600px) {
        #floating-years-wrap {
          left: 10px;
          bottom: 25px;
        }
        #floating-years {
          padding: 8px 12px;
          font-size: 12px;
          border-radius: 10px;
          gap: 6px;
        }
        #floating-years-wrap::before {
          border-radius: 16px;
        }
      }

      /* Respect reduced motion preference */
      @media (prefers-reduced-motion: reduce) {
        #floating-years-wrap::before,
        #floating-years-wrap::after,
        #floating-years::before,
        #floating-years .fy-dot,
        #floating-years .fy-text {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ----------------------------------------------------
     BUILD DOM
  ---------------------------------------------------- */
  const wrap = document.createElement('div');
  wrap.id = 'floating-years-wrap';

  const container = document.createElement('div');
  container.id = 'floating-years';
  container.setAttribute('role', 'note');
  container.setAttribute('aria-label', 'Academic year');

  const dot = document.createElement('span');
  dot.className = 'fy-dot';

  const textSpan = document.createElement('span');
  textSpan.className = 'fy-text';

  container.appendChild(dot);
  container.appendChild(textSpan);
  wrap.appendChild(container);

  function update() {
    textSpan.textContent = formatText(getText());
  }

  update();

  /* ----------------------------------------------------
     MOUNT SAFELY
  ---------------------------------------------------- */
  function mount() {
    if (!document.body.contains(wrap)) {
      document.body.appendChild(wrap);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  /* ----------------------------------------------------
     PUBLIC API (unchanged, so existing usage still works)
  ---------------------------------------------------- */
  window.floatingYears = {
    set(value) {
      window.FLOATING_TEXT = value;
      update();
    },
    get() {
      return getText();
    },
    element() {
      return wrap;
    }
  };
})();