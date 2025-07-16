import Link from "next/link"
import { Github, Globe, BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 rounded-md">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Đề cương ôn thi kết thúc học phần </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Designed & Developed by{" "}
            <Link
              href="https://truongdat.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              truongdat <Globe className="h-3 w-3" />
            </Link>
          </p>
          <Link
            href="https://github.com/Datkoishi"
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
