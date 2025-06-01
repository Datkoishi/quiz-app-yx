import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { StudyReminder } from "@/components/study-reminder"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hệ Thống Ôn Thi Trắc Nghiệm",
  description: "Hệ thống ôn thi trắc nghiệm các môn học",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <StudyReminder />
        </ThemeProvider>
      </body>
    </html>
  )
}
