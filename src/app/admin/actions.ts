'use server';

import { z } from 'zod';
import { uploadImage } from '@/lib/firebase/storage';
import { addFigure } from '@/lib/firebase/firestore';
import { revalidatePath } from 'next/cache';

const figureSchema = z.object({
  nombre: z.string().min(3),
  descripcion: z.string().min(10),
  categoria: z.string().min(2),
  precio: z.coerce.number().min(0.01),
  imagen: z.instanceof(File),
});

export async function addFigureAction(prevState: any, formData: FormData) {
  const validatedFields = figureSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check your inputs.',
      success: false,
    };
  }
  
  const { imagen, ...figureData } = validatedFields.data;

  try {
    const imagePath = `figures/${Date.now()}_${imagen.name}`;
    const imageUrl = await uploadImage(imagen, imagePath);

    await addFigure({ ...figureData, imagenUrl: imageUrl });
    
    revalidatePath('/');

    return {
      message: 'Figure added successfully!',
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to add figure. Please try again.',
      success: false,
    };
  }
}
