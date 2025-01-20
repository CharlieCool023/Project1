import { Suspense } from 'react'
import AdditionSuccessClient from './addition-success-client'

export default function AdditionSuccess({ searchParams }: { searchParams: { id: string } }) {
  const productId = searchParams.id

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdditionSuccessClient productId={productId} />
    </Suspense>
  )
}

