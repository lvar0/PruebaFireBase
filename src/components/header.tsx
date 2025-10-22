'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Boxes, Sparkles, Sprout, Languages } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

export function Header() {
  const { user, appUser, loading } = useAuth();
  const { t, setLocale, locale } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/');
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Boxes className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              FrikiFigures
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('header.admin')}
            </Link>
            <Link
              href="/suggest"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('header.ai_suggest')}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as 'en' | 'es')}>
                <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt={appUser?.nombre ?? ''} />
                    <AvatarFallback>{getInitials(appUser?.nombre)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{appUser?.nombre}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <Sprout className="mr-2 h-4 w-4" />
                  <span>{t('header.admin_panel')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/suggest')}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>{t('header.ai_suggestions')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('header.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t('header.login')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">{t('header.register')}</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
