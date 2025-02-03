"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProductFromBlockchain } from "@/lib/kaleido";
import { getIPFSImageUrl } from "@/lib/ipfs";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";

interface QrScannerProps {
  onResult: (result: string) => void;
}

function QrScanner({ onResult }: QrScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );
      scanner.render(
        (decodedText) => {
          onResult(decodedText);
          scanner.clear();
        },
        console.error
      );

      return () => {
        scanner.clear();
      };
    }
  }, [onResult]);

  return <div id="qr-reader" ref={scannerRef} />;
}

export default function VerifyProducts() {
  const [productId, setProductId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isSignedIn } = useAuth();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const product = await getProductFromBlockchain(productId);
      if (product) {
        // Optionally, you can enhance the product object with its IPFS image URL:
        const productWithImageUrl = {
          ...product,
          productImage: getIPFSImageUrl(product.productImage),
        };
        // Redirect to the success page with the product ID as a query parameter
        router.push(`/verify-products/success?id=${productId}`);
      } else {
        toast({
          title: "Product Not Authenticated",
          description:
            "This product is not found in our records. Please check the ID and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to verify product:", error);
      toast({
        title: "Verification Error",
        description: "Failed to verify product. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScan = (result: string) => {
    setProductId(result);
    setShowScanner(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Verify Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <Button onClick={handleVerify} disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Verify
                  </>
                )}
              </Button>
            </div>
            <div className="text-center">
              <p className="mb-2">or</p>
              <Button onClick={() => setShowScanner(!showScanner)} variant="outline">
                <QrCode className="mr-2 h-4 w-4" /> Scan QR Code
              </Button>
            </div>
            {showScanner && (
              <div className="mt-4">
                <QrScanner onResult={handleScan} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
