"use client"

import { useEffect, useState } from "react"
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
import { addProductToBlockchain, generateShortProductID } from "@/lib/kaleido"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAuth, useUser } from "@clerk/nextjs"

const formSchema = z.object({
  batchNumber: z.string().min(1, { message: "Batch number is required." }),
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  productionDate: z.string().min(1, { message: "Production date is required." }),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
  nafdacNumber: z.string().min(1, { message: "NAFDAC number is required." }),
  productImage: z.instanceof(File).optional(),
})

export default function AddProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [productData, setProductData] = useState<z.infer<typeof formSchema> | null>(null)
  const router = useRouter();
  const { user } = useUser()
  const { isSignedIn } = useAuth();
  

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchNumber: "",
      name: "",
      productionDate: "",
      expiryDate: "",
      nafdacNumber: "",
    },
  })

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setProductData(values)
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    if (!productData || !user) return

    setIsSubmitting(true)
    try {
      let imageHash = ""
      if (productData.productImage) {
        imageHash = await uploadToIPFS(productData.productImage)
        console.log("Image uploaded to IPFS:", imageHash)
      }

      const productID = generateShortProductID()
      const timestamp = new Date().toISOString()
      const producer = `${user.firstName} ${user.lastName}`.trim()

      console.log("Sending product data to blockchain:", {
        productID,
        batchNumber: productData.batchNumber,
        name: productData.name,
        productionDate: productData.productionDate,
        expiryDate: productData.expiryDate,
        nafdacNumber: productData.nafdacNumber,
        timestamp,
        producer,
        productImage: imageHash,
      })

      const addedProductID = await addProductToBlockchain(
        productID,
        productData.batchNumber,
        productData.name,
        productData.productionDate,
        productData.expiryDate,
        productData.nafdacNumber,
        timestamp,
        producer,
        imageHash,
      )

      console.log("Product added successfully, Product ID:", addedProductID)

      toast({
        title: "Product added successfully",
        description: `Product ID: ${addedProductID}`,
      })
      router.push(`/add-products/success?id=${addedProductID}`)
    } catch (error) {
      console.error("Failed to add product:", error)
      let errorMessage = "Failed to add product. Please try again."
      if (error instanceof Error) {
        errorMessage += " Error: " + error.message
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowConfirmation(false)
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
              name="name"
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
              name="productionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Date</FormLabel>
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
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
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
            <Button type="submit">Preview Product</Button>
          </form>
        </Form>
      </CardContent>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Product Details</DialogTitle>
          </DialogHeader>
          {productData && user && (
            <div className="space-y-4">
              <p>
                <strong>Batch Number:</strong> {productData.batchNumber}
              </p>
              <p>
                <strong>Product Name:</strong> {productData.name}
              </p>
              <p>
                <strong>Production Date:</strong> {productData.productionDate}
              </p>
              <p>
                <strong>Expiry Date:</strong> {productData.expiryDate}
              </p>
              <p>
                <strong>NAFDAC Number:</strong> {productData.nafdacNumber}
              </p>
              <p>
                <strong>Producer:</strong> {`${user.firstName} ${user.lastName}`.trim()}
              </p>
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Confirm and Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

