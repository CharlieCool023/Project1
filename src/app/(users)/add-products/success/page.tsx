import AdditionSuccessClient from "./addition-success-client";

interface SearchParams {
  id?: string;
}

export default function AdditionSuccess({ searchParams }: { searchParams: SearchParams }) {
  const productId = searchParams?.id || "default-id"; // Fallback if 'id' is undefined

  return <AdditionSuccessClient productId={productId} />;
}
