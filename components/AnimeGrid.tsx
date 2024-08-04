// components/AnimeGrid.tsx
import React from 'react';
import Image from 'next/image';
import { Card, Box, Text, Grid } from '@radix-ui/themes';
import Link from 'next/link';

interface Anime {
  title: string;
  slug: string;
  poster: string;
  episode_count: string;
  rating: string;
  last_release_date: string;
  otakudesu_url: string;
}

interface AnimeGridProps {
  animes: Anime[];
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animes }) => {
  return (
    <Grid columns={{ sm: '1', md: '3', lg: '5' }} gap="4">
      {animes.map((anime) => (
        <Card key={anime.slug} className="shadow-lg rounded-lg overflow-hidden flex flex-col items-center p-4">
          <Image src={anime.poster} alt={anime.title} width={460} height={651} className="object-cover w-full h-auto" />
          <Box className="mt-4 text-center">
            <Text as="div" size="2" weight="bold" className="text-lg mb-2">
              {anime.title}
            </Text>
            <Text as="div" size="2" color="gray" className="mb-2">
              Episodes: {anime.episode_count}
            </Text>
            <Text as="div" size="2" color="gray" className="mb-2">
              Rating: {anime.rating}
            </Text>
            <Text as="div" size="2" color="gray" className="mb-2">
              Last Release Date: {anime.last_release_date}
            </Text>
            <Link href={`/anime/detail/${anime.slug}`} className="text-blue-600 hover:underline">
              Detail
            </Link>
          </Box>
        </Card>
      ))}
    </Grid>
  );
};

export default AnimeGrid;