'use client';
import { FigureList } from '@/components/figure-list';
// import { getFigures } from '@/lib/firebase/firestore'; // ahora se importa dinámicamente
import type { Figure } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';

// Mock data in case Firestore is not connected or empty
const mockFigures: Figure[] = [
    {
        id: '1',
        nombre: 'Monkey D. Luffy',
        descripcion: 'figures.luffy.description',
        precio: 89.99,
        categoria: 'One Piece',
        imagenUrl:
            'https://imgs.search.brave.com/PybSicEKGQJUo_K8Od1EwAi5corf3kQelm5wBc99inI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTF5QU1IalpBSEwu/anBn',
    },
    {
        id: '2',
        nombre: 'Naruto Uzumaki',
        descripcion: 'figures.naruto.description',
        precio: 79.99,
        categoria: 'Naruto',
        imagenUrl:
            'https://imgs.search.brave.com/Y0fOnB_lfOy-sO3Bi8T3uguAXFOm-Ptht7X4y2fgPDA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lc3Bh/ZGFzeW1hcy5jb20v/Y2RuL3Nob3AvZmls/ZXMvaW1nXzI2MDc3/OV84ODA5ZDc1YTNh/ZjcyNTliZDNlN2Nj/MjQ5MjJlMDY0ZV8x/X2Q5MTI5MGZjLWUy/YWYtNDIyMi05MmRj/LTY2ZmY1NTczNGQy/MS5qcGc_dj0xNzI5/Njc0Nzc4JndpZHRo/PTgwMA',
    },
    {
        id: '3',
        nombre: 'Son Goku UI',
        descripcion: 'figures.goku.description',
        precio: 99.99,
        categoria: 'Dragon Ball',
        imagenUrl:
            'https://imgs.search.brave.com/hpm-pNBDeO9Sf92sSdGv_G7TF5-1HNqXqs4EbUnqjUk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTE4YXduckVoTkwu/anBn',
    },
    {
        id: '4',
        nombre: 'Darth Vader',
        descripcion: 'figures.vader.description',
        precio: 129.99,
        categoria: 'Star Wars',
        imagenUrl:
            'https://imgs.search.brave.com/6QNGTE3vu7PJ8MRLV4r9s6tRseT0igcoROxaQqKyho0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYWdp/Y2Rpc25leS5lcy81/NDQ0Ni1tZWRpdW1f/ZGVmYXVsdC9kYXJ0/aC12YWRlci1maWd1/cmEtZ2FsYWN0aWMt/YWN0aW9uLmpwZw',
    },
    {
        id: '5',
        nombre: 'Roronoa Zoro',
        descripcion: 'figures.zoro.description',
        precio: 85.5,
        categoria: 'One Piece',
        imagenUrl:
            'https://imgs.search.brave.com/RV-4K22EJyp3NFKiyaNZWPFCOgyrxeof9xekjEjqMoE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzc5MTgzNC1NTE03/OTg0MjcwNjg3NF8x/MDIwMjQtRS1maWd1/cmEtY29sZWNjaW9u/LWFuaW1lLW9uZS1w/aWVjZS1nay1yb3Jv/bm9hLXpvcm8tMTBj/bS53ZWJw',
    },
    {
        id: '6',
        nombre: 'Itachi Uchiha',
        descripcion: 'figures.itachi.description',
        precio: 75.0,
        categoria: 'Naruto',
        imagenUrl:
            'https://imgs.search.brave.com/bTeXBUOmuQ3i4-RL85sMsTiDKYtZAeZjpGAKZslH10M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdzYu/ZWxiZW53YWxkLmRl/L21lZGlhLzg2Lzhk/LzFjLzE2OTg5Njg5/NzgvRTEwNzU1Mzlf/MS5qcGc',
    },
    {
        id: '7',
        nombre: 'Vegeta SSJ Blue',
        descripcion: 'figures.vegeta.description',
        precio: 95.0,
        categoria: 'Dragon Ball',
        imagenUrl:
            'https://imgs.search.brave.com/rf0fI6PeYfn-CQugpO9xH6sF0cHEuAUBdG_J8avHDMg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDE5N3o5Nmk0TUwu/anBn',
    },
    {
        id: '8',
        nombre: 'The Mandalorian',
        descripcion: 'figures.boba.description',
        precio: 110.0,
        categoria: 'Star Wars',
        imagenUrl:
            'https://imgs.search.brave.com/mVuU3JxU6XD4WAmOS5TEu-zUdoStWoSqI_PVBTh_SHk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmlr/aXBvbGlzLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8x/MC9maWd1cmEtYm9i/YS1mZXR0LXRoZS1t/YW5kYWxvcmlhbi1t/aWxlc3RvbmVzLXN0/YXItd2Fycy0zMGNt/LmpwZw',
    },
];

export default function Home() {
    const [figures, setFigures] = useState<Figure[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const { t } = useLanguage();

	useEffect(() => {
		async function loadFigures() {
			try {
				// Import dinámico para evitar bundlear código server-only en el cliente
				const mod = await import('@/lib/firebase/firestore');
				const getFigures = mod.getFigures as () => Promise<Figure[] | null>;
				let figuresData = await getFigures();
				if (!figuresData || figuresData.length === 0) {
					figuresData = mockFigures;
				}
				setFigures(figuresData);
			} catch (err) {
				console.error('Error cargando figuras:', err);
				setFigures(mockFigures);
			}
		}
		loadFigures();
	}, []);

	return (
		<div className="container py-10 flex flex-col items-center justify-center mx-auto">
			<div className="text-center mb-10">
				<h1 className="text-4xl font-bold tracking-tight font-headline lg:text-5xl">
					{t('home.title')}
				</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					{t('home.subtitle')}
				</p>
			</div>

			{figures.length > 0 ? (
				<FigureList figures={figures} />
			) : (
				<div className="text-center py-20">
					<p className="text-muted-foreground">{t('home.no_figures')}</p>
				</div>
			)}
		</div>
	);
}
