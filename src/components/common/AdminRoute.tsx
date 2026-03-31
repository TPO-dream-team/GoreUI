import LockedPage from '@/pages/LockedPage';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { token, role } = useSelector((state: any) => state.auth);

  const isLoggedIn = !!token;
  const isAdmin = role === 'admin';

  if (!isLoggedIn || !isAdmin) {
    return <LockedPage />;
  }

  return children;
};

export default AdminRoute;

