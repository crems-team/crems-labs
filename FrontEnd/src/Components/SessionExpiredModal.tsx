// src/Components/SessionExpiredModal.tsx
import React, { useState, useEffect } from 'react';

interface SessionExpiredModalProps {
  show: boolean;
  onReconnect: () => Promise<void> | void;
  redirectDelay?: number; // en secondes, délai avant redirection automatique
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  show,
  onReconnect,
  redirectDelay = 10
}) => {
  const [countdown, setCountdown] = useState<number>(redirectDelay);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);

  // Gestion du countdown et redirection automatique
  useEffect(() => {
    if (!show) return;
    setCountdown(redirectDelay);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleReconnect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, redirectDelay]);

  const handleReconnect = async () => {
    if (isReconnecting) return;
    setIsReconnecting(true);
    try {
      await onReconnect();
    } catch (err) {
      console.error('Erreur lors de la reconnexion :', err);
    }
  };

  

  if (!show) return null;
 

  return (
    <>
    {/* Backdrop */}
    <div
      className="modal-backdrop fade show"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1040
      }}
    />

    {/* Modal */}
    <div
      className="modal fade show d-block"
      id="sessionExpiredModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="sessionExpiredModalLabel"
      aria-modal="true"
      style={{ zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-warning">
          <div className="modal-header bg-warning text-dark">
            <h5
              className="modal-title d-flex align-items-center"
              id="sessionExpiredModalLabel"
            >
              <i className="fas fa-exclamation-triangle me-2"></i>
              Session Expired
            </h5>
          </div>
          <div className="modal-body text-center">
            <div className="mb-3">
              <i className="fas fa-clock fa-3x text-warning mb-3"></i>
            </div>
            <h6 className="mb-3">Your session has expired</h6>
            <p className="text-muted mb-3">
            Your session has expired due to prolonged inactivity.
          <br />
          You will be automatically redirected to the login page.
            </p>
            {countdown > 0 && (
              <div className="alert alert-info">
                <strong>
                Automatic redirection in: {countdown} second
                  {countdown > 1 ? 's' : ''}
                </strong>
              </div>
            )}
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className={`btn ${isReconnecting ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleReconnect}
              disabled={isReconnecting}
              autoFocus
            >
              {isReconnecting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                    Reconnecting...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Reconnect now

                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default SessionExpiredModal;
