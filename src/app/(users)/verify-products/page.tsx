"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Search } from "lucide-react"
import { toast, useToast } from "@/hooks/use-toast"
import { getProductFromBlockchain } from "@/lib/kaleido"
import { getIPFSImageUrl } from "@/lib/ipfs"
import { Html5QrcodeScanner } from "html5-qrcode"
import { useUser } from "@clerk/nextjs"  // Import useUser hook from Clerk

function QrScanner({ onResult }: { onResult: (result: string) => void }) {
  const scannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scannerRef.current) {
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false)
      scanner.render((decodedText) => {
        onResult(decodedText)
        scanner.clear()
      }, console.error)

      return () => {
        scanner.clear()
      }
    }
  }, [onResult])

  return <div id="qr-reader" ref={scannerRef} />
}

export default function VerifyProducts() {
  const { isSignedIn, isLoaded } = useUser() // Check if the user is signed in and if the user data is loaded
  const [productId, setProductId] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const router = useRouter()

  // If the user is not signed in and the user data is loaded, redirect to the sign-in page
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")  // Adjust the path to your sign-in page
    }
  }, [isLoaded, isSignedIn, router])

  const handleVerify = async () => {
    try {
      const product = await getProductFromBlockchain(productId)
      if (product) {
        const productWithImageUrl = {
          ...product,
          productImage: getIPFSImageUrl(product.productImage),
        }
        router.push(`/verify-products/success?id=${productId}`)
      } else {
        toast({
          title: "Product Not Authenticated",
          description: "This product is not found in our records. Please check the ID and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to verify product:", error)
      toast({
        title: "Verification Error",
        description: "Failed to verify product. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleScan = (result: string) => {
    setProductId(result)
    setShowScanner(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verify Products</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <Button onClick={handleVerify}>
          <Search className="mr-2 h-4 w-4" /> Verify
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
  )
}
