'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // If user is already logged in, redirect to their default page
  useEffect(() => {
    if (!loading && user) {
      const redirectPath = getDefaultRedirectPath(user.role);
      const redirect = searchParams.get('redirect');
      const finalPath = redirect && isValidRedirect(redirect) ? redirect : redirectPath;
      router.push(finalPath);
    }
  }, [user, loading, router, searchParams]);

  const getDefaultRedirectPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'receptionist':
      case 'doctor':
      case 'laboratorian':
        return '/reception/queue';
      default:
        return '/';
    }
  };

  const isValidRedirect = (path: string): boolean => {
    // Ensure path starts with / and doesn't redirect to external URL
    return path.startsWith('/') && !path.startsWith('//');
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await login(data.username, data.password);

      // Determine redirect path
      const redirectPath = getDefaultRedirectPath(user?.role || 'receptionist');
      const redirect = searchParams.get('redirect');
      const finalPath = redirect && isValidRedirect(redirect) ? redirect : redirectPath;

      router.push(finalPath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-2 text-center">
          <div className="mb-4 text-2xl font-bold text-primary">
            Menaharia Medium Clinic
          </div>
          <CardTitle>Staff Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register('username')}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Username: admin</p>
            <p>Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
