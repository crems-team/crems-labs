import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";

// Validate env var
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
};

// Config Keycloak
const keycloakConfig: KeycloakConfig = {
  url: validateEnvVar('REACT_APP_KEYCLOAK_URL', process.env.REACT_APP_KEYCLOAK_URL),
  realm: validateEnvVar('REACT_APP_KEYCLOAK_REALM', process.env.REACT_APP_KEYCLOAK_REALM),
  clientId: validateEnvVar('REACT_APP_KEYCLOAK_CLIENTID', process.env.REACT_APP_KEYCLOAK_CLIENTID)
};

// Options Init
export const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  redirectUri: process.env.REACT_APP_REDIRECT_URL || window.location.origin,
  checkLoginIframe: true,
  checkLoginIframeInterval: 5, // check all  5 second
  silentCheckSsoRedirectUri: process.env.REACT_APP_REDIRECT_URL || window.location.origin,
  pkceMethod: 'S256', // Securite PKCE recommanded
  scope: 'openid profile email'
};

// Instance Keycloak
const keycloak = new Keycloak(keycloakConfig);

// Config default callbacks 
keycloak.onReady = (authenticated) => {
  console.log(`Keycloak ready. Authenticated: ${authenticated}`);
};

keycloak.onAuthSuccess = () => {
  console.log('Authentication successful');
  sessionStorage.removeItem('session_expired');
};

keycloak.onAuthError = (error) => {
  console.error('Authentication failed:', error);
};

keycloak.onAuthRefreshSuccess = () => {
  console.log('Token refresh successful');
  // Save new token
  if (keycloak.token) {
    localStorage.setItem('kc_token', keycloak.token);
  }
};

keycloak.onAuthRefreshError = () => {
  console.error('Token refresh failed');
  sessionStorage.setItem('session_expired', 'true');
};

keycloak.onAuthLogout = () => {
  console.log('User logged out');
  // Clear local storage
  localStorage.removeItem('kc_token');
  sessionStorage.setItem('session_expired', 'true');
};

keycloak.onTokenExpired = () => {
  const redirectUri = process.env.REACT_APP_REDIRECT_URL || window.location.origin;
  const sessionExpired = sessionStorage.getItem('session_expired') === 'true';

  if (sessionExpired) {
    console.log('❌ Session expirée par inactivité — redirection forcée vers le login');
    keycloak.logout({ redirectUri });
    return;
  }

  console.log('⌛ Token expiré, tentative de rafraîchissement automatique...');
  keycloak.updateToken(30)
    .then((refreshed) => {
      if (refreshed) {
        console.log('🔄 Token rafraîchi avec succès');
        if (keycloak.token) {
          localStorage.setItem('kc_token', keycloak.token);
        }
      } else {
        console.log('✅ Token toujours valide');
      }
    })
    .catch((error) => {
      console.error('❌ Échec du rafraîchissement automatique:', error);
      sessionStorage.setItem('session_expired', 'true');
    });
};


export const getToken = (): string | undefined => {
  return keycloak.token;
};

export const getRefreshToken = (): string | undefined => {
  return keycloak.refreshToken;
};

export const getUserInfo = () => {
  return {
    username: keycloak.tokenParsed?.preferred_username,
    email: keycloak.tokenParsed?.email,
    name: keycloak.tokenParsed?.name,
    roles: keycloak.tokenParsed?.realm_access?.roles || [],
    groups: keycloak.tokenParsed?.groups || []
  };
};

export const hasRole = (role: string): boolean => {
  return keycloak.hasRealmRole(role);
};

export const logout = async (redirectUri?: string): Promise<void> => {
  try {
    await keycloak.logout({
      redirectUri: redirectUri || process.env.REACT_APP_REDIRECT_URL || window.location.origin
    });
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = redirectUri || process.env.REACT_APP_REDIRECT_URL || window.location.origin;
  }
};

export const setupTokenRefresh = (): (() => void) => {
  const refreshInterval = setInterval(() => {
    if (keycloak.authenticated && keycloak.token) {
      // Vérifier si l'utilisateur est actif avant de rafraîchir
      const sessionExpired = sessionStorage.getItem('session_expired') === 'true';
      
      if (sessionExpired) {
        console.log('❌ Session expirée par inactivité - Arrêt du rafraîchissement des tokens');
        return;
      }

      keycloak.updateToken(300) // Rafraîchir si expire dans moins de 5 minutes (au lieu de 70 secondes)
        .then((refreshed) => {
          if (refreshed) {
            console.log('🔄 Token rafraîchi automatiquement');
            if (keycloak.token) {
              localStorage.setItem('kc_token', keycloak.token);
            }
          } else {
            console.log('✅ Token encore valide');
          }
        })
        .catch((error) => {
          console.error('❌ Échec du rafraîchissement automatique:', error);
          // Ne pas marquer comme expiré automatiquement - laisser le timer d'inactivité décider
        });
    }
  }, 300000); // Vérifier toutes les 5 minutes (au lieu de 60 secondes)

  console.log('🔧 Configuration du rafraîchissement automatique des tokens');
  return () => {
    console.log('🛑 Arrêt du rafraîchissement automatique des tokens');
    clearInterval(refreshInterval);
  };
};

console.log('Keycloak configuration:', {
  url: keycloakConfig.url,
  realm: keycloakConfig.realm,
  clientId: keycloakConfig.clientId
});

export default keycloak;