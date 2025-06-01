"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Home,
  ChevronLeft,
  ChevronRight,
  Flag,
  HelpCircle,
  Lightbulb,
  Timer,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { QuizExplanation } from "@/components/quiz-explanation"
import { MathFormula } from "@/components/math-formula"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

// Function to shuffle array randomly
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface BaseQuestion {
  id: number
  question: string
  explanation?: string
  formula?: string
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type?: "multiple_choice" | undefined
  options: string[]
  correctAnswer: number
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: "short_answer"
  correctAnswer: string
}

type Question = MultipleChoiceQuestion | ShortAnswerQuestion

// Hàm để lấy dữ liệu câu hỏi từ file JSON tương ứng
const fetchQuestions = async (subjectId: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/api/questions/${subjectId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch questions")
    }
    return await response.json()
  } catch (error) {
    console.error("Lỗi khi tải câu hỏi:", error)
    return []
  }
}

// Hàm xử lý văn bản có chứa công thức toán học
const renderMathContent = (content: string) => {
  if (!content) return null

  // Xử lý các thẻ đánh dấu trước khi tách
  const processedContent = content
    // Thẻ bôi đỏ
    .replace(/\[red\](.*?)\[\/red\]/g, '<span class="text-red-600 dark:text-red-400 font-medium">$1</span>')
    // Thẻ bôi vàng
    .replace(/\[yellow\](.*?)\[\/yellow\]/g, '<span class="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">$1</span>')
    // Thẻ quan trọng
    .replace(/\[important\](.*?)\[\/important\]/g, '<span class="text-red-600 dark:text-red-400 font-bold">$1</span>')
    // Thẻ ghi chú
    .replace(/\[note\](.*?)\[\/note\]/g, '<span class="text-blue-600 dark:text-blue-400 italic">$1</span>')

  // Tách văn bản thành các phần: văn bản thường và công thức toán học
  const parts = processedContent.split(/(\$\$.*?\$\$|\$.*?\$)/gs)

  return parts.map((part, index) => {
    // Kiểm tra nếu là công thức toán học display mode ($$...$$)
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const formula = part.slice(2, -2)
      return (
        <div key={index} className="my-2">
          <MathFormula formula={formula} display={true} className="overflow-x-auto py-2" />
        </div>
      )
    }
    // Kiểm tra nếu là công thức toán học inline mode ($...$)
    else if (part.startsWith("$") && part.endsWith("$")) {
      const formula = part.slice(1, -1)
      return <MathFormula key={index} formula={formula} display={false} className="inline-block" />
    }
    // Văn bản thường
    else {
      return <span key={index} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, "<br />") }} />
    }
  })
}

