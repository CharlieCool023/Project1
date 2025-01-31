import { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import { LoadingAnimation } from "./components/loading-animation"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { useRouter } from 'next/navigation' // Use next/navigation instead of next/router

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Product Verification Dashboard",
  description: "Verify and manage products",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  if (!isLoaded) {
    return <LoadingAnimation /> // Optional: show loading animation until auth state is loaded
  }

  // Redirect to sign-in page if the user is not signed in
  if (!isSignedIn) {
    router.push('/sign-in') 
    return null
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex h-screen flex-col">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">{children}</main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
