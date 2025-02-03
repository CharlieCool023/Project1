import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"

export function Header() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Image src="/images/xora.svg" alt="Company Logo" width={32} height={32} />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <h1 className="text-xl font-bold">Product Verification System</h1>
          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="mr-6"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </div>
    </header>
  )
}

