"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/footer";
import Heading from "@/components/header2";
import { QrCode, Search } from "lucide-react";
import { getProductFromBlockchain } from "@/lib/kaleido";
import { getIPFSImageUrl } from "@/lib/ipfs";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import router from "next/router";
import Link from "next/link";

const QrScanner = ({ onResult }: { onResult: (result: string) => void }) => {
  const scannerRef = React.useRef<HTMLDivElement>(null);

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
};

const VerificationPage = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<any | null>(null); // State for the verified product data
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state
  const { toast } = useToast();

  const handleVerify = async () => {
    try {
      const verifiedProduct = await getProductFromBlockchain(productId);
      
      // Check if the product response is empty or invalid
      if (!verifiedProduct || Object.keys(verifiedProduct).length === 0) {
        setProduct(null);
        setError("This product is not found in our records or is not authentic. Please check the ID and try again.");
        toast({
          title: "Product Not Authentic",
          description: "This product is not found in our records or is not authentic. Please check the ID and try again.",
          variant: "destructive",
        });
      } else {
        setProduct(verifiedProduct); // Set product data for display
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Failed to verify product:", error);
      setError("Failed to verify product. Please try again later.");
      toast({
        title: "Verification Error",
        description: "Failed to verify product. Please try again later.",
        variant: "destructive",
      });
    }
  };
  

  const handleScan = (result: string) => {
    setProductId(result);
    setShowScanner(false);
    handleVerify(); // Trigger product verification after scanning
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Heading />
      <div className="flex-grow">
        {/* Public Section (Unauthenticated Users) */}
        <SignedOut>
          <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6 border">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
              Verify Products
            </h1>
            <p className="text-center mb-6">
              Use the product ID or scan a QR code to verify the authenticity of your product.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex w-full space-x-2 container">
                <input
                  type="text"
                  placeholder="Enter Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  onClick={handleVerify}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex"
                >
                  <Search className="inline-block h-5 w-5" /> Verify
                </button>
              </div>
              <p className="text-gray-600">or</p>
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
              >
                <QrCode className="inline-block h-5 w-5" /> Scan QR Code
              </button>
              {showScanner && (
                <div className="mt-4 w-full max-w-sm">
                  <QrScanner onResult={handleScan} />
                </div>
              )}
            </div>
          </div>

          {/* Display Verification Result */}
          {error && (
            <div className="mt-6 text-center text-red-600 font-semibold">
              {error} {/* Display the error message here */}
            </div>
          )}

          {product && (
            <div className="mt-10 max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border">
              <h2 className="text-2xl font-semibold text-center text-green-600">Product Verified!</h2>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700">Product Details:</h3>
                <div className="space-y-2 mt-4">
                  <p><strong>Batch Number:</strong> {product.batchNumber}</p>
                  <p><strong>Product Name:</strong> {product.productName}</p>
                  <p><strong>Manufacturing Date:</strong> {product.manufacturingDate}</p>
                  <p><strong>Expiry Date:</strong> {product.expiryDate}</p>
                  <p><strong>NAFDAC Number:</strong> {product.nafdacNumber}</p>
                  <p><strong>Quantity:</strong> 200</p>
                  {product.image && (
                    <div>
                      <strong>Product Image:</strong>
                      <img src={getIPFSImageUrl(product.image)} alt={product.productName} className="mt-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SignedOut>

        {/* Authenticated Section */}
        <SignedIn>
          <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6 border">
            <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
              Welcome Back!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              As an authenticated user, you can access additional features such as managing your products.
            </p>
            <div className="text-center">
              <Link href="/dashboard">
              <button
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700"
              >
                Go to Dashboard
              </button>
              </Link>
            </div>
          </div>
        </SignedIn>
      </div>
      <Footer />
    </div>
  );
};

export default VerificationPage;
