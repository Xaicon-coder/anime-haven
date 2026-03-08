import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'register') {
      if (username.trim().length < 3) {
        setError('Il nome utente deve avere almeno 3 caratteri');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('La password deve avere almeno 6 caratteri');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, username.trim());
      if (error) {
        setError(error);
      } else {
        setSuccess('Registrazione completata! Controlla la tua email per confermare.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <span className="text-3xl font-display font-bold text-gradient-primary">AniStream</span>
        </Link>

        <div className="gradient-card rounded-2xl border border-border p-6 sm:p-8">
          <div className="flex mb-6 bg-secondary rounded-lg p-1">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Accedi
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'register' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Registrati
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome utente</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                  placeholder="Il tuo username"
                  required
                  maxLength={30}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm"
                placeholder="la-tua@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary text-foreground px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none text-sm pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-xs">{error}</p>}
            {success && <p className="text-green-500 text-xs">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn size={16} />
              {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
