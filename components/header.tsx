"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, BookOpen, Home, Info, Phone, User, LogIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        scrolled ? "border-b shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Ôn thi đi
            </span>
            <span className="text-xs text-muted-foreground">Designed & Developed TruongDat</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            Trang Chủ
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Info className="h-4 w-4" />
            Giới Thiệu
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Phone className="h-4 w-4" />
            Liên Hệ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">DK</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Lịch sử làm bài</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="container py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  Trang Chủ
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Info className="h-4 w-4" />
                  Giới Thiệu
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  Liên Hệ
                </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Đăng Nhập
                  </Button>
                  <Button className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Đăng Ký
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
