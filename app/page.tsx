"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Code, ShoppingBag, Waves, Search, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"

const subjects = [
  {
    id: "xac-suat-thong-ke",
    name: "Xác Suất Thống Kê",
    description: "Ôn tập các khái niệm và bài tập về xác suất và thống kê",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-600 dark:text-blue-400",
    questionCount: 52,
  },
  {
    id: "suc-khoe-moi-truong",
    name: "Sức Khỏe Môi Trường",
    description: "Ôn tập kiến thức về sức khỏe và môi trường",
    icon: <Waves className="h-8 w-8" />,
    color: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-600 dark:text-green-400",
    questionCount: 0,
  },
  {
    id: "toan-roi-rac",
    name: "Toán Rời Rạc",
    description: "Ôn tập các khái niệm và bài tập về toán rời rạc",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-purple-100 dark:bg-purple-950",
    textColor: "text-purple-600 dark:text-purple-400",
    questionCount: 49,
  },
  {
    id: "ky-thuat-thuong-mai-dien-tu",
    name: "Kỹ Thuật Thương Mại Điện Tử",
    description: "Ôn tập kiến thức về kỹ thuật thương mại điện tử",
    icon: <ShoppingBag className="h-8 w-8" />,
    color: "bg-orange-100 dark:bg-orange-950",
    textColor: "text-orange-600 dark:text-orange-400",
    questionCount: 0,
  },
  {
    id: "java-2",
    name: "Java 2",
    description: "Ôn tập kiến thức và bài tập về Java 2 (Fundamentals of Computing 2)",
    icon: <Code className="h-8 w-8" />,
    color: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-600 dark:text-red-400",
    questionCount: 40,
  },
]

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Hệ Thống Ôn Thi Trắc Nghiệm
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hệ thống ôn tập trắc nghiệm hiện đại giúp bạn chuẩn bị tốt nhất cho các kỳ thi
          </p>

          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm môn học..."
              className="pl-10 pr-4 py-2 rounded-full border-2 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onHoverStart={() => setHoveredCard(subject.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Link href={`/subjects/${subject.id}`} className="block h-full">
                <Card className="h-full border-2 transition-all duration-300 hover:shadow-lg hover:border-primary overflow-hidden group">
                  <CardHeader className={`${subject.color} rounded-t-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-black/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <div className={`p-3 rounded-full ${subject.color}`}>
                        <div className={subject.textColor}>{subject.icon}</div>
                      </div>
                      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {subject.questionCount} câu hỏi
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Làm bài trắc nghiệm để kiểm tra kiến thức của bạn về môn {subject.name}.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full group-hover:bg-opacity-90 transition-all">
                      Bắt Đầu Làm Bài{" "}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">Không tìm thấy môn học</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Không tìm thấy môn học nào phù hợp với từ khóa "{searchTerm}"
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                Xem tất cả môn học
              </Button>
            </motion.div>
          </div>
        )}

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-xl shadow-sm"
            >
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đa dạng môn học</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hệ thống cung cấp nhiều môn học khác nhau, giúp bạn ôn tập toàn diện.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-xl shadow-sm"
            >
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Giải thích chi tiết</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mỗi câu hỏi đều có lời giải và giải thích chi tiết, giúp bạn hiểu sâu hơn.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 p-6 rounded-xl shadow-sm"
            >
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đa dạng câu hỏi</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Hỗ trợ cả câu hỏi trắc nghiệm và câu hỏi trả lời ngắn, giúp ôn tập hiệu quả.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
