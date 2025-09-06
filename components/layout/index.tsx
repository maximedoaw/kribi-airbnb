"use client";

import { usePathname } from 'next/navigation';
import AppSidebar from '../app-sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-orange-50">
      {user && <AppSidebar />}
      <div className={`${user ? "lg:ml-72" : "ml-0"} p-6`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
