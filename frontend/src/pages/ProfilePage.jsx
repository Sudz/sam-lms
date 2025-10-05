import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authClient, API_BASE_URL } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const defaultProfile = {
  first_name: '',
  last_name: '',
  phone_number: '',
  country_code: '',
  bio: '',
};

export default function ProfilePage() {
  const { data: session, refetch } = authClient.useSession();
  const [profile, setProfile] = useState(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [sendingVerification, setSendingVerification] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Unable to fetch profile');
        }

        const data = await response.json();
        if (data?.data) {
          setProfile({
            first_name: data.data.first_name ?? '',
            last_name: data.data.last_name ?? '',
            phone_number: data.data.phone_number ?? '',
            country_code: data.data.country_code ?? '',
            bio: data.data.bio ?? '',
          });
        }
      } catch (error) {
        console.error(error);
        setProfileError('Unable to load profile information.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setSavingProfile(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to update profile');
      }

      setProfileMessage(data?.message ?? 'Profile updated successfully');
      await refetch();
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(`${API_BASE_URL}/account/password/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Unable to change password');
      }

      setPasswordMessage(data?.message ?? 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Unable to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSendVerification = async () => {
    if (!session?.user?.email) {
      return;
    }

    setVerificationError('');
    setVerificationMessage('');
    setSendingVerification(true);

    try {
      const response = await fetch(`${API_BASE_URL}/account/email/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: session.user.email,
          callbackURL: `${window.location.origin}/login`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Unable to send verification email');
      }

      setVerificationMessage(data?.message ?? 'Verification email sent.');
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account settings</h1>
        <p className="text-muted-foreground">Manage your personal details, password, and account security.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
            <CardDescription>Update how your information appears across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProfile ? (
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            ) : (
              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                {profileError && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {profileError}
                  </div>
                )}
                {profileMessage && (
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                    {profileMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={profile.first_name}
                      onChange={handleProfileChange('first_name')}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={profile.last_name}
                      onChange={handleProfileChange('last_name')}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      value={profile.phone_number}
                      onChange={handleProfileChange('phone_number')}
                      placeholder="071 234 5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryCode">Country code</Label>
                    <Input
                      id="countryCode"
                      value={profile.country_code}
                      onChange={handleProfileChange('country_code')}
                      placeholder="ZA"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={handleProfileChange('bio')}
                    placeholder="Tell us a little about yourself"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={session?.user?.email ?? ''} disabled />
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? 'Saving changes...' : 'Save changes'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                {passwordError && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
                {passwordMessage && (
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                    {passwordMessage}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? 'Updating password...' : 'Update password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email verification</CardTitle>
              <CardDescription>
                {session?.user?.emailVerified
                  ? 'Your email address has been verified.'
                  : 'Verify your email to access all features.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {verificationError}
                </div>
              )}
              {verificationMessage && (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                  {verificationMessage}
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.emailVerified
                    ? 'You can request another verification email if you recently changed your address.'
                    : 'We send verification emails to confirm your identity and keep your account secure.'}
                </p>
              </div>
              <Button
                type="button"
                variant={session?.user?.emailVerified ? 'secondary' : 'default'}
                disabled={sendingVerification}
                onClick={handleSendVerification}
              >
                {sendingVerification ? 'Sending...' : 'Send verification email'}
              </Button>
            </CardContent>
            <Separator />
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Need to reset your password instead?{' '}
                <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                  Request a reset link.
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
