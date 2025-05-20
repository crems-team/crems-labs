import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated && !keycloak.isTokenExpired();

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default PrivateRoute;
// import { useKeycloak } from "@react-keycloak/web";
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

// const PrivateRoute = ({ children }) => {
//     const { keycloak } = useKeycloak();
//     /* const navigate = useNavigate();

//     useEffect(() => {
//         if (!keycloak.authenticated) {
//             //navigate('/');
//         }
//     }, [keycloak.authenticated, navigate]); */

//     return keycloak.authenticated ? children : null;
// };

// export default PrivateRoute;
