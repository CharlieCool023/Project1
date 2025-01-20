import { Suspense } from 'react';
import AdditionSuccessClient from './addition-success-client';

export default async function AdditionSuccess({ searchParams }: { searchParams: { id: string } | Promise<{ id: string }> }) {
  // Handle both synchronous and asynchronous `searchParams`
  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams?.id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdditionSuccessClient productId={productId} />
    </Suspense>
  );
}
