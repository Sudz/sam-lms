import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookOpen, Home, LayoutDashboard, LogIn, LogOut, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: session, isPending, refetch } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result?.error) {
        console.error('Sign out failed:', result.error);
        return;
      }

      await refetch();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
              <BookOpen className="h-8 w-8 text-primary" />
              <span>SAM LMS</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/courses" className="flex items-center gap-2 hover:text-primary transition-colors">
                <BookOpen className="h-5 w-5" />
                <span>Courses</span>
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isPending ? null : isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link
                      to="/account/profile"
                      className="flex items-center gap-2"
                      title={session?.user?.email ?? session?.user?.name ?? 'Account'}
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">Account</span>
                    </Link>
                  </Button>
                  <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={isSigningOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You are currently signed in as{' '}
                          {session?.user?.email ?? session?.user?.name ?? 'your account'}. This will end your session on this
                          device.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSigningOut}>Stay signed in</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSignOut} disabled={isSigningOut}>
                          {isSigningOut ? 'Signing out...' : 'Sign out'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">SAM LMS</h3>
              <p className="text-sm text-muted-foreground">
                Empowering African learners with quality education.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/courses" className="hover:text-primary">Browse Courses</Link></li>
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SAM LMS. Built with ❤️ for African learners.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
