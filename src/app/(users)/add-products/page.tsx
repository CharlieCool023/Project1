"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadToIPFS } from "@/lib/ipfs"
import { addProductToBlockchain, getProductFromBlockchain } from "@/lib/kaleido"
import { Loader2 } from 'lucide-react'
import type { Product } from '@/lib/kaleido';

const formSchema = z.object({
  batchNumber: z.string().min(1, { message: "Batch number is required." }),
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  manufacturingDate: z.string().min(1, { message: "Manufacturing date is required." }),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
  nafdacNumber: z.string().min(1, { message: "NAFDAC number is required." }),
  productImage: z.instanceof(File).optional(),
})

export default function AddProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchNumber: "",
      productName: "",
      manufacturingDate: "",
      expiryDate: "",
      nafdacNumber: "",
    },
  })

  console.log('Form values:', form.getValues());

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      let imageHash = "";
      if (values.productImage) {
        imageHash = await uploadToIPFS(values.productImage);
        console.log('Image uploaded to IPFS:', imageHash);
      }

      console.log('Sending product data to blockchain:', {
        batchNumber: values.batchNumber,
        productName: values.productName,
        manufacturingDate: values.manufacturingDate,
        expiryDate: values.expiryDate,
        nafdacNumber: values.nafdacNumber,
        productImage: imageHash
      });

      const batchNumber = await addProductToBlockchain(
        values.batchNumber,
        values.productName,
        values.manufacturingDate,
        values.expiryDate,
        values.nafdacNumber,
        imageHash
      );

      console.log('Product added successfully, Batch Number:', batchNumber);

      // Attempt to retrieve the product details immediately after adding
      const productDetails = await getProductFromBlockchain(batchNumber);
      console.log('Retrieved product details:', productDetails);

      if (productDetails) {
        toast({
          title: "Product added successfully",
          description: `Batch Number: ${batchNumber}`,
        });
        router.push(`/add-products/success?id=${batchNumber}`);
      } else {
        throw new Error('Product added but details could not be retrieved. Please try verifying the product.');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      let errorMessage = 'Failed to add product. Please try again.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("productImage", file)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="batchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturing Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nafdacNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NAFDAC Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter NAFDAC number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

