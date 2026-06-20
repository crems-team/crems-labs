import React, { useEffect, useState, useCallback, useRef, ReactNode  } from 'react';

type OrientationGateProps = {
    minWidth?: number;
    children: ReactNode;
  };

export default function OrientationGate({
    minWidth = 768,
    children,
  }: OrientationGateProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fsRef = useRef(null);

  const updateFlags = useCallback(() => {
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    const mobile = window.innerWidth < minWidth; // <768px: “mobile”
    setIsPortrait(portrait);
    setIsMobile(mobile);
  }, [minWidth]);

  useEffect(() => {
    updateFlags();
    const ro = () => updateFlags();
    window.addEventListener('resize', ro);
    window.addEventListener('orientationchange', ro);
    return () => {
      window.removeEventListener('resize', ro);
      window.removeEventListener('orientationchange', ro);
    };
  }, [updateFlags]);

  const tryLockLandscape = async () => {
    try {
      const el = fsRef.current || document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      }
    } catch {
    }
  };

  const showOverlay = isMobile && isPortrait;

  return (
    <div ref={fsRef} style={{ position: 'relative' }}>
      <div style={{ filter: showOverlay ? 'blur(2px)' : 'none' }} aria-hidden={showOverlay}>
        {children}
      </div>

      {showOverlay && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            zIndex: 9999,
          }}
        >
          <div>
            <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 12 }}>📱↻</div>
            <h4 style={{ marginBottom: 8 }}>Please rotate your device</h4>
            <p style={{ margin: 0 }}>
              This Sankey chart is best viewed in <strong>landscape</strong> on mobile.
            </p>
            <button
              type="button"
              onClick={tryLockLandscape}
              style={{
                marginTop: 16,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: '#f7f7f7',
                cursor: 'pointer',
              }}
            >
              Try switching to landscape
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
