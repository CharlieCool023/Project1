import AdditionSuccessClient from "./addition-success-client";

export default async function AdditionSuccess({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const productId = searchParams?.id ?? "";

  return (
    <AdditionSuccessClient productId={productId} />
  );
}
