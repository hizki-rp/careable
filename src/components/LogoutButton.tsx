'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">{user.fullName}</p>
        <p className="capitalize">{user.role}</p>
      </div>
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        variant="outline"
        className="w-full"
        size="sm"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}
