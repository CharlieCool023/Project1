"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getProductFromBlockchain, type Product } from "@/lib/kaleido";
import { ProductDetails } from "@/app/(users)/components/product-details";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Define the type for the batchNumber prop
interface VerificationSuccessContentProps {
  batchNumber: string;
}

function VerificationSuccessContent({ batchNumber }: VerificationSuccessContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (batchNumber) {
          const productDetails = await getProductFromBlockchain(batchNumber);
          if (productDetails) {
            setProduct(productDetails);
          } else {
            throw new Error("Product not found. This product may not be authentic.");
          }
        } else {
          throw new Error("No product ID provided.");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch product details. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch product details. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [batchNumber, toast]);

  if (isLoading) return <div>Loading product details...</div>;

  if (error || !product) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold">Verification Failed</h1>
        </div>
        <p className="text-center text-red-500">{error}</p>
        <div className="flex justify-center">
          <Link href="/verify-products">
            <Button>Verify Another Product</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-center text-green-500 mb-4">
        <CheckCircle className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold">Verification Successful</h1>
      </div>
      {product && (
        <ProductDetails
          productId={batchNumber}
          batchNumber={product.batchNumber}
          productName={product.productName}
          manufacturingDate={product.manufacturingDate}
          expiryDate={product.expiryDate}
          nafdacNumber={product.nafdacNumber}
          productImage={product.productImage}
        />
      )}
      <div className="flex justify-center">
        <Link href="/verify-products">
          <Button>Verify Another Product</Button>
        </Link>
      </div>
    </div>
  );
}

export default function VerificationSuccess() {
  const [batchNumber, setBatchNumber] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const batchNumberParam = searchParams.get("id");
    if (batchNumberParam) {
      setBatchNumber(batchNumberParam);
    }
  }, []);

  if (!batchNumber) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold">Product ID Missing</h1>
        </div>
        <p className="text-center text-red-500">No product ID provided in the URL.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationSuccessContent batchNumber={batchNumber} />
    </Suspense>
  );
}
