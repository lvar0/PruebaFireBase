'use server';

/**
 * @fileOverview A figure suggestion AI agent.
 *
 * - suggestFigure - A function that handles the figure suggestion process.
 * - SuggestFigureInput - The input type for the suggestFigure function.
 * - SuggestFigureOutput - The return type for the suggestFigure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFigureInputSchema = z.object({
  preferences: z.string().describe('The user preferences.'),
  availableFigures: z.string().describe('A comma-separated list of available figures.'),
});
export type SuggestFigureInput = z.infer<typeof SuggestFigureInputSchema>;

const SuggestFigureOutputSchema = z.object({
  figureSuggestion: z.string().describe('The suggested figure based on the user preferences and available figures.'),
});
export type SuggestFigureOutput = z.infer<typeof SuggestFigureOutputSchema>;

export async function suggestFigure(input: SuggestFigureInput): Promise<SuggestFigureOutput> {
  return suggestFigureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFigurePrompt',
  input: {schema: SuggestFigureInputSchema},
  output: {schema: SuggestFigureOutputSchema},
  prompt: `Eres un experto en recomendar figuras de colección y siempre respondes en español.
      
      Un usuario te dará sus preferencias y también recibirás una lista de las figuras disponibles actualmente en la tienda.
      
      Basándote en las preferencias del usuario y las figuras disponibles, sugiere UNA figura específica que le podría gustar y explica brevemente por qué.
      
      Preferencias del usuario: "{{{preferences}}}"
      Figuras disponibles: "{{{availableFigures}}}"
      
      Tu sugerencia debe ser amigable, concisa y siempre en español. Si ninguna figura coincide, explícalo amablemente.`,
});

const suggestFigureFlow = ai.defineFlow(
  {
    name: 'suggestFigureFlow',
    inputSchema: SuggestFigureInputSchema,
    outputSchema: SuggestFigureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
