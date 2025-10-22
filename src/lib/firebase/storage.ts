import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export async function uploadImage(file: File, path: string): Promise<string> {
  if (!storage) throw new Error("Firebase is not configured.");
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
