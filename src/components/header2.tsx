import React from 'react'
import Image from 'next/image'
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const heading = () => {
  return (
    <div>
      <div className="header flex justify-between items-center p-4 bg-gray-100">
        <Link href={"/"}>
          <Image 
            src="/images/xora.svg"
            alt="Logo with name"
            width={120}
            height={32}
          />
        </Link>
        <div className="hidden md:block">
          <h1 className="font-bold text-3xl">Product Verification Page</h1>
        </div>
        <div>
          {/* Show UserButton if signed in */}
          <SignedIn>
            
            <SignOutButton />
          </SignedIn>
          
          {/* Show SignInButton if not signed in */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
    </div>
    </div>
  )
}

export default heading