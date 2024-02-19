import { useState } from 'react';
import { useFetch, useTitle } from '@hooks';
import { pinService } from '@services';
import { PageLayout } from '@layouts';

export default function Explore() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const { pagedData, loading } = useFetch(
    pinService.getRandomPins,
    currentPage
  );
  useTitle("Explore random pins")
  console.log('pg', pagedData);
  return <PageLayout>Explore</PageLayout>;
}
