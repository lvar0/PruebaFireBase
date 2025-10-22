'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AddFigureForm } from '@/components/add-figure-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          <Skeleton className="h-16 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a message telling user they are being redirected
  }

  return (
    <div className="container py-12 flex justify-center">
      <AddFigureForm />
    </div>
  );
}
