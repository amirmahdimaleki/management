// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../store/auth.store";
// import type { ReactNode } from "react";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

//   if (!isAuthenticated) {
//     // Redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   // Ensure children are rendered properly
//   return <>{children}</>;
// };

// export default ProtectedRoute;
