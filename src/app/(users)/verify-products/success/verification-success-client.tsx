"use client"

import { useEffect, useState } from 'react'
import { ProductDetails } from "@/app/(users)/components/product-details"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { getProductFromBlockchain, Product } from "@/lib/kaleido"
import { getIPFSImageUrl } from "@/lib/ipfs"

export default function VerificationSuccessClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (productId) {
          console.log('Fetching product with ID:', productId);
          const productDetails = await getProductFromBlockchain(productId);
          console.log('Product details:', productDetails);
          if (productDetails) {
            setProduct({
              ...productDetails,
              productImage: getIPFSImageUrl(productDetails.productImage)
            });
          } else {
            setError('Product details not available. The product may not exist or there was an error in retrieval.');
          }
        } else {
          setError('No product ID provided.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct()
  }, [productId])

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
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

  if (!product) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-center text-yellow-500 mb-4">
          <AlertCircle className="w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold">Product Not Found</h1>
        </div>
        <p className="text-center">The product with the given ID could not be found.</p>
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
      <ProductDetails 
        productId={productId}
        batchNumber={product.batchNumber}
        productName={product.productName}
        manufacturingDate={product.manufacturingDate}
        expiryDate={product.expiryDate}
        nafdacNumber={product.nafdacNumber}
        productImage={product.productImage}
      />
      <div className="flex justify-center">
        <Link href="/verify-products">
          <Button>Verify Another Product</Button>
        </Link>
      </div>
    </div>
  )
}

