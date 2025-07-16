import { BookOpen, Brain, Code, ShoppingBag, Waves, Languages, Calculator, FileText } from "lucide-react"
import type { ReactNode } from "react"

export interface Subject {
  id: string
  name: string
  description: string
  icon: ReactNode
  color: string
  textColor: string
  questionCount: number
  difficulty: string
  estimatedTime: string
  requiresPassword?: boolean
  completed?: boolean
  completedDate?: string
}

export const activeSubjects: Subject[] = [
  {
    id: "application-development-practices",
    name: "Application Development Practices",
    description: "Ôn tập kiến thức về thực hành phát triển ứng dụng - Học kỳ 2025 (Yêu cầu mật khẩu)",
    icon: <Code className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-indigo-500/10 via-blue-400/5 to-purple-500/10 dark:from-indigo-400/20 dark:via-blue-300/10 dark:to-purple-400/20 border border-indigo-200/30 dark:border-indigo-400/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    questionCount: 50,
    requiresPassword: true,
    difficulty: "Khó",
    estimatedTime: "50 phút",
  },
  {
    id: "application-development-practices-essay",
    name: "Application Development Practices - Tự Luận",
    description:
      "Ôn tập câu hỏi trả lời ngắn và tự luận về thực hành phát triển ứng dụng - Học kỳ 2025 (Yêu cầu mật khẩu)",
    icon: <FileText className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-teal-500/10 via-cyan-400/5 to-blue-500/10 dark:from-teal-400/20 dark:via-cyan-300/10 dark:to-blue-400/20 border border-teal-200/30 dark:border-teal-400/30",
    textColor: "text-teal-700 dark:text-teal-300",
    questionCount: 30,
    requiresPassword: true,
    difficulty: "Khó",
    estimatedTime: "40 phút",
  },
  {
    id: "application-development-practices-2",
    name: "Application Development Practices 2",
    description:
      "Ôn tập nâng cao về quy trình phát triển phần mềm, kiểm thử, và quản lý dự án - Học kỳ 2025 (Yêu cầu mật khẩu)",
    icon: <Code className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-purple-500/10 via-violet-400/5 to-fuchsia-500/10 dark:from-purple-400/20 dark:via-violet-300/10 dark:to-fuchsia-400/20 border border-purple-200/30 dark:border-purple-400/30",
    textColor: "text-purple-700 dark:text-purple-300",
    questionCount: 50,
    requiresPassword: true,
    difficulty: "Khó",
    estimatedTime: "50 phút",
  },
  {
    id: "lich-su-dang-cong-san-viet-nam",
    name: "Lịch sử Đảng Cộng sản Việt Nam",
    description: "Ôn tập trắc nghiệm về lịch sử Đảng Cộng sản Việt Nam - Học kỳ 2025",
    icon: <BookOpen className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-red-500/10 via-yellow-400/5 to-orange-500/10 dark:from-red-400/20 dark:via-yellow-300/10 dark:to-orange-400/20 border border-red-200/30 dark:border-red-400/30",
    textColor: "text-red-700 dark:text-red-300",
    questionCount: 45,
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
  },
]

