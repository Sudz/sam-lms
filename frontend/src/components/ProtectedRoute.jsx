import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
