import type { Figure } from '@/lib/types';
import { FigureCard } from './figure-card';

interface FigureListProps {
  figures: Figure[];
}

export function FigureList({ figures }: FigureListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-6 max-w-6xl mx-auto">
      {figures.map((figure) => (
        <FigureCard key={figure.id} figure={figure} />
      ))}
    </div>
  );
}
