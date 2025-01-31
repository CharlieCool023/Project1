import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchIPFSImage } from "@/lib/ipfs"

interface ProductDetailsProps {
  productID: string
  batchNumber: string
  name: string
  productionDate: string
  expiryDate: string
  nafdacNumber: string
  timestamp: string
  producer: string
  productImage: string
}

export function ProductDetails({
  productID,
  batchNumber,
  name,
  productionDate,
  expiryDate,
  nafdacNumber,
  timestamp,
  producer,
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
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <div className="relative w-[300px] h-[300px]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="mt-4 text-4xl font-bold text-primary">{productID}</div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Product ID</h3>
            <p>{productID}</p>
          </div>
          <div>
            <h3 className="font-semibold">Product Name</h3>
            <p>{name}</p>
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
            <h3 className="font-semibold">Production Date</h3>
            <p>{new Date(productionDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Expiry Date</h3>
            <p>{new Date(expiryDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Producer</h3>
            <p>{producer}</p>
          </div>
          <div>
            <h3 className="font-semibold">Added on</h3>
            <p>{new Date(timestamp).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

