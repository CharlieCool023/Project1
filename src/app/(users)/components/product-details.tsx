"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image'

interface ProductDetailsProps {
  productId: string;
  batchNumber: string;
  productName: string;
  manufacturingDate: string;
  expiryDate: string;
  nafdacNumber: string;
  productImage: string;
}

export function ProductDetails(props: ProductDetailsProps) {
  const {
    productId,
    batchNumber,
    productName,
    manufacturingDate,
    expiryDate,
    nafdacNumber,
    productImage
  } = props;

  const imageSrc = productImage || "/placeholder.svg";

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Failed to load image:", productImage);
    event.currentTarget.src = '/placeholder.svg';
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{productName || 'Product Name Not Available'}</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <Image src={imageSrc} alt={productName || 'Product Image'} width={300} height={300} className="rounded-lg object-cover" onError={handleImageError} />
          <div className="mt-4 text-4xl font-bold text-primary">{productId || 'ID Not Available'}</div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Product ID</h3>
            <p>{productId || 'Not Available'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Batch Number</h3>
            <p>{batchNumber || 'Not Available'}</p>
          </div>
          <div>
            <h3 className="font-semibold">NAFDAC Number</h3>
            <p>{nafdacNumber || 'Not Available'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Manufacturing Date</h3>
            <p>{manufacturingDate || 'Not Available'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Expiry Date</h3>
            <p>{expiryDate || 'Not Available'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

