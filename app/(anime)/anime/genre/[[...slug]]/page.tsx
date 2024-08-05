import React from 'react';
import Image from 'next/image';
import { Card, Box, Flex, Text, Grid, Button } from '@radix-ui/themes';
import Link from 'next/link';
import { getData } from '@/components/core/GetData/GetData';
import AnimeGrid from '@/components/AnimeGrid2';

interface HomeData {
  status: string;
  data: Genre[];
}

interface Genre {
  name: string;
  slug: string;
  otakudesu_url: string;
}

interface GenreDetailData {
  status: string;
  data: {
    anime: Anime[];
    pagination: Pagination;
  };
}

interface Anime {
  title: string;
  slug: string;
  poster: string;
  episode_count: string;
  rating: string;
  season: string;
  studio: string;
  synopsis: string;
  otakudesu_url: string;
  genres: Genre[];
}

interface Pagination {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number | null;
  has_previous_page: boolean;
  previous_page: number | null;
}

interface DetailAnimePageProps {
  params: {
    slug: string[];
  };
}

const BASEURL = process.env.ANIME || 'https://otakudesu-unofficial-api.vercel.app';

const fetchHomeData = async (): Promise<HomeData> => {
  const res = await fetch(`${BASEURL}/v1/genres`, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

const fetchGenreData = async (slug: string[]): Promise<GenreDetailData | null> => {
  const genreSlug = slug.join('/');
  try {
    const data = await getData(`${BASEURL}/v1/genres/${genreSlug}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return null;
  }
};

const GenrePage = async ({ params }: DetailAnimePageProps) => {
  const { slug } = params;

  if (!slug || slug.length === 0) {
    const homeData = await fetchHomeData();

    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Genres</h1>
        <Grid columns={{ sm: '3', md: '5', lg: '7' }} gap="4">
          {homeData.data.map((genre) => (
            <Card key={genre.slug} className="shadow-lg rounded-lg overflow-hidden flex flex-col items-center p-4">
              <Box className="mt-4 text-center">
                <Link key={genre.slug} href={`/anime/genre/${genre.slug}`} className="text-blue-600 hover:underline">
                  <Text as="div" size="2" weight="bold" className="text-lg mb-2">
                    {genre.name}
                  </Text>
                </Link>
              </Box>
            </Card>
          ))}
        </Grid>
      </main>
    );
  }

  const genreDetailData = await fetchGenreData(slug);

  if (!genreDetailData) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mt-8 mb-4">Error Loading Data</h1>
        <p>Could not fetch data from the API. Please try again later.</p>
      </main>
    );
  }

  if (!Array.isArray(genreDetailData.data.anime)) {
    console.error('Expected genreDetailData.data.anime to be an array');
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mt-8 mb-4">No Data Available</h1>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mt-8 mb-4">Genre: {slug[0]}</h1>
      <AnimeGrid animes={genreDetailData.data.anime} />
      <PaginationComponent pagination={genreDetailData.data.pagination} params={params} />
    </main>
  );
};

const PaginationComponent = ({ pagination, params }: { pagination: Pagination; params: DetailAnimePageProps['params'] }) => {
  const { slug } = params;
  const genreSlug = slug[0];
  const currentPage = slug[1] ? parseInt(slug[1], 10) : 1;

  return (
    <div className="flex justify-between mt-8">
      {pagination.has_previous_page && pagination.previous_page !== null && (
        <div className="text-2xl font-bold mt-8 mb-4">
        <Link href={`/anime/genre/${genreSlug}${currentPage > 2 ? `/${currentPage - 1}` : ''}`} className="text-blue-600 hover:underline">
         <Button size="3" >
          Previous
         </Button>
        </Link>
        </div>
      )}
      {pagination.has_next_page && pagination.next_page !== null && (
        <div className="text-2xl font-bold mt-8 mb-4">
        <Link href={`/anime/genre/${genreSlug}/${currentPage + 1}`} className="text-blue-600 hover:underline">
        <Button size="3" >
          Next
          </Button>
        </Link>
        </div>
      )}
    </div>
  );
};

export default GenrePage;
