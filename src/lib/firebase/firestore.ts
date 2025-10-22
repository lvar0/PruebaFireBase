import { collection, getDocs, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from './config';
import type { Figure, AppUser } from '@/lib/types';

export async function getFigures(): Promise<Figure[]> {
  // guard: si estamos en el cliente pero db no está inicializado, devolver vacío
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'figuras'));
    const figures = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as Figure));
    return figures;
  } catch (error) {
    console.error("Error fetching figures: ", error);
    return [];
  }
}

export async function addFigure(figureData: Omit<Figure, 'id'>): Promise<string> {
    if (!db) throw new Error("Firebase is not configured.");
    const docRef = await addDoc(collection(db, 'figuras'), figureData);
    return docRef.id;
}


export async function createUserProfile(userId: string, data: { nombre: string; email: string | null }) {
  if (!db) throw new Error("Firebase is not configured.");
  try {
    await setDoc(doc(db, 'usuarios', userId), data);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Could not create user profile.');
  }
}

export async function getUserProfile(userId: string): Promise<AppUser | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'usuarios', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as AppUser;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// añadir export default para compatibilidad con imports dinámicos que esperan default
export default getFigures;
