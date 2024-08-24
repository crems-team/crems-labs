import React, { useEffect, useState } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';

const InitialRedirect: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    console.log(initialized);
    console.log(initialized);
    if (initialized && !redirected) {
      if (keycloak.authenticated) {
        navigate('/SearchByName');
      } else {
        navigate('/');
      }
      setRedirected(true);  // Ensure redirection happens only once
    }
  }, [initialized, redirected]);

  return null;
};

export default InitialRedirect;
