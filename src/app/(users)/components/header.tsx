'use client'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { SignOutButton, UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Image src="/images/xora.svg" alt="Company Logo" width={120} height={32} />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <h1 className="text-xl font-bold">Product Verification System</h1>
          <nav className="flex items-center space-x-1">
            <UserButton />
            <Button variant="ghost" size="sm" onClick={() => <SignOutButton />}>
              <LogOut className="h-5 w-5 mr-2" />
              Sign out
            </Button>
          
          </nav>
        </div>
      </div>
    </header>
  )
}

