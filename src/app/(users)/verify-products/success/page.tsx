import { Suspense } from "react"
import VerificationSuccessContent from "./verification-success-content"

export default function VerificationSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationSuccessContent />
    </Suspense>
  )
}

