import Link from "next/link"
import Image from "next/image"
import { Github, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/images/vie-logo.png" alt="VIE Logo" width={32} height={32} className="rounded-md" />
          <p className="text-sm text-muted-foreground">Đề cương ôn thi kết thúc học phần - Đại học Duy Tân</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Designed & Developed by{" "}
            <Link
              href="https://truongdat.glitch.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              truongdat <Globe className="h-3 w-3" />
            </Link>
          </p>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
