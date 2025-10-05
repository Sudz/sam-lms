import { useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/auth-client';

const extractToken = (search) => {
  const params = new URLSearchParams(search);
  return params.get('token') ?? '';
};

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenFromQuery = useMemo(() => extractToken(location.search), [location.search]);
  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is required. Please use the link sent to your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/account/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Unable to reset password');
      }

      setSuccess(data?.message ?? 'Password has been reset. You can now sign in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Set a new password</h1>
            <p className="text-muted-foreground">
              Enter your new password below to regain access to your account.
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Reset password</CardTitle>
                <CardDescription>Paste your reset token (if needed) and choose a new password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="token">Reset token</Label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder="Paste the token from your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting password...' : 'Reset password'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Back to{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    sign in
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
