"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Search, ArrowRight, Lock, FileText, Star, Trophy, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { WelcomeModal } from "@/components/welcome-modal"
import { activeSubjects, completedSubjects, getDifficultyColor } from "@/data/subjects"
import { PasswordDialog } from "@/components/password-dialog"

// Sử dụng allSubjects đã được import

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedQuizApp")
    if (!hasVisited) {
      setShowWelcomeModal(true)
      localStorage.setItem("hasVisitedQuizApp", "true")
    }
  }, [])

  const filteredActiveSubjects = activeSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const filteredCompletedSubjects = completedSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubjectClick = (subject: any) => {
    if (subject.requiresPassword) {
      const hasAccess = sessionStorage.getItem("adp-access") === "granted"
      if (hasAccess) {
        window.location.href = `/subjects/${subject.id}`
      } else {
        setSelectedSubject(subject.id)
        setPasswordDialogOpen(true)
      }
    } else {
      window.location.href = `/subjects/${subject.id}`
    }
  }

  const handlePasswordSuccess = () => {
    setPasswordDialogOpen(false)
    if (selectedSubject) {
      window.location.href = `/subjects/${selectedSubject}`
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Hệ thống ôn thi thông minh</span>
            <Star className="h-4 w-4 text-yellow-500" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
            Trang WEB Ôn Thi
            <br />
            <span className="text-4xl md:text-5xl">Trắc Nghiệm</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Website ôn tập trắc nghiệm, giúp bạn chuẩn bị tốt nhất cho kỳ thi kết thúc học phần
          </p>

          <div className="relative max-w-lg mx-auto mt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-25"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-white/20">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm môn học..."
                className="pl-12 pr-4 py-3 bg-transparent border-0 rounded-full focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{activeSubjects.length}</div>
              <div className="text-sm text-gray-500">Môn đang học</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedSubjects.length}</div>
              <div className="text-sm text-gray-500">Đã hoàn thành</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeSubjects.reduce((sum, s) => sum + s.questionCount, 0) +
                  completedSubjects.reduce((sum, s) => sum + s.questionCount, 0)}
              </div>
              <div className="text-sm text-gray-500">Tổng câu hỏi</div>
            </div>
          </div>
        </motion.div>

        {/* Active Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Môn Đang Học</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredActiveSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -8 }}
              onHoverStart={() => setHoveredCard(subject.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="block h-full cursor-pointer" onClick={() => handleSubjectClick(subject)}>
                <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 relative">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30 dark:from-gray-800/50 dark:via-transparent dark:to-gray-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Animated border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                  <CardHeader className={`${subject.color} relative overflow-hidden p-8`}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                    </div>

                    <div className="flex justify-between items-start relative z-10 mb-6">
                      <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/30 dark:border-gray-600/30 group-hover:scale-110 transition-transform duration-300">
                        <div className={subject.textColor}>{subject.icon}</div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        {subject.requiresPassword && (
                          <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-yellow-400/30 shadow-sm">
                            <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        )}
                        <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 dark:border-gray-600/20 shadow-sm">
                          {subject.questionCount} câu
                        </div>
                      </div>
                    </div>

                    <CardTitle className="text-xl font-bold mb-3 line-clamp-2 text-gray-800 dark:text-gray-100 leading-tight">
                      {subject.name}
                    </CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-8 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`px-3 py-2 rounded-xl text-sm font-semibold shadow-sm ${getDifficultyColor(subject.difficulty)}`}
                      >
                        {subject.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-xl">
                        <Clock className="h-4 w-4" />
                        {subject.estimatedTime}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {subject.id.includes("essay")
                          ? "💡 Luyện tập câu hỏi trả lời ngắn và tự luận để nâng cao kỹ năng phân tích và tư duy logic."
                          : subject.id.includes("tieng-anh")
                            ? "🌐 Ôn tập từ vựng và thuật ngữ tiếng Anh chuyên ngành Công nghệ thông tin một cách hiệu quả."
                            : subject.id.includes("nguyen-ly-ke-toan")
                              ? "📊 Ôn tập kiến thức kế toán từ cơ bản đến nâng cao với các bài tập thực hành chi tiết."
                              : `🎯 Làm bài trắc nghiệm để kiểm tra và củng cố kiến thức về ${subject.name}.`}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-8 pt-0">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-3 rounded-xl font-semibold text-base group-hover:scale-105">
                      {subject.requiresPassword ? "🔐 Nhập mật khẩu" : "🚀 Bắt Đầu Làm Bài"}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completed Subjects Section */}
        {(filteredCompletedSubjects.length > 0 || searchTerm === "") && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Môn Đã Hoàn Thành</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                🎉 Chúc mừng! Những môn học bạn đã thi xong - vẫn có thể ôn tập lại để củng cố kiến thức
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompletedSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (filteredActiveSubjects.length + index) * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="block h-full cursor-pointer" onClick={() => handleSubjectClick(subject)}>
                    <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group bg-gradient-to-br from-white/95 to-green-50/80 dark:from-gray-900/95 dark:to-green-900/20 backdrop-blur-sm border-0 relative">
                      {/* Success indicator */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 z-20">
                        <Trophy className="h-4 w-4" />
                        Hoàn thành
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full -translate-y-20 translate-x-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-300/10 to-emerald-300/10 rounded-full translate-y-16 -translate-x-16"></div>
                        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-green-400/5 to-emerald-400/5 rounded-full -translate-x-12 -translate-y-12"></div>
                      </div>

                      <CardHeader className={`${subject.color} relative overflow-hidden p-8 pt-12`}>
                        <div className="flex justify-between items-start relative z-10 mb-6">
                          <div className="bg-gradient-to-br from-white/40 to-white/20 dark:from-black/40 dark:to-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 dark:border-gray-600/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <div className={subject.textColor}>{subject.icon}</div>
                          </div>
                          <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-800/80 dark:to-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold border border-green-200/50 dark:border-green-700/50 shadow-sm">
                            {subject.questionCount} câu hỏi
                          </div>
                        </div>

                        <CardTitle className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight">
                          {subject.name}
                        </CardTitle>
                        <CardDescription className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {subject.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-8 pt-6 relative z-10">
                        {/* Completion info section */}
                        <div className="bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl p-6 mb-6 border border-green-200/50 dark:border-green-700/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                                <Trophy className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  Hoàn thành ngày
                                </div>
                                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                                  {subject.completedDate}
                                </div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 px-4 py-3 rounded-xl border border-green-200 dark:border-green-700">
                              <div className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                                ✨ Đã thi xong
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            🎯 Môn học đã hoàn thành xuất sắc! Ôn tập lại để duy trì và củng cố kiến thức đã học.
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-8 pt-0 relative z-10">
                        <Button
                          variant="outline"
                          className="w-full bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/60 dark:to-emerald-900/60 border-2 border-green-300/50 dark:border-green-600/50 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/70 dark:hover:to-emerald-800/70 transition-all duration-300 text-green-700 dark:text-green-300 font-semibold shadow-md hover:shadow-lg py-3 rounded-xl text-base group-hover:scale-105"
                        >
                          <BookOpen className="mr-2 h-5 w-5" />📚 Ôn Tập Lại
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredActiveSubjects.length === 0 && filteredCompletedSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy môn học</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Không tìm thấy môn học nào phù hợp với từ khóa "{searchTerm}"
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Xem tất cả môn học
              </Button>
            </div>
          </motion.div>
        )}

        {/* Features section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-gray-600 dark:text-gray-400">Những tính năng nổi bật giúp bạn học tập hiệu quả</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Đa dạng môn học",
                description: "Hệ thống cung cấp nhiều môn học khác nhau, giúp bạn ôn tập toàn diện.",
                color: "from-blue-500 to-indigo-500",
                bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: "Hỗ trợ thông minh",
                description: "Giải thích chi tiết, giúp bạn hiểu sâu hơn về từng câu hỏi.",
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Đa dạng câu hỏi",
                description: "Hỗ trợ cả câu hỏi trắc nghiệm, trả lời ngắn và tự luận, giúp ôn tập hiệu quả.",
                color: "from-green-500 to-teal-500",
                bgColor: "from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className={`bg-gradient-to-br ${feature.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20`}
              >
                <div
                  className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
      <PasswordDialog
        isOpen={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onSuccess={handlePasswordSuccess}
        subjectName={selectedSubject ? activeSubjects.find((s) => s.id === selectedSubject)?.name || "" : ""}
      />
      <Footer />
    </main>
  )
}
