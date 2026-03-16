import LockedPage from '@/pages/LockedPage';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useSelector((state: any) => state.auth.token);

  if (!isLoggedIn) {
    return <LockedPage />;
  }

  return children;
};

export default ProtectedRoute;