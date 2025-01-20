import type { Metadata } from "next"
//import { Inter } from 'next/font/google'
import "./globals.css"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import { LoadingAnimation } from "./components/loading-animation"

//const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata= {
  title: "Product Verification Dashboard",
  description: "Verify and manage products",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="loading-container">
        <LoadingAnimation />
        </div>
         <div className="flex h-screen flex-col">
          <Header />
         <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

