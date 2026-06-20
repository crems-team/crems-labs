import { useEffect, useRef, useCallback } from 'react';
import keycloak from '../../Keycloak';

interface SessionTimerConfig {
  timeoutMinutes?: number;
  checkIntervalMs?: number;
  onSessionExpired?: () => void;
  enableKeycloakLogout?: boolean; // Nouveau paramètre
}

class SessionManager {
  private static instance: SessionManager;
  private lastActivityTime: number = Date.now();
  private timeoutId: NodeJS.Timeout | null = null;
  private config: Required<SessionTimerConfig>;

  private constructor(config: SessionTimerConfig = {}) {
    this.config = {
      timeoutMinutes: config.timeoutMinutes || 15,
      checkIntervalMs: config.checkIntervalMs || 1000,
      onSessionExpired: config.onSessionExpired || this.defaultSessionExpiredHandler,
      enableKeycloakLogout: config.enableKeycloakLogout || false
    };
  }

  public static getInstance(config?: SessionTimerConfig): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }

  private defaultSessionExpiredHandler = (): void => {
    console.log('⚠️ Session expirée par inactivité - Timeout utilisateur atteint');
    sessionStorage.setItem('session_expired', 'true');
    
    // Ne pas faire de logout automatique Keycloak ici
    // Laisser le modal gérer la reconnexion
    if (this.config.enableKeycloakLogout && keycloak.authenticated) {
      console.log('🔓 Logout Keycloak automatique');
      keycloak.logout({
        redirectUri: process.env.REACT_APP_REDIRECT_URL
      });
    }
  };

  public resetTimer = (): void => {
    this.lastActivityTime = Date.now();
    console.log('🔄 Timer d\'activité réinitialisé - Dernière activité:', new Date().toLocaleTimeString());
  };

  private checkInactivity = (): void => {
    const currentTime = Date.now();
    const elapsed = currentTime - this.lastActivityTime;
    const timeoutMs = this.config.timeoutMinutes * 60 * 1000;

    console.log(`⏱️ Vérification inactivité - Elapsed: ${Math.round(elapsed/1000)}s / Timeout: ${Math.round(timeoutMs/1000)}s`);

    if (elapsed >= timeoutMs) {
      console.log('🚨 TIMEOUT ATTEINT - Déclenchement expiration session');
      this.config.onSessionExpired();
      this.cleanup();
    } else {
      const remaining = timeoutMs - elapsed;
      console.log(`⏳ Temps restant: ${Math.round(remaining/1000)}s`);
      this.timeoutId = setTimeout(this.checkInactivity, Math.min(remaining, this.config.checkIntervalMs));
    }
  };

  public startTimer = (): void => {
    this.cleanup();
    this.lastActivityTime = Date.now();
    this.timeoutId = setTimeout(this.checkInactivity, this.config.checkIntervalMs);
  };

  public cleanup = (): void => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

  public getTimeRemaining = (): number => {
    const elapsed = Date.now() - this.lastActivityTime;
    const timeoutMs = this.config.timeoutMinutes * 60 * 1000;
    return Math.max(0, timeoutMs - elapsed);
  };
}

// Hook personnalisé amélioré
const useSessionTimer = (config?: SessionTimerConfig): {
  resetTimer: () => void;
  timeRemaining: number;
} => {
  const sessionManagerRef = useRef<SessionManager>();
  
  useEffect(() => {
    sessionManagerRef.current = SessionManager.getInstance(config);
    
    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart', 'focus'];
    
    const handleActivity = (): void => {
      sessionManagerRef.current?.resetTimer();
    };

    // Ajouter les listeners d'événements
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Démarrer le timer
    sessionManagerRef.current.startTimer();

    return () => {
      // Cleanup
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      sessionManagerRef.current?.cleanup();
    };
  }, []);

  const resetTimer = useCallback((): void => {
    sessionManagerRef.current?.resetTimer();
  }, []);

  // Pour afficher le temps restant (optionnel)
  const timeRemaining = sessionManagerRef.current?.getTimeRemaining() || 0;

  return { resetTimer, timeRemaining };
};

// Export de la fonction de reset pour utilisation externe
export const resetActivityTimer = (): void => {
    const mgr = SessionManager.getInstance();
    // on arrête d’abord tout ancien timeout
    mgr.cleanup();
    // puis on relance le timer à zéro
    mgr.startTimer();
};

export { SessionManager };


export default useSessionTimer;