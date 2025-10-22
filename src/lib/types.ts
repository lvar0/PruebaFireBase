import type { User as FirebaseUser } from 'firebase/auth';

export interface Figure {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagenUrl: string;
}

export interface AppUser {
  uid: string;
  nombre: string;
  email: string | null;
}

export type AuthContextType = {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
};
