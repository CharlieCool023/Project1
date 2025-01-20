"use client"

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProductFromBlockchain } from "@/lib/kaleido"

interface Product {
  batchNumber: string;
  productName: string;
  expiryDate: string;
}

export default function ViewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real-world scenario, you'd fetch a list of product IDs first
        // For now, we'll simulate fetching 5 products
        const productIds = ['2002002', '0905','3000', '1234567', '123456']; // Replace with actual product IDs
        const fetchedProducts = await Promise.all(
          productIds.map(async (id) => {
            const product = await getProductFromBlockchain(id);
            return product ? {
              batchNumber: product.batchNumber,
              productName: product.productName,
              expiryDate: product.expiryDate,
            } : null;
          })
        );
        setProducts(fetchedProducts.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Expiry Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.batchNumber}>
              <TableCell>{product.batchNumber}</TableCell>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

