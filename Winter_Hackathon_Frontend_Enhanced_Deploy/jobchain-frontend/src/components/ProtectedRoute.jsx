import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="text-xl font-semibold text-indigo-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = role?.replace('ROLE_', '');
  const normalizedAllowedRoles = allowedRoles?.map(r => r.replace('ROLE_', ''));

  if (allowedRoles && !normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to="/merit" replace />;
  }

  return children;
}