"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadToIPFS } from "@/lib/ipfs";
import { addProductToBlockchain, getProductFromBlockchain } from "@/lib/kaleido";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  batchNumber: z.string().min(1, { message: "Batch number is required." }),
  productName: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  manufacturingDate: z.string().min(1, { message: "Manufacturing date is required." }),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
  nafdacNumber: z.string().min(1, { message: "NAFDAC number is required." }),
  productImage: z.instanceof(File).optional(),
});

export default function AddProductForm() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in"); // Redirect to sign-in page
    }
  }, [isSignedIn, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchNumber: "",
      productName: "",
      manufacturingDate: "",
      expiryDate: "",
      nafdacNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // ... (rest of the submit logic remains unchanged)
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("productImage", file);
    }
  };

  if (!isSignedIn) {
    return null; // Optionally render a loading state
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Form fields */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
