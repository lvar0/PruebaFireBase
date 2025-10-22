'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUserProfile } from '@/lib/firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type RegisterValues = z.infer<typeof registerSchema>;


function GoogleSignInButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!auth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Firebase is not configured.' });
        return;
    }
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserProfile(user.uid, { nombre: user.displayName || 'Google User', email: user.email });
      toast({ title: 'Success', description: 'Logged in successfully with Google.' });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Sign in with Google'}
    </Button>
  );
}


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    if (!auth) {
        setError('Firebase is not configured.');
        return;
    }
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: 'Success', description: 'Logged in successfully.' });
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          {error && (
             <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Login Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          <GoogleSignInButton />
        </form>
      </CardContent>
    </Card>
  );
}


export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    if (!auth) {
        setError('Firebase is not configured.');
        return;
    }
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await createUserProfile(userCredential.user.uid, { nombre: data.name, email: data.email });
      toast({ title: 'Success', description: 'Account created successfully.' });
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Register</CardTitle>
        <CardDescription>Create a new account to start collecting.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
           {error && (
             <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Registration Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create an account'}
          </Button>
           <GoogleSignInButton />
        </form>
      </CardContent>
    </Card>
  );
}