export default function SubjectQuiz() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const subjectId = params.subjectId as string
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
  const contentRef = useRef<HTMLDivElement>(null)

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [shortAnswer, setShortAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<(number | string | null)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 phút
  const [isLoading, setIsLoading] = useState(true)
  const [confirmedAnswers, setConfirmedAnswers] = useState<boolean[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([])
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Ánh xạ ID môn học sang tên hiển thị
  const subjectNames: Record<string, string> = {
    "xac-suat-thong-ke": "Xác Suất Thống Kê",
    "suc-khoe-moi-truong": "Sức Khỏe Môi Trường",
    "toan-roi-rac": "Toán Rời Rạc",
    "ky-thuat-thuong-mai-dien-tu": "Kỹ Thuật Thương Mại Điện Tử",
    "ky-thuat-thuong-mai-dien-tu-2": "Kỹ Thuật Thương Mại Điện Tử 2",
    "java-2": "Java 2 (Fundamentals of Computing 2)",
    "application-development-practices": "Application Development Practices",
    "application-development-practices-essay": "Application Development Practices - Tự Luận",
    "network-telecommunications": "Introduction to Network & Telecommunications Technology",
  }

  // Tải câu hỏi từ API
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true)
      try {
        const loadedQuestions = await fetchQuestions(subjectId)
        if (loadedQuestions.length > 0) {
          // Randomize questions for specific subjects
          const finalQuestions =
            subjectId === "java-2-multiple-choice" ||
            subjectId === "suc-khoe-moi-truong" ||
            subjectId === "ky-thuat-thuong-mai-dien-tu-2"
              ? shuffleArray(loadedQuestions)
              : loadedQuestions

          setQuestions(finalQuestions)
          setAnswers(new Array(finalQuestions.length).fill(null))
          setConfirmedAnswers(new Array(finalQuestions.length).fill(false))
        } else {
          // Tạo dữ liệu mẫu nếu không có câu hỏi
          const sampleQuestions: Question[] = [
            {
              id: 1,
              question: "Đây là câu hỏi mẫu 1 cho môn " + (subjectNames[subjectId] || subjectId),
              options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
              correctAnswer: 0,
              explanation: "Đây là lời giải mẫu cho câu hỏi 1.",
            },
            {
              id: 2,
              question: "Đây là câu hỏi mẫu 2 cho môn " + (subjectNames[subjectId] || subjectId),
              options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
              correctAnswer: 1,
              explanation: "Đây là lời giải mẫu cho câu hỏi 2.",
            },
            {
              id: 3,
              question: "Đây là câu hỏi mẫu 3 cho môn " + (subjectNames[subjectId] || subjectId),
              options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
              correctAnswer: 2,
              explanation: "Đây là lời giải mẫu cho câu hỏi 3.",
            },
          ]

          setQuestions(sampleQuestions)
          setAnswers(new Array(sampleQuestions.length).fill(null))
          setConfirmedAnswers(new Array(sampleQuestions.length).fill(false))

          toast({
            title: "Thông báo",
            description: "Đang hiển thị dữ liệu mẫu. Bạn có thể thêm câu hỏi vào file JSON tương ứng.",
          })
        }
      } catch (error) {
        console.error("Lỗi khi tải câu hỏi:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải câu hỏi. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [subjectId, toast])

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResults])

  useEffect(() => {
    // Check if this subject requires password protection
    if (subjectId === "application-development-practices" || subjectId === "application-development-practices-essay") {
      const hasAccess = sessionStorage.getItem("adp-access") === "granted"
      if (!hasAccess) {
        // Redirect back to home page if no access
        router.push("/")
        toast({
          title: "Truy cập bị từ chối",
          description: "Bạn cần nhập mật khẩu để truy cập môn học này.",
          variant: "destructive",
        })
        return
      }
    }
  }, [subjectId, router, toast])

  // Scroll to top when changing question
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0)
    }
  }, [currentQuestionIndex])

  // Chuyển đổi thời gian sang định dạng mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Xử lý khi người dùng chọn đáp án
  const handleAnswerSelect = (value: string) => {
    if (confirmedAnswers[currentQuestionIndex]) return // Không cho phép thay đổi nếu đã xác nhận

    const answerIndex = Number.parseInt(value)
    setSelectedAnswer(answerIndex)

    // Cập nhật mảng đáp án
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  // Xử lý khi người dùng nhập câu trả lời ngắn
  const handleShortAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (confirmedAnswers[currentQuestionIndex]) return // Không cho phép thay đổi nếu đã xác nhận

    const value = e.target.value
    setShortAnswer(value)

    // Cập nhật mảng đáp án
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = value
    setAnswers(newAnswers)
  }

  // Xử lý khi người dùng xác nhận đáp án
  const handleConfirmAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex]

    if (currentQuestion.type === "short_answer") {
      if (!shortAnswer.trim()) {
        toast({
          title: "Thông báo",
          description: "Vui lòng nhập câu trả lời trước khi xác nhận.",
          variant: "destructive",
        })
        return
      }
    } else {
      if (selectedAnswer === null) {
        toast({
          title: "Thông báo",
          description: "Vui lòng chọn một đáp án trước khi xác nhận.",
          variant: "destructive",
        })
        return
      }
    }

    // Cập nhật trạng thái xác nhận
    const newConfirmedAnswers = [...confirmedAnswers]
    newConfirmedAnswers[currentQuestionIndex] = true
    setConfirmedAnswers(newConfirmedAnswers)

    // Hiển thị giải thích
    setShowExplanation(true)

    // Hiển thị thông báo đúng/sai
    let isCorrect = false

    if (currentQuestion.type === "short_answer") {
      // So sánh câu trả lời ngắn (không phân biệt hoa thường và khoảng trắng)
      const userAnswer = shortAnswer.trim().toLowerCase()
      const correctAnswer = currentQuestion.correctAnswer.trim().toLowerCase()
      isCorrect = userAnswer === correctAnswer
    } else {
      // So sánh đáp án trắc nghiệm
      isCorrect = selectedAnswer === currentQuestion.correctAnswer
    }

    toast({
      title: isCorrect ? "Chính xác! 🎉" : "Chưa chính xác! 🤔",
      description: isCorrect
        ? "Bạn đã trả lời đúng câu hỏi này."
        : currentQuestion.type === "short_answer"
          ? `Đáp án đúng là: ${currentQuestion.correctAnswer}`
          : `Đáp án đúng là: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
      variant: isCorrect ? "default" : "destructive",
    })
  }

  // Xử lý khi người dùng chuyển câu hỏi
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)

      const nextQuestion = questions[currentQuestionIndex + 1]
      if (nextQuestion.type === "short_answer") {
        setShortAnswer(
          typeof answers[currentQuestionIndex + 1] === "string" ? (answers[currentQuestionIndex + 1] as string) : "",
        )
        setSelectedAnswer(null)
      } else {
        setSelectedAnswer(
          typeof answers[currentQuestionIndex + 1] === "number" ? (answers[currentQuestionIndex + 1] as number) : null,
        )
        setShortAnswer("")
      }

      setShowExplanation(false)
    } else {
      // Nếu là câu hỏi cuối cùng, hiển thị kết quả
      setShowResults(true)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)

      const prevQuestion = questions[currentQuestionIndex - 1]
      if (prevQuestion.type === "short_answer") {
        setShortAnswer(
          typeof answers[currentQuestionIndex - 1] === "string" ? (answers[currentQuestionIndex - 1] as string) : "",
        )
        setSelectedAnswer(null)
      } else {
        setSelectedAnswer(
          typeof answers[currentQuestionIndex - 1] === "number" ? (answers[currentQuestionIndex - 1] as number) : null,
        )
        setShortAnswer("")
      }

      setShowExplanation(confirmedAnswers[currentQuestionIndex - 1])
    }
  }

  // Xử lý đánh dấu câu hỏi
  const toggleBookmark = (index: number) => {
    if (bookmarkedQuestions.includes(index)) {
      setBookmarkedQuestions(bookmarkedQuestions.filter((i) => i !== index))
    } else {
      setBookmarkedQuestions([...bookmarkedQuestions, index])
    }
  }

  // Xử lý gắn cờ câu hỏi
  const toggleFlag = (index: number) => {
    if (flaggedQuestions.includes(index)) {
      setFlaggedQuestions(flaggedQuestions.filter((i) => i !== index))
    } else {
      setFlaggedQuestions([...flaggedQuestions, index])
    }
  }

  // Tính điểm
  const calculateScore = () => {
    let correctCount = 0
    answers.forEach((answer, index) => {
      const question = questions[index]
      if (question.type === "short_answer") {
        // So sánh câu trả lời ngắn (không phân biệt hoa thường và khoảng trắng)
        const userAnswer = typeof answer === "string" ? answer.trim().toLowerCase() : ""
        const correctAnswer = question.correctAnswer.trim().toLowerCase()
        if (userAnswer === correctAnswer) {
          correctCount++
        }
      } else {
        // So sánh đáp án trắc nghiệm
        if (answer === question.correctAnswer) {
          correctCount++
        }
      }
    })
    return correctCount
  }

  // Lọc câu hỏi theo tab
  const getFilteredQuestions = () => {
    switch (activeTab) {
      case "bookmarked":
        return bookmarkedQuestions
      case "flagged":
        return flaggedQuestions
      case "answered":
        return answers.map((answer, index) => (answer !== null ? index : -1)).filter((index) => index !== -1)
      case "unanswered":
        return answers.map((answer, index) => (answer === null ? index : -1)).filter((index) => index !== -1)
      default:
        return questions.map((_, index) => index)
    }
  }

  // Hiển thị kết quả
  if (showResults) {
    const score = calculateScore()
    const percentage = (score / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
        <Header />
        <div className="container mx-auto px-4 py-6 md:py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 shadow-lg overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 rounded-t-lg">
                <div className="flex justify-between items-center mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/")}
                    className="flex items-center gap-1"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Trang chủ</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowResults(false)
                      setCurrentQuestionIndex(0)
                    }}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Xem lại bài làm</span>
                  </Button>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Kết Quả Bài Thi</CardTitle>
                <p className="text-muted-foreground">{subjectNames[subjectId] || subjectId}</p>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{percentage.toFixed(0)}%</div>
                        <div className="text-sm text-muted-foreground">Điểm số</div>
                      </div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 dark:text-gray-800"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="8"
                        strokeDasharray={`${percentage * 2.51} 251.2`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
                      <div className="text-sm text-muted-foreground">Đúng</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {questions.length - score}
                      </div>
                      <div className="text-sm text-muted-foreground">Sai</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{questions.length}</div>
                      <div className="text-sm text-muted-foreground">Tổng số câu</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatTime(1800 - timeLeft)}
                      </div>
                      <div className="text-sm text-muted-foreground">Thời gian</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold mb-4">Chi tiết bài làm</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions.map((question, index) => {
                      let isCorrect = false

                      if (question.type === "short_answer") {
                        // So sánh câu trả lời ngắn
                        const userAnswer =
                          typeof answers[index] === "string" ? (answers[index] as string).trim().toLowerCase() : ""
                        const correctAnswer = question.correctAnswer.trim().toLowerCase()
                        isCorrect = userAnswer === correctAnswer
                      } else {
                        // So sánh đáp án trắc nghiệm
                        isCorrect = answers[index] === question.correctAnswer
                      }

                      return (
                        <div
                          key={question.id}
                          className={`p-4 rounded-lg border ${
                            isCorrect
                              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                              : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="w-full">
                              <div className="flex justify-between items-start">
                                <div className="font-medium mb-2 text-sm">Câu {index + 1}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setShowResults(false)
                                    setCurrentQuestionIndex(index)
                                  }}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-sm line-clamp-2 mb-1">{renderMathContent(question.question)}</div>
                              <div className="text-xs">
                                {isCorrect ? (
                                  <span className="text-green-600 dark:text-green-400">Đúng</span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400">Sai</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-1">
                  <Home className="h-4 w-4 mr-1" />
                  Trang Chủ
                </Button>
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setCurrentQuestionIndex(0)
                    setAnswers(new Array(questions.length).fill(null))
                    setConfirmedAnswers(new Array(questions.length).fill(false))
                    setTimeLeft(1800)
                    setShowExplanation(false)
                    setSelectedAnswer(null)
                    setShortAnswer("")
                    setBookmarkedQuestions([])
                    setFlaggedQuestions([])
                  }}
                  className="flex items-center gap-1"
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Làm Lại Bài Thi
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Đang tải câu hỏi...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert>
              <AlertTitle>Không có câu hỏi</AlertTitle>
              <AlertDescription>
                Chưa có câu hỏi nào cho môn học này. Vui lòng thêm câu hỏi vào file JSON tương ứng.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => router.push("/")} className="flex items-center gap-1">
                <Home className="h-4 w-4 mr-1" />
                Quay Lại Trang Chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isAnswerConfirmed = confirmedAnswers[currentQuestionIndex]

  // Kiểm tra câu trả lời có đúng không
  let isCorrect = false
  if (currentQuestion.type === "short_answer") {
    const userAnswer = shortAnswer.trim().toLowerCase()
    const correctAnswer = currentQuestion.correctAnswer.trim().toLowerCase()
    isCorrect = userAnswer === correctAnswer
  } else {
    isCorrect = selectedAnswer === currentQuestion.correctAnswer
  }

  // Lọc câu hỏi theo tab
  const filteredQuestionIndices = getFilteredQuestions()

  // Render mobile/tablet view
  if (isMobile || isTablet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
        <Header />
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="p-2">
                <Home className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold truncate max-w-[150px] sm:max-w-[250px]">
                {subjectNames[subjectId] || subjectId}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full text-xs font-medium">
                <Clock className="h-3 w-3" />
                <span className={`${timeLeft < 300 ? "text-red-500 animate-pulse" : ""}`}>{formatTime(timeLeft)}</span>
              </div>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[90vh] overflow-auto">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Danh sách câu hỏi</h3>
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="all">Tất cả ({questions.length})</TabsTrigger>
                        <TabsTrigger value="answered">
                          Đã trả lời ({answers.filter((a) => a !== null).length})
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-0">
                        <div className="grid grid-cols-5 gap-2">
                          {questions.map((_, index) => {
                            let buttonVariant = "outline"
                            let statusClass = ""

                            if (index === currentQuestionIndex) {
                              buttonVariant = "default"
                            } else if (confirmedAnswers[index]) {
                              const question = questions[index]
                              let isCorrect = false

                              if (question.type === "short_answer") {
                                const userAnswer =
                                  typeof answers[index] === "string"
                                    ? (answers[index] as string).trim().toLowerCase()
                                    : ""
                                const correctAnswer = question.correctAnswer.trim().toLowerCase()
                                isCorrect = userAnswer === correctAnswer
                              } else {
                                isCorrect = answers[index] === question.correctAnswer
                              }

                              if (isCorrect) {
                                buttonVariant = "success"
                                statusClass = "bg-green-600 hover:bg-green-700 text-white"
                              } else {
                                buttonVariant = "destructive"
                                statusClass = "bg-red-600 hover:bg-red-700 text-white"
                              }
                            } else if (answers[index] !== null) {
                              buttonVariant = "secondary"
                            }

                            return (
                              <Button
                                key={index}
                                variant={buttonVariant as any}
                                className={`h-10 w-10 p-0 relative ${statusClass}`}
                                onClick={() => {
                                  setCurrentQuestionIndex(index)
                                  setDrawerOpen(false)

                                  const question = questions[index]
                                  if (question.type === "short_answer") {
                                    setShortAnswer(typeof answers[index] === "string" ? (answers[index] as string) : "")
                                    setSelectedAnswer(null)
                                  } else {
                                    setSelectedAnswer(
                                      typeof answers[index] === "number" ? (answers[index] as number) : null,
                                    )
                                    setShortAnswer("")
                                  }

                                  setShowExplanation(confirmedAnswers[index])
                                }}
                              >
                                {index + 1}
                                {bookmarkedQuestions.includes(index) && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                                )}
                                {flaggedQuestions.includes(index) && (
                                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                              </Button>
                            )
                          })}
                        </div>
                      </TabsContent>
                      <TabsContent value="answered" className="mt-0">
                        {answers.filter((a) => a !== null).length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🤔</div>
                            <p>Bạn chưa trả lời câu hỏi nào</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, index) => {
                              if (answers[index] === null) return null

                              let buttonVariant = "outline"
                              let statusClass = ""

                              if (index === currentQuestionIndex) {
                                buttonVariant = "default"
                              } else if (confirmedAnswers[index]) {
                                const question = questions[index]
                                let isCorrect = false

                                if (question.type === "short_answer") {
                                  const userAnswer =
                                    typeof answers[index] === "string"
                                      ? (answers[index] as string).trim().toLowerCase()
                                      : ""
                                  const correctAnswer = question.correctAnswer.trim().toLowerCase()
                                  isCorrect = userAnswer === correctAnswer
                                } else {
                                  isCorrect = answers[index] === question.correctAnswer
                                }

                                if (isCorrect) {
                                  buttonVariant = "success"
                                  statusClass = "bg-green-600 hover:bg-green-700 text-white"
                                } else {
                                  buttonVariant = "destructive"
                                  statusClass = "bg-red-600 hover:bg-red-700 text-white"
                                }
                              } else {
                                buttonVariant = "secondary"
                              }

                              return (
                                <Button
                                  key={index}
                                  variant={buttonVariant as any}
                                  className={`h-10 w-10 p-0 relative ${statusClass}`}
                                  onClick={() => {
                                    setCurrentQuestionIndex(index)
                                    setDrawerOpen(false)

                                    const question = questions[index]
                                    if (question.type === "short_answer") {
                                      setShortAnswer(
                                        typeof answers[index] === "string" ? (answers[index] as string) : "",
                                      )
                                      setSelectedAnswer(null)
                                    } else {
                                      setSelectedAnswer(
                                        typeof answers[index] === "number" ? (answers[index] as number) : null,
                                      )
                                      setShortAnswer("")
                                    }

                                    setShowExplanation(confirmedAnswers[index])
                                  }}
                                >
                                  {index + 1}
                                  {bookmarkedQuestions.includes(index) && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  )}
                                  {flaggedQuestions.includes(index) && (
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                  )}
                                </Button>
                              )
                            })}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-1">
                <span>
                  Câu {currentQuestionIndex + 1}/{questions.length}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleBookmark(currentQuestionIndex)}
                      >
                        {bookmarkedQuestions.includes(currentQuestionIndex) ? (
                          <BookmarkCheck className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <Bookmark className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Đánh dấu câu hỏi</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleFlag(currentQuestionIndex)}
                      >
                        {flaggedQuestions.includes(currentQuestionIndex) ? (
                          <Flag className="h-3 w-3 text-red-500" />
                        ) : (
                          <Flag className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Gắn cờ câu hỏi</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span>{progress.toFixed(0)}% hoàn thành</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="flex flex-col space-y-4" ref={contentRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border shadow-sm overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {currentQuestionIndex + 1}
                        </div>
                        <div>{renderMathContent(currentQuestion.question)}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    {currentQuestion.type === "short_answer" ? (
                      <div className="space-y-3">
                        <Label htmlFor="short-answer" className="text-sm">
                          Nhập câu trả lời của bạn:
                        </Label>
                        <Textarea
                          id="short-answer"
                          placeholder="Nhập câu trả lời..."
                          value={shortAnswer}
                          onChange={handleShortAnswerChange}
                          disabled={isAnswerConfirmed}
                          className="min-h-[80px] text-sm"
                        />
                      </div>
                    ) : (
                      <RadioGroup
                        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
                        onValueChange={handleAnswerSelect}
                        className="space-y-2"
                      >
                        {currentQuestion.options.map((option, index) => {
                          // Xác định class cho từng đáp án
                          let optionClass =
                            "flex items-center space-x-2 p-2 rounded-lg border transition-all duration-200 text-sm"

                          if (isAnswerConfirmed) {
                            if (index === currentQuestion.correctAnswer) {
                              // Đáp án đúng
                              optionClass += " bg-green-50 dark:bg-green-900/20 border-green-500"
                            } else if (index === selectedAnswer) {
                              // Đáp án sai đã chọn
                              optionClass += " bg-red-50 dark:bg-red-900/20 border-red-500"
                            }
                          } else {
                            // Chưa xác nhận
                            optionClass += " hover:border-primary"
                          }

                          return (
                            <div key={index} className={optionClass}>
                              <RadioGroupItem
                                value={index.toString()}
                                id={`option-${index}`}
                                className="flex-shrink-0"
                                disabled={isAnswerConfirmed}
                              />
                              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                {renderMathContent(option)}
                              </Label>
                              {isAnswerConfirmed && index === currentQuestion.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-500 ml-1 flex-shrink-0" />
                              )}
                              {isAnswerConfirmed &&
                                index === selectedAnswer &&
                                index !== currentQuestion.correctAnswer && (
                                  <XCircle className="h-4 w-4 text-red-500 ml-1 flex-shrink-0" />
                                )}
                            </div>
                          )
                        })}
                      </RadioGroup>
                    )}

                    {isAnswerConfirmed && !isCorrect && (
                      <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-sm">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-700 dark:text-red-400">Đáp án đúng:</p>
                            <div className="mt-1 text-red-600 dark:text-red-300">
                              {currentQuestion.type === "short_answer"
                                ? currentQuestion.correctAnswer
                                : renderMathContent(currentQuestion.options[currentQuestion.correctAnswer])}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isAnswerConfirmed && isCorrect && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-green-700 dark:text-green-400">Chính xác!</p>
                            <p className="text-green-600 dark:text-green-300">Bạn đã trả lời đúng câu hỏi này.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {(showExplanation || isAnswerConfirmed) && currentQuestion.explanation && (
                      <div className="mt-4">
                        <QuizExplanation explanation={currentQuestion.explanation} formula={currentQuestion.formula} />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 border-t flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="text-xs h-8"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                    </Button>

                    {!isAnswerConfirmed ? (
                      <Button
                        size="sm"
                        onClick={handleConfirmAnswer}
                        disabled={
                          currentQuestion.type === "short_answer" ? !shortAnswer.trim() : selectedAnswer === null
                        }
                        className="bg-green-600 hover:bg-green-700 text-xs h-8"
                      >
                        Xác Nhận
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleNextQuestion} className="text-xs h-8">
                        {currentQuestionIndex === questions.length - 1 ? "Nộp Bài" : "Tiếp"}{" "}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => router.push("/")} className="text-xs h-8">
              <Home className="h-3 w-3 mr-1" /> Trang Chủ
            </Button>
            <Button size="sm" onClick={() => setShowResults(true)} className="text-xs h-8">
              Xem Kết Quả
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Render desktop view
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4 xl:w-1/5">
            <div className="sticky top-24">
              <Card className="border shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Danh sách câu hỏi</span>
                    <Badge variant="outline" className="font-normal">
                      {answers.filter((a) => a !== null).length}/{questions.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="h-4 w-4 text-orange-500" />
                      <span className={`${timeLeft < 300 ? "text-red-500 animate-pulse" : ""}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                  </div>

                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="all">Tất cả</TabsTrigger>
                      <TabsTrigger value="bookmarked">
                        <Bookmark className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{bookmarkedQuestions.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="flagged">
                        <Flag className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{flaggedQuestions.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="answered">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{answers.filter((a) => a !== null).length}</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                      <div className="grid grid-cols-5 gap-2">
                        {questions.map((_, index) => {
                          let buttonVariant = "outline"
                          let statusClass = ""

                          if (index === currentQuestionIndex) {
                            buttonVariant = "default"
                          } else if (confirmedAnswers[index]) {
                            const question = questions[index]
                            let isCorrect = false

                            if (question.type === "short_answer") {
                              const userAnswer =
                                typeof answers[index] === "string"
                                  ? (answers[index] as string).trim().toLowerCase()
                                  : ""
                              const correctAnswer = question.correctAnswer.trim().toLowerCase()
                              isCorrect = userAnswer === correctAnswer
                            } else {
                              isCorrect = answers[index] === question.correctAnswer
                            }

                            if (isCorrect) {
                              buttonVariant = "success"
                              statusClass = "bg-green-600 hover:bg-green-700 text-white"
                            } else {
                              buttonVariant = "destructive"
                              statusClass = "bg-red-600 hover:bg-red-700 text-white"
                            }
                          } else if (answers[index] !== null) {
                            buttonVariant = "secondary"
                          }

                          return (
                            <Button
                              key={index}
                              variant={buttonVariant as any}
                              className={`h-10 w-10 p-0 relative ${statusClass}`}
                              onClick={() => {
                                setCurrentQuestionIndex(index)

                                const question = questions[index]
                                if (question.type === "short_answer") {
                                  setShortAnswer(typeof answers[index] === "string" ? (answers[index] as string) : "")
                                  setSelectedAnswer(null)
                                } else {
                                  setSelectedAnswer(
                                    typeof answers[index] === "number" ? (answers[index] as number) : null,
                                  )
                                  setShortAnswer("")
                                }

                                setShowExplanation(confirmedAnswers[index])
                              }}
                            >
                              {index + 1}
                              {bookmarkedQuestions.includes(index) && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                              )}
                              {flaggedQuestions.includes(index) && (
                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </Button>
                          )
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="bookmarked" className="mt-0">
                      {bookmarkedQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">🔖</div>
                          <p>Chưa có câu hỏi nào được đánh dấu</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {filteredQuestionIndices.map((index) => {
                            let buttonVariant = "outline"
                            let statusClass = ""

                            if (index === currentQuestionIndex) {
                              buttonVariant = "default"
                            } else if (confirmedAnswers[index]) {
                              const question = questions[index]
                              let isCorrect = false

                              if (question.type === "short_answer") {
                                const userAnswer =
                                  typeof answers[index] === "string"
                                    ? (answers[index] as string).trim().toLowerCase()
                                    : ""
                                const correctAnswer = question.correctAnswer.trim().toLowerCase()
                                isCorrect = userAnswer === correctAnswer
                              } else {
                                isCorrect = answers[index] === question.correctAnswer
                              }

                              if (isCorrect) {
                                buttonVariant = "success"
                                statusClass = "bg-green-600 hover:bg-green-700 text-white"
                              } else {
                                buttonVariant = "destructive"
                                statusClass = "bg-red-600 hover:bg-red-700 text-white"
                              }
                            } else if (answers[index] !== null) {
                              buttonVariant = "secondary"
                            }

                            return (
                              <Button
                                key={index}
                                variant={buttonVariant as any}
                                className={`h-10 w-10 p-0 relative ${statusClass}`}
                                onClick={() => {
                                  setCurrentQuestionIndex(index)

                                  const question = questions[index]
                                  if (question.type === "short_answer") {
                                    setShortAnswer(typeof answers[index] === "string" ? (answers[index] as string) : "")
                                    setSelectedAnswer(null)
                                  } else {
                                    setSelectedAnswer(
                                      typeof answers[index] === "number" ? (answers[index] as number) : null,
                                    )
                                    setShortAnswer("")
                                  }

                                  setShowExplanation(confirmedAnswers[index])
                                }}
                              >
                                {index + 1}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="flagged" className="mt-0">
                      {flaggedQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">🚩</div>
                          <p>Chưa có câu hỏi nào được gắn cờ</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {filteredQuestionIndices.map((index) => {
                            let buttonVariant = "outline"
                            let statusClass = ""

                            if (index === currentQuestionIndex) {
                              buttonVariant = "default"
                            } else if (confirmedAnswers[index]) {
                              const question = questions[index]
                              let isCorrect = false

                              if (question.type === "short_answer") {
                                const userAnswer =
                                  typeof answers[index] === "string"
                                    ? (answers[index] as string).trim().toLowerCase()
                                    : ""
                                const correctAnswer = question.correctAnswer.trim().toLowerCase()
                                isCorrect = userAnswer === correctAnswer
                              } else {
                                isCorrect = answers[index] === question.correctAnswer
                              }

                              if (isCorrect) {
                                buttonVariant = "success"
                                statusClass = "bg-green-600 hover:bg-green-700 text-white"
                              } else {
                                buttonVariant = "destructive"
                                statusClass = "bg-red-600 hover:bg-red-700 text-white"
                              }
                            } else if (answers[index] !== null) {
                              buttonVariant = "secondary"
                            }

                            return (
                              <Button
                                key={index}
                                variant={buttonVariant as any}
                                className={`h-10 w-10 p-0 relative ${statusClass}`}
                                onClick={() => {
                                  setCurrentQuestionIndex(index)

                                  const question = questions[index]
                                  if (question.type === "short_answer") {
                                    setShortAnswer(typeof answers[index] === "string" ? (answers[index] as string) : "")
                                    setSelectedAnswer(null)
                                  } else {
                                    setSelectedAnswer(
                                      typeof answers[index] === "number" ? (answers[index] as number) : null,
                                    )
                                    setShortAnswer("")
                                  }

                                  setShowExplanation(confirmedAnswers[index])
                                }}
                              >
                                {index + 1}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="answered" className="mt-0">
                      {answers.filter((a) => a !== null).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">🤔</div>
                          <p>Bạn chưa trả lời câu hỏi nào</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-2">
                          {filteredQuestionIndices.map((index) => {
                            let buttonVariant = "outline"
                            let statusClass = ""

                            if (index === currentQuestionIndex) {
                              buttonVariant = "default"
                            } else if (confirmedAnswers[index]) {
                              const question = questions[index]
                              let isCorrect = false

                              if (question.type === "short_answer") {
                                const userAnswer =
                                  typeof answers[index] === "string"
                                    ? (answers[index] as string).trim().toLowerCase()
                                    : ""
                                const correctAnswer = question.correctAnswer.trim().toLowerCase()
                                isCorrect = userAnswer === correctAnswer
                              } else {
                                isCorrect = answers[index] === question.correctAnswer
                              }

                              if (isCorrect) {
                                buttonVariant = "success"
                                statusClass = "bg-green-600 hover:bg-green-700 text-white"
                              } else {
                                buttonVariant = "destructive"
                                statusClass = "bg-red-600 hover:bg-red-700 text-white"
                              }
                            } else {
                              buttonVariant = "secondary"
                            }

                            return (
                              <Button
                                key={index}
                                variant={buttonVariant as any}
                                className={`h-10 w-10 p-0 relative ${statusClass}`}
                                onClick={() => {
                                  setCurrentQuestionIndex(index)

                                  const question = questions[index]
                                  if (question.type === "short_answer") {
                                    setShortAnswer(typeof answers[index] === "string" ? (answers[index] as string) : "")
                                    setSelectedAnswer(null)
                                  } else {
                                    setSelectedAnswer(
                                      typeof answers[index] === "number" ? (answers[index] as number) : null,
                                    )
                                    setShortAnswer("")
                                  }

                                  setShowExplanation(confirmedAnswers[index])
                                }}
                              >
                                {index + 1}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={() => router.push("/")} className="w-full">
                        <Home className="h-4 w-4 mr-2" /> Trang Chủ
                      </Button>
                    </div>
                    <Button size="sm" onClick={() => setShowResults(true)} className="w-full">
                      Xem Kết Quả
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:w-3/4 xl:w-4/5" ref={contentRef}>
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">{subjectNames[subjectId] || subjectId}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span className={`${timeLeft < 300 ? "text-red-500 animate-pulse" : ""}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center gap-2">
                  <span>
                    Câu {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleBookmark(currentQuestionIndex)}
                        >
                          {bookmarkedQuestions.includes(currentQuestionIndex) ? (
                            <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Đánh dấu câu hỏi</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleFlag(currentQuestionIndex)}
                        >
                          {flaggedQuestions.includes(currentQuestionIndex) ? (
                            <Flag className="h-4 w-4 text-red-500" />
                          ) : (
                            <Flag className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gắn cờ câu hỏi</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span>{progress.toFixed(0)}% hoàn thành</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 shadow-lg">
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-xl">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {currentQuestionIndex + 1}
                        </div>
                        <div>{renderMathContent(currentQuestion.question)}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    {currentQuestion.type === "short_answer" ? (
                      <div className="space-y-4">
                        <Label htmlFor="short-answer">Nhập câu trả lời của bạn:</Label>
                        <Textarea
                          id="short-answer"
                          placeholder="Nhập câu trả lời..."
                          value={shortAnswer}
                          onChange={handleShortAnswerChange}
                          disabled={isAnswerConfirmed}
                          className="min-h-[100px]"
                        />
                      </div>
                    ) : (
                      <RadioGroup
                        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
                        onValueChange={handleAnswerSelect}
                        className="space-y-3"
                      >
                        {currentQuestion.options.map((option, index) => {
                          // Xác định class cho từng đáp án
                          let optionClass =
                            "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200"

                          if (isAnswerConfirmed) {
                            if (index === currentQuestion.correctAnswer) {
                              // Đáp án đúng
                              optionClass += " bg-green-50 dark:bg-green-900/20 border-green-500"
                            } else if (index === selectedAnswer) {
                              // Đáp án sai đã chọn
                              optionClass += " bg-red-50 dark:bg-red-900/20 border-red-500"
                            }
                          } else {
                            // Chưa xác nhận
                            optionClass += " hover:border-primary"
                          }

                          return (
                            <div key={index} className={optionClass}>
                              <RadioGroupItem
                                value={index.toString()}
                                id={`option-${index}`}
                                className="flex-shrink-0"
                                disabled={isAnswerConfirmed}
                              />
                              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                {renderMathContent(option)}
                              </Label>
                              {isAnswerConfirmed && index === currentQuestion.correctAnswer && (
                                <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                              )}
                              {isAnswerConfirmed &&
                                index === selectedAnswer &&
                                index !== currentQuestion.correctAnswer && (
                                  <XCircle className="h-5 w-5 text-red-500 ml-2 flex-shrink-0" />
                                )}
                            </div>
                          )
                        })}
                      </RadioGroup>
                    )}

                    {isAnswerConfirmed && !isCorrect && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-700 dark:text-red-400">Đáp án đúng:</p>
                            <div className="mt-1 text-red-600 dark:text-red-300">
                              {currentQuestion.type === "short_answer"
                                ? currentQuestion.correctAnswer
                                : renderMathContent(currentQuestion.options[currentQuestion.correctAnswer])}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isAnswerConfirmed && isCorrect && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-green-700 dark:text-green-400">Chính xác!</p>
                            <p className="mt-1 text-green-600 dark:text-green-300">Bạn đã trả lời đúng câu hỏi này.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 p-6 pt-0">
                    <div className="flex justify-between w-full">
                      <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Câu Trước
                      </Button>

                      {!isAnswerConfirmed ? (
                        <Button
                          onClick={handleConfirmAnswer}
                          disabled={
                            currentQuestion.type === "short_answer" ? !shortAnswer.trim() : selectedAnswer === null
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Lightbulb className="mr-2 h-4 w-4" /> Xác Nhận Đáp Án
                        </Button>
                      ) : (
                        <Button onClick={handleNextQuestion}>
                          {currentQuestionIndex === questions.length - 1 ? "Nộp Bài" : "Câu Tiếp Theo"}{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {(showExplanation || isAnswerConfirmed) && currentQuestion.explanation && (
                      <div className="w-full">
                        <QuizExplanation explanation={currentQuestion.explanation} formula={currentQuestion.formula} />
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
