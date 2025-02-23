"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductDetails } from "@/app/(users)/components/product-details"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getProductFromBlockchain, type Product } from "@/lib/kaleido"
import { useToast } from "@/hooks/use-toast"

export default function VerificationSuccessContent() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const productID = searchParams.get("id")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (productID) {
          console.log("Fetching product with ID:", productID)
          const productDetails = await getProductFromBlockchain(productID)
          console.log("Product details:", productDetails)
          if (productDetails) {
            setProduct(productDetails)
          } else {
            throw new Error("Product not found. This product may not be authentic.")
          }
        } else {
          throw new Error("No product ID provided.")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch product details. Please try again later.")
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch product details. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [productID, toast])

  if (isLoading) {
    return <div>Loading product details...</div>
  }

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
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-center text-green-500 mb-4">
        <CheckCircle className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold">Verification Successful</h1>
      </div>
      <ProductDetails
        productID={product.productID}
        batchNumber={product.batchNumber}
        name={product.name}
        productionDate={product.productionDate}
        expiryDate={product.expiryDate}
        nafdacNumber={product.nafdacNumber}
        timestamp={product.timestamp}
        producer={product.producer}
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

