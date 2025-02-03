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
  const [product, setProduct] = useState<any | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!productId) {
      setError("Please enter a valid Product ID.");
      return;
    }
    setLoading(true);
    try {
      const verifiedProduct = await getProductFromBlockchain(productId);
      if (!verifiedProduct || Object.keys(verifiedProduct).length === 0) {
        setProduct(null);
        setError("This product is not found in our records or is not authentic. Please check the ID and try again.");
        toast({
          title: "Product Not Authentic",
          description: "This product is not found in our records or is not authentic. Please check the ID and try again.",
          variant: "destructive",
        });
      } else {
        setProduct(verifiedProduct);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to verify product:", error);
      setError("Failed to verify product. Please try again later.");
      toast({
        title: "Verification Error",
        description: "Failed to verify product. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (result: string) => {
    setProductId(result);
    setShowScanner(false);
    handleVerify();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Heading />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Unauthenticated Users */}
        <SignedOut>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border p-8">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
              Verify Products
            </h1>
            <p className="text-center text-gray-700 mb-8">
              Enter the Product ID or scan the QR code to verify the authenticity of your product.
            </p>
            <div className="flex flex-col items-center gap-6">
              <div className="w-full flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
              <span className="text-gray-500">or</span>
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors"
              >
                <QrCode className="h-5 w-5 mr-2" /> Scan QR Code
              </button>
              {showScanner && (
                <div className="mt-4 w-full max-w-md border rounded-lg overflow-hidden shadow">
                  <QrScanner onResult={handleScan} />
                </div>
              )}
            </div>
            {error && (
              <div className="mt-6 text-center text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>

          {product && (
            <div className="mt-10 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border p-8">
              <h2 className="text-2xl font-semibold text-center text-green-600">Product Verified!</h2>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Product Details:</h3>
                <div className="space-y-3 text-gray-800">
                  <p><span className="font-semibold">Batch Number:</span> {product.batchNumber}</p>
                  <p><span className="font-semibold">Product Name:</span> {product.productName}</p>
                  <p><span className="font-semibold">Manufacturing Date:</span> {product.manufacturingDate}</p>
                  <p><span className="font-semibold">Expiry Date:</span> {product.expiryDate}</p>
                  <p><span className="font-semibold">NAFDAC Number:</span> {product.nafdacNumber}</p>
                  <p><span className="font-semibold">Quantity:</span> 200</p>
                  {product.image && (
                    <div>
                      <span className="font-semibold">Product Image:</span>
                      <img
                        src={getIPFSImageUrl(product.image)}
                        alt={product.productName}
                        className="mt-2 rounded-md shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SignedOut>

        {/* Authenticated Users */}
        <SignedIn>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border p-8 text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Welcome Back!
            </h1>
            <p className="text-gray-700 mb-8">
              As an authenticated user, you can access additional features such as managing your products.
            </p>
            <Link href="/dashboard">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg shadow hover:bg-purple-700 transition-colors">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </SignedIn>
      </main>
      <Footer />
    </div>
  );
};

export default VerificationPage;
