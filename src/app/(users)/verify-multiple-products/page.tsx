"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProductFromBlockchain, type Product } from "@/lib/kaleido"
import { Loader2, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import router from "next/router"

export default function VerifyMultipleProducts() {
  const [productIds, setProductIds] = useState<string[]>([""])
  const [verifiedProducts, setVerifiedProducts] = useState<(Product | null)[]>([])
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    router.push("/sign-in")
    return null 
  }
  
  const addInputField = () => {
    setProductIds([...productIds, ""])
  }

  const handleInputChange = (index: number, value: string) => {
    const newProductIds = [...productIds]
    newProductIds[index] = value
    setProductIds(newProductIds)
  }

  const verifyAllProducts = async () => {
    setIsVerifying(true)
    const results = await Promise.all(
      productIds.map(async (id) => {
        if (!id.trim()) return null
        try {
          const product = await getProductFromBlockchain(id)
          if (!product) {
            toast({
              title: "Product Not Found",
              description: `Product ID ${id} is not authentic or not found. Please verify and try again.`,
              variant: "destructive",
            })
          }
          return product
        } catch (error) {
          console.error(`Error verifying product ${id}:`, error)
          toast({
            title: "Verification Error",
            description: `Failed to verify product ${id}. Please try again.`,
            variant: "destructive",
          })
          return null
        }
      }),
    )
    setVerifiedProducts(results)
    setIsVerifying(false)
    toast({
      title: "Verification Complete",
      description: `${results.filter(Boolean).length} out of ${productIds.length} products verified successfully.`,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Verify Multiple Products</h1>
      <div className="space-y-4 mb-6">
        {productIds.map((id, index) => (
          <Input
            key={index}
            placeholder={`Enter Product ID ${index + 1}`}
            value={id}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <div className="flex space-x-4 mb-8">
        <Button onClick={addInputField}>
          <Plus className="mr-2 h-4 w-4" /> Add More
        </Button>
        <Button onClick={verifyAllProducts} disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> Verify All
            </>
          )}
        </Button>
      </div>
      {verifiedProducts.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Batch Number</TableHead>
              <TableHead>NAFDAC Number</TableHead>
              <TableHead>Production Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Producer</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifiedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{productIds[index]}</TableCell>
                <TableCell>{product?.name || "N/A"}</TableCell>
                <TableCell>{product?.batchNumber || "N/A"}</TableCell>
                <TableCell>{product?.nafdacNumber || "N/A"}</TableCell>
                <TableCell>
                  {product?.productionDate ? new Date(product.productionDate).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>{product?.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>{product?.producer || "N/A"}</TableCell>
                <TableCell>{product?.timestamp ? new Date(product.timestamp).toLocaleString() : "N/A"}</TableCell>
                <TableCell>{product ? "Verified" : "Not Found"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

