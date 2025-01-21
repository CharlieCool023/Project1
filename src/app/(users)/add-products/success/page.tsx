import { Suspense } from "react"
import AdditionSuccessContent from "./addition-success-content"

export default function AdditionSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdditionSuccessContent />
    </Suspense>
  )
}

