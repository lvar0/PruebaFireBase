'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAiSuggestion } from '@/app/suggest/actions';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { Spinner } from './ui/spinner';

const suggestionSchema = z.object({
  preferences: z.string().min(10, { message: 'Por favor, describe tus preferencias en al menos 10 caracteres.' }),
});

type SuggestionValues = z.infer<typeof suggestionSchema>;

interface FigureSuggestionClientProps {
  availableFigures: string;
}

export function FigureSuggestionClient({ availableFigures }: FigureSuggestionClientProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SuggestionValues>({
    resolver: zodResolver(suggestionSchema),
  });

  const onSubmit = async (data: SuggestionValues) => {
    setError(null);
    setSuggestion(null);
    setIsLoading(true);
    try {
      const result = await getAiSuggestion(data.preferences, availableFigures);
      if (result.suggestion) {
        setSuggestion(result.suggestion);
      } else {
        setError(result.error || 'No se pudo obtener una sugerencia.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Asesor de Figuras IA</CardTitle>
          <CardDescription>
            Dinos qué te gusta (por ejemplo, "Me encantan los villanos de Star Wars" o "Busco un personaje genial de One Piece") y nuestra IA te sugerirá una figura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid w-full gap-2">
              <Label htmlFor="preferences">Tus Preferencias</Label>
              <Textarea
                id="preferences"
                placeholder="Describe tus personajes, series o estilos favoritos..."
                {...register('preferences')}
                className="min-h-[100px]"
                disabled={isLoading}
              />
              {errors.preferences && <p className="text-sm text-destructive">{errors.preferences.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                  Pensando...
                </>
              ) : (
                <>
                  Obtener Sugerencia
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {suggestion && !isLoading && (
            <Card className="mt-8 bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles />
                  Sugerencia de la IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{suggestion}</p>
              </CardContent>
            </Card>
          )}

          {error && !isLoading && (
            <div className="mt-8 text-center text-destructive">
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
