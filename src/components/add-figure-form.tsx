'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addFigureAction } from '@/app/admin/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const figureSchema = z.object({
  nombre: z.string().min(3, 'Name must be at least 3 characters'),
  descripcion: z.string().min(10, 'Description must be at least 10 characters'),
  categoria: z.string().min(2, 'Category must be at least 2 characters'),
  precio: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  imagen: z.instanceof(File).refine(file => file.size > 0, 'Image is required.'),
});

type FigureFormValues = z.infer<typeof figureSchema>;

const initialState = {
  message: '',
  success: false,
};

export function AddFigureForm() {
  const [state, formAction] = useFormState(addFigureAction, initialState);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FigureFormValues>({
    resolver: zodResolver(figureSchema),
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        reset();
      }
    }
  }, [state, toast, reset]);

  const onSubmit = (data: FigureFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formAction(formData);
  };
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Add New Figure</CardTitle>
        <CardDescription>Fill in the details to add a new figure to the store.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Figure Name</Label>
            <Input id="nombre" {...register('nombre')} placeholder="e.g., Son Goku - Ultra Instinct" />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Description</Label>
            <Textarea id="descripcion" {...register('descripcion')} placeholder="A brief description of the figure" />
            {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="categoria">Category</Label>
              <Input id="categoria" {...register('categoria')} placeholder="e.g., Dragon Ball" />
              {errors.categoria && <p className="text-xs text-destructive">{errors.categoria.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precio">Price</Label>
              <Input id="precio" type="number" step="0.01" {...register('precio')} placeholder="e.g., 99.99" />
              {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="imagen">Figure Image</Label>
            <Input id="imagen" type="file" {...register('imagen')} accept="image/*" />
            {errors.imagen && <p className="text-xs text-destructive">{errors.imagen.message}</p>}
          </div>
          
          {!state.success && state.message && (
             <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Form Error</AlertTitle>
               <AlertDescription>{state.message}</AlertDescription>
             </Alert>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Figure...' : 'Add Figure'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
