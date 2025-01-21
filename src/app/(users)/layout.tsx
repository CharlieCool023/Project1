import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { LoadingAnimation } from "./components/loading-animation";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Product Verification Dashboard",
  description: "Verify and manage products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Show the loading animation until authentication is determined */}
        <div id="loading-container">
          <LoadingAnimation />
        </div>
        {/* Restrict access to signed-in users */}
        <SignedIn>
          <div className="flex h-screen flex-col font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </div>
        </SignedIn>
        {/* Redirect users to the sign-in page if they are not signed in */}
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </body>
    </html>
  );
}
