import { useKeycloak } from "@react-keycloak/web";

interface RenderOnRoleProps {
  children: React.ReactNode;
  requiredRoles?: string[]; 
}

const RenderOnRole: React.FC<RenderOnRoleProps> = ({ children, requiredRoles }) => {
  const { keycloak } = useKeycloak();

  if (!keycloak.authenticated) {
    return null; 
  }

  const roles = keycloak.hasRealmRole('admin');
//   const hasRequiredRole = (roles) => requiredRoles?.some((role) => _kc.hasRealmRole(role));
  const hasRole =  requiredRoles?.some((role) => keycloak.hasRealmRole(role));

  // Check if required roles are provided and user has any of them
//   const hasRequiredRole = requiredRoles
//     ? requiredRoles.some((role) => roles.includes(role))
//     : true; // Allow access if no roles are specified

  return hasRole ? <>{children}</> : null; // Render children if authorized
};

export default RenderOnRole;
