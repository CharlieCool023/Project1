import axios from "axios"

export interface Product {
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

const KALEIDO_BASE_URL = process.env.NEXT_PUBLIC_KALEIDO_BASE_URL
const KALEIDO_API_KEY = process.env.NEXT_PUBLIC_KALEIDO_API_KEY
const KALEIDO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KALEIDO_CONTRACT_ADDRESS
const KALEIDO_FROM = process.env.NEXT_PUBLIC_KALEIDO_FROM

if (!KALEIDO_BASE_URL || !KALEIDO_API_KEY || !KALEIDO_CONTRACT_ADDRESS || !KALEIDO_FROM) {
  console.error("Kaleido configuration is incomplete. Please check your .env.local file.")
}

const axiosInstance = axios.create({
  baseURL: `https://${KALEIDO_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(KALEIDO_API_KEY || "")}`,
  },
  timeout: 30000, // 30 seconds timeout
})

export async function addProductToBlockchain(
  productID: string,
  batchNumber: string,
  name: string,
  productionDate: string,
  expiryDate: string,
  nafdacNumber: string,
  timestamp: string,
  producer: string,
  productImage: string,
): Promise<string> {
  try {
    console.log("Sending request to blockchain:", {
      productID,
      batchNumber,
      name,
      productionDate,
      expiryDate,
      nafdacNumber,
      timestamp,
      producer,
      productImage,
    })

    const response = await axiosInstance.post(
      `/${KALEIDO_CONTRACT_ADDRESS}/addProduct`,
      {
        productID,
        batchNumber,
        name,
        productionDate,
        expiryDate,
        nafdacNumber,
        timestamp,
        producer,
        productImage,
      },
      {
        params: {
          "kld-from": KALEIDO_FROM,
          "kld-sync": "true",
        },
      },
    )

    console.log("Blockchain response:", response.data)

    if (response.status !== 200) {
      console.error("Non-200 status code:", response.status, response.data)
      throw new Error(`Failed to add product to blockchain: ${response.status} ${JSON.stringify(response.data)}`)
    }

    // Return the productID
    return productID
  } catch (error) {
    console.error("Error adding product to blockchain:", error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
        console.error("Response headers:", error.response.headers)
        throw new Error(
          `Failed to add product to blockchain: ${error.response.status} ${JSON.stringify(error.response.data)}`,
        )
      } else if (error.request) {
        console.error("No response received:", error.request)
        throw new Error("Failed to add product to blockchain: No response received from the server")
      } else {
        throw new Error(`Failed to add product to blockchain: ${error.message}`)
      }
    } else {
      throw new Error(
        `Failed to add product to blockchain: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }
}

export async function getProductFromBlockchain(productID: string): Promise<Product | null> {
  try {
    const response = await axiosInstance.post(
      `/${KALEIDO_CONTRACT_ADDRESS}/getProduct`,
      {
        productID: productID,
      },
      {
        params: {
          "kld-from": KALEIDO_FROM,
          "kld-sync": "true",
          "kld-call": "true",
        },
      },
    )

    console.log("Blockchain response for getProduct:", response.data)

    if (response.data && response.data.output) {
      const product = response.data.output
      if (typeof product === "object" && product.productID && product.productID !== "") {
        return product as Product
      }
    }

    console.error("Invalid response format or product not found:", response.data)
    return null
  } catch (error: unknown) {
    console.error("Error getting product from blockchain:", error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to get product from blockchain: ${error.response.status} ${JSON.stringify(error.response.data)}`,
      )
    } else if (error instanceof Error) {
      throw new Error(`Failed to get product from blockchain: ${error.message}`)
    } else {
      throw new Error("Failed to get product from blockchain: Unknown error")
    }
  }
}

export function generateShortProductID(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const length = 8
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

