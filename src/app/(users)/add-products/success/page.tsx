import AdditionSuccessClient from "./addition-success-client";

interface SearchParams {
  id?: string; // Optional string
}

export default function AdditionSuccess({
  searchParams,
}: {
  searchParams: SearchParams; // Explicit type for searchParams
}) {
  const productId = searchParams?.id ?? ""; // Fallback to empty string if id is undefined

  return <AdditionSuccessClient productId={productId} />;
}
