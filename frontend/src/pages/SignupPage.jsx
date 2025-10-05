import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Github, Loader2 } from 'lucide-react';
import { authClient, API_BASE_URL } from '@/lib/auth-client';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [configLoading, setConfigLoading] = useState(true);
  const [providers, setProviders] = useState({ google: false, github: false });
  const [socialLoading, setSocialLoading] = useState('');
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/account/config`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load auth configuration');
        }

        const data = await response.json();
        setProviders({
          google: Boolean(data?.data?.providers?.google),
          github: Boolean(data?.data?.providers?.github),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setConfigLoading(false);
      }
    };

    loadConfig();
  }, []);

  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
      return 'Password must include upper, lower case letters and a number';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: `${window.location.origin}/login`,
      });

      if (result?.error) {
        throw new Error(result.error.message ?? 'Unable to create account');
      }

      setSuccess('Account created successfully! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    setError('');
    setSocialLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (result?.error) {
        throw new Error(result.error.message ?? `Unable to continue with ${provider}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social sign-up failed');
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Start your learning journey today</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a free account to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              {!configLoading && (providers.google || providers.github) && (
                <div className="space-y-3">
                  <div className="grid gap-2">
                    {providers.google && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={socialLoading === 'google'}
                        onClick={() => handleSocialSignUp('google')}
                      >
                        {socialLoading === 'google' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Continue with Google
                      </Button>
                    )}
                    {providers.github && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={socialLoading === 'github'}
                        onClick={() => handleSocialSignUp('github')}
                      >
                        {socialLoading === 'github' ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Github className="mr-2 h-4 w-4" />
                        )}
                        Continue with GitHub
                      </Button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                      <span className="bg-card px-2">Or sign up with email</span>
                    </div>
                  </div>
                </div>
              )}
                {error && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
