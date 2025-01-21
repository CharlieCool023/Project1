"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProductDetails } from "@/app/(users)/components/product-details"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getProductFromBlockchain, type Product } from "@/lib/kaleido"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"

export default function AdditionSuccessContent() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const batchNumber = searchParams.get("id")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (batchNumber) {
          console.log("Fetching product with batch number:", batchNumber)
          const productDetails = await getProductFromBlockchain(batchNumber)
          console.log("Product details:", productDetails)
          if (productDetails) {
            setProduct(productDetails)
          } else {
            throw new Error("Product details not available. The product may have been added, but retrieval failed.")
          }
        } else {
          throw new Error("No batch number provided.")
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
  }, [batchNumber, toast])

  if (isLoading) {
    return <div>Loading product details...</div>
  }

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
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-center text-green-500 mb-4">
        <CheckCircle className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold">Product Added Successfully</h1>
      </div>
      <ProductDetails
        productId={batchNumber || ""}
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
          <QRCodeSVG value={batchNumber || ""} size={150} />
        </div>
        <Link href="/add-products">
          <Button>Add Another Product</Button>
        </Link>
      </div>
    </div>
  )
}

