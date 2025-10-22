import { getFigures } from '@/lib/firebase/firestore';
import { FigureSuggestionClient } from '@/components/figure-suggestion-client';

export default async function SuggestPage() {
  const figures = await getFigures();
  const availableFigures = figures.map(f => `${f.nombre} (${f.categoria})`).join(', ');

  return (
    <div className="container py-12">
      <FigureSuggestionClient availableFigures={availableFigures || 'No figures available.'} />
    </div>
  );
}
