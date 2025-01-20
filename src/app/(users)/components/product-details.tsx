import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchIPFSImage } from "@/lib/ipfs"

interface ProductDetailsProps {
  productId: string
  batchNumber: string
  productName: string
  manufacturingDate: string
  expiryDate: string
  nafdacNumber: string
  productImage: string
}

export function ProductDetails({
  productId,
  batchNumber,
  productName,
  manufacturingDate,
  expiryDate,
  nafdacNumber,
  productImage,
}: ProductDetailsProps) {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg")

  useEffect(() => {
    async function loadImage() {
      const url = await fetchIPFSImage(productImage)
      setImageUrl(url)
    }
    loadImage()
  }, [productImage])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{productName}</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <div className="relative w-[300px] h-[300px]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={productName}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="mt-4 text-4xl font-bold text-primary">{productId}</div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Product ID</h3>
            <p>{productId}</p>
          </div>
          <div>
            <h3 className="font-semibold">Batch Number</h3>
            <p>{batchNumber}</p>
          </div>
          <div>
            <h3 className="font-semibold">NAFDAC Number</h3>
            <p>{nafdacNumber}</p>
          </div>
          <div>
            <h3 className="font-semibold">Manufacturing Date</h3>
            <p>{manufacturingDate}</p>
          </div>
          <div>
            <h3 className="font-semibold">Expiry Date</h3>
            <p>{expiryDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

