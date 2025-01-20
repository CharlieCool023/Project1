"use client"

import { useEffect, useState } from 'react'
import appFavicon from '././../../favicon.ico'
import Image from 'next/image'

export function LoadingAnimation() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="animate-pulse">
        <Image src={appFavicon} alt="Loading" width={64} height={64} />
      </div>
    </div>
  )
}

