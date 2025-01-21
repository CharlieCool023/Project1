"use client";

import { Suspense, useEffect, useState } from "react";
import { ProductDetails } from "@/app/(users)/components/product-details";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getProductFromBlockchain, type Product } from "@/lib/kaleido";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

// Component for rendering the product details and handling the loading state
const AdditionSuccessContent = ({ batchNumber }: { batchNumber: string }) => {
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
            throw new Error("Product details not available. Retrieval failed.");
          }
        } else {
          throw new Error("No batch number provided.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch product details.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
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
        <div className="flex items-center justify-center text-yellow-500 mb-4">
          <AlertCircle className="w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold">Product Added with Issues</h1>
        </div>
        <p className="text-center text-red-500">{error}</p>
        <div className="flex justify-center">
          <Link href="/add-products">
            <Button>Add Another Product</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-center text-green-500 mb-4">
        <CheckCircle className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold">Product Added Successfully</h1>
      </div>
      <ProductDetails
        productId={batchNumber}
        batchNumber={product.batchNumber}
        productName={product.productName}
        manufacturingDate={product.manufacturingDate}
        expiryDate={product.expiryDate}
        nafdacNumber={product.nafdacNumber}
        productImage={product.productImage}
      />
      <div className="flex justify-center items-center space-x-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product QR Code</h2>
          <QRCodeSVG value={batchNumber} size={150} />
        </div>
        <Link href="/add-products">
          <Button>Add Another Product</Button>
        </Link>
      </div>
    </div>
  );
};

export default function AdditionSuccess() {
  const searchParams = useSearchParams();
  const batchNumber = searchParams.get("id") ?? "";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdditionSuccessContent batchNumber={batchNumber} />
    </Suspense>
  );
}
