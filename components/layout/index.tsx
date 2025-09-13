"use client";

import { usePathname } from 'next/navigation';
import AppSidebar from '../app-sidebar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Toaster } from 'react-hot-toast';

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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: 'hsl(142 76% 36%)',
              secondary: 'white',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'hsl(0 84% 60%)',
              secondary: 'white',
            },
          },
          loading: {
            iconTheme: {
              primary: 'hsl(215 84% 60%)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
