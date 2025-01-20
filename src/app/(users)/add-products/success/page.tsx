import AdditionSuccessClient from "./addition-success-client";

interface SearchParams {
  id?: string; // Optional string
}

export default async function AdditionSuccess({
  searchParams,
}: {
  searchParams: Promise<SearchParams>; // Treat searchParams as a promise
}) {
  const resolvedParams = await searchParams; // Resolve the promise
  const productId = resolvedParams?.id ?? ""; // Fallback to empty string if id is undefined

  return <AdditionSuccessClient productId={productId} />;
}
