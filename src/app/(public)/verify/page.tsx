'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Footer from '@/components/footer';
import Heading from '@/components/header2';

const VerificationPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/dashboard'); // Prefetch the dashboard page for faster navigation
  }, [router]);

  return (
    <div>
      {/* Redirect if signed in */}
      <SignedIn>
        <RedirectToDashboard router={router} />
      </SignedIn>

      {/* Show verification page for unauthenticated users */}
      <SignedOut>
        <div>
          <Heading />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto my-8 border-dotted border-2 border-gray-400 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Verify Products</h1>
          <p className="text-center text-gray-600 mb-6">
            Enter the Product ID below or scan the QR code to verify the authenticity of your product.
          </p>

          {/* Input Section */}
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              onClick={() => console.log('QR Code Scanner Opened')} // Replace with QR scanner logic
            >
              Scan QR Code
            </button>
            <input
              type="text"
              placeholder="Enter Product ID"
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
              onClick={() => console.log('Verify Product')} // Replace with verification logic
            >
              Verify
            </button>
          </div>
        </div>

        <Footer />
      </SignedOut>
    </div>
  );
};

const RedirectToDashboard = ({ router }: { router: ReturnType<typeof useRouter> }) => {
  useEffect(() => {
    router.push('/dashboard'); // Redirect to dashboard
  }, [router]);

  return null; // Don't render anything
};

export default VerificationPage;
