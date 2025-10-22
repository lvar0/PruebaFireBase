'use server';

import { suggestFigure } from '@/ai/flows/ai-suggest-figure';

export async function getAiSuggestion(preferences: string, availableFigures: string) {
  try {
    const result = await suggestFigure({ preferences, availableFigures });
    return { suggestion: result.figureSuggestion, error: null };
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return { suggestion: null, error: 'Could not get a suggestion from the AI.' };
  }
}
