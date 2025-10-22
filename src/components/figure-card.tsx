'use client';

import Image from 'next/image';
import type { Figure } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface FigureCardProps {
  figure: Figure;
}

export function FigureCard({ figure }: FigureCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-primary/40 hover:shadow-xl hover:-translate-y-2 border-transparent hover:border-primary/50 bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={figure.imagenUrl}
          alt={figure.nombre}
          width={400}
          height={400}
          className="rounded-lg mx-auto object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Badge variant="secondary" className="mb-2">{figure.categoria}</Badge>
          <h3 className="font-headline text-lg font-bold line-clamp-1">{figure.nombre}</h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 h-[40px]">
            {t(figure.descripcion)}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-primary">${figure.precio.toFixed(2)}</p>
          <Button size="sm">
            <ShoppingCart className="h-3 w-3" />
            {t('figure_card.add_to_cart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
