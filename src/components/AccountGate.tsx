import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface AccountGateProps {
  children: ReactNode;
}

const AccountGate = ({ children }: AccountGateProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gradient-primary mb-3">AniStream</h1>
          <p className="text-muted-foreground text-sm mb-8">Accedi o crea un account per continuare</p>

          <div className="space-y-3">
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all glow-primary text-sm"
            >
              <LogIn size={18} />
              Accedi
            </Link>
            <Link
              to="/auth?mode=register"
              className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-xl transition-colors text-sm border border-border"
            >
              <UserPlus size={18} />
              Crea un account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccountGate;
