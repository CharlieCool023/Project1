import { Suspense } from 'react'
import VerificationSuccessClient from './verification-success-client'

export default function VerificationSuccess({ searchParams }: { searchParams: { id: string } }) {
  const productId = searchParams.id

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationSuccessClient productId={productId} />
    </Suspense>
  )
}