export const completedSubjects: Subject[] = [
  {
    id: "xac-suat-thong-ke",
    name: "Xác Suất Thống Kê",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập các khái niệm và bài tập về xác suất và thống kê",
    icon: <Brain className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 52,
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
    completed: true,
    completedDate: "10/6/2025",
  },
  {
    id: "xac-suat-thong-ke-2",
    name: "Xác Suất Thống Kê 2",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập nâng cao về phân phối xác suất, thống kê mô tả và suy luận thống kê",
    icon: <Calculator className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 20,
    difficulty: "Khó",
    estimatedTime: "30 phút",
    completed: true,
    completedDate: "10/6/2025",
  },
  {
    id: "xac-suat-thong-ke-3",
    name: "Xác Suất Thống Kê 3",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập chuyên sâu về kiểm định giả thuyết, ước lượng khoảng tin cậy và phân tích thống kê nâng cao",
    icon: <Brain className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 20,
    difficulty: "Khó",
    estimatedTime: "35 phút",
    completed: true,
    completedDate: "10/6/2025",
  },
  {
    id: "toan-roi-rac",
    name: "Toán Rời Rạc",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập các khái niệm và bài tập về toán rời rạc",
    icon: <BookOpen className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 49,
    completed: true,
    completedDate: "30/5/2025",
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
  },
  {
    id: "java-2-multiple-choice",
    name: "Fundamentals of Computing 2 - Multiple Choice",
    description: "Đã hoàn thành kỳ thi 2025 - Practice multiple-choice questions about Java 2",
    icon: <Code className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 40,
    completed: true,
    completedDate: "30/5/2025",
    difficulty: "Khó",
    estimatedTime: "40 phút",
  },
  {
    id: "java-2-short-answer",
    name: "Fundamentals of Computing 2 - Short Answer",
    description: "Đã hoàn thành kỳ thi 2025 - Practice short answer questions about Java 2",
    icon: <Code className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 27,
    completed: true,
    completedDate: "29/5/2025",
    difficulty: "Khó",
    estimatedTime: "30 phút",
  },
  {
    id: "ky-thuat-thuong-mai-dien-tu-2",
    name: "Kỹ Thuật Thương Mại Điện Tử 2",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập kiến thức nâng cao về ASP.NET và phát triển web",
    icon: <Code className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 30,
    completed: true,
    completedDate: "30/5/2025",
    difficulty: "Khó",
    estimatedTime: "35 phút",
  },
  {
    id: "suc-khoe-moi-truong",
    name: "Sức Khỏe Môi Trường",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập kiến thức về sức khỏe và môi trường - Học kỳ 2025",
    icon: <Waves className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 20,
    difficulty: "Dễ",
    estimatedTime: "20 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "suc-khoe-moi-truong-part-2",
    name: "Sức Khỏe Môi Trường - Part 2",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập nâng cao về ô nhiễm môi trường, an toàn thực phẩm và sức khỏe nghề nghiệp - Học kỳ 2025",
    icon: <Waves className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 65,
    difficulty: "Trung bình",
    estimatedTime: "65 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "nguyen-ly-ke-toan-1-part-1",
    name: "Nguyên Lý Kế Toán 1 - Part 1",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập các khái niệm và nguyên tắc cơ bản về kế toán - Học kỳ 2025",
    icon: <FileText className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 50,
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "nguyen-ly-ke-toan-1-part-2",
    name: "Nguyên Lý Kế Toán 1 - Part 2",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập các phương pháp và báo cáo kế toán nâng cao - Học kỳ 2025",
    icon: <BookOpen className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 50,
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "nguyen-ly-ke-toan-1-part-3",
    name: "Nguyên Lý Kế Toán 1 - Part 3",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập thực hành định khoản và hệ thống tài khoản kế toán - Học kỳ 2025",
    icon: <Calculator className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 50,
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "nguyen-ly-ke-toan-1-part-4",
    name: "Nguyên Lý Kế Toán 1 - Part 4",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập tổng hợp và nâng cao về nguyên tắc, báo cáo tài chính - Học kỳ 2025",
    icon: <Brain className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 50,
    difficulty: "Khó",
    estimatedTime: "50 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "nguyen-ly-ke-toan-1",
    name: "Nguyên Lý Kế Toán 1 - Tính toán",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập tổng hợp các nguyên tắc, phương pháp và thực hành kế toán cơ bản - Học kỳ 2025",
    icon: <FileText className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 50,
    difficulty: "Trung bình",
    estimatedTime: "50 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "marketing-psu",
    name: "Marketing PSU",
    description:
      "Đã hoàn thành kỳ thi 2025 - Comprehensive marketing concepts covering consumer behavior, strategic planning, and market research",
    icon: <ShoppingBag className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 40,
    difficulty: "Trung bình",
    estimatedTime: "45 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "marketing-trac-nghiem",
    name: "Marketing - Trắc nghiệm",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập kiến thức marketing qua các câu hỏi trắc nghiệm về môi trường marketing, hành vi khách hàng",
    icon: <Brain className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 30,
    difficulty: "Trung bình",
    estimatedTime: "35 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "marketing-tra-loi-ngan",
    name: "Marketing - Trả lời ngắn",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập thuật ngữ và khái niệm marketing qua các câu hỏi trả lời ngắn và điền từ",
    icon: <FileText className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 30,
    difficulty: "Dễ",
    estimatedTime: "25 phút",
    completed: true,
    completedDate: "1/6/2025",
  },
  {
    id: "tieng-anh-cmu-de-1",
    name: "Tiếng Anh Chuyên Ngành CMU - Đề 1",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập từ vựng và thuật ngữ tiếng Anh chuyên ngành Công nghệ thông tin - Học kỳ 2025",
    icon: <Languages className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 42,
    difficulty: "Trung bình",
    estimatedTime: "40 phút",
    completed: true,
    completedDate: "9/6/2025",
  },
  {
    id: "tieng-anh-cmu-de-2",
    name: "Tiếng Anh Chuyên Ngành CMU - Đề 2",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập từ vựng và thuật ngữ tiếng Anh chuyên ngành Công nghệ thông tin - Học kỳ 2025",
    icon: <Languages className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 44,
    difficulty: "Trung bình",
    estimatedTime: "42 phút",
    completed: true,
    completedDate: "9/6/2025",
  },
  {
    id: "ky-thuat-thuong-mai-dien-tu",
    name: "Kỹ Thuật Thương Mại Điện Tử",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập kiến thức về kỹ thuật thương mại điện tử - Học kỳ 2025",
    icon: <ShoppingBag className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 70,
    difficulty: "Khó",
    estimatedTime: "60 phút",
    completed: true,
    completedDate: "9/6/2025",
  },
  {
    id: "network-telecommunications",
    name: "Introduction to Network & Telecommunications Technology",
    description: "Đã hoàn thành kỳ thi 2025 - Ôn tập kiến thức về mạng máy tính và công nghệ viễn thông - Học kỳ 2025",
    icon: <Code className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 106,
    difficulty: "Khó",
    estimatedTime: "90 phút",
    completed: true,
    completedDate: "9/6/2025",
  },
  {
    id: "toan-cao-cap-c2",
    name: "Toán cao cấp C2",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập đại số tuyến tính: ma trận, định thức, hệ phương trình, không gian vector - Học kỳ 2025",
    icon: <Calculator className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 27,
    difficulty: "Khó",
    estimatedTime: "60 phút",
    completed: true,
    completedDate: "9/6/2025",
  },
  {
    id: "lich-su-van-minh-the-gioi",
    name: "Lịch sử văn minh thế giới",
    description:
      "Đã hoàn thành kỳ thi 2025 - Ôn tập kiến thức về các nền văn minh cổ đại: Ai Cập, Lưỡng Hà, Ấn Độ, Trung Quốc, Hy Lạp, La Mã - Học kỳ 2025",
    icon: <BookOpen className="h-8 w-8" />,
    color:
      "bg-gradient-to-br from-gray-400/10 via-slate-300/5 to-zinc-400/10 dark:from-gray-300/15 dark:via-slate-200/8 dark:to-zinc-300/15 border border-gray-200/40 dark:border-gray-400/40",
    textColor: "text-gray-600 dark:text-gray-300",
    questionCount: 150,
    difficulty: "Trung bình",
    estimatedTime: "120 phút",
    completed: true,
    completedDate: "9/6/2025",
  },
]

export const allSubjects = [...activeSubjects, ...completedSubjects]

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Dễ":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    case "Trung bình":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "Khó":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  }
}
