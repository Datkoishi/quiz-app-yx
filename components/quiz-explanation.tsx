"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Lightbulb, BookOpen } from "lucide-react"
import { MathFormula } from "@/components/math-formula"
import { motion, AnimatePresence } from "framer-motion"

interface QuizExplanationProps {
  explanation: string
  formula?: string
}

export function QuizExplanation({ explanation, formula }: QuizExplanationProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Hàm xử lý văn bản có chứa công thức toán học
  const renderMathContent = (content: string) => {
    if (!content) return null

    // Xử lý các thẻ đánh dấu trước khi tách
    const processedContent = content
      // Thẻ bôi đỏ
      .replace(/\[red\](.*?)\[\/red\]/g, '<span class="text-red-600 dark:text-red-400 font-medium">$1</span>')
      // Thẻ bôi vàng
      .replace(
        /\[yellow\](.*?)\[\/yellow\]/g,
        '<span class="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">$1</span>',
      )
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
        return (
          <span
            key={index}
            className="whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, "<br />") }}
          />
        )
      }
    })
  }

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          <span>Xem lời giải</span>
        </div>
        <div className="bg-primary/10 rounded-full p-1 transition-transform duration-300 group-hover:bg-primary/20">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 explanation-content">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      Lời giải:
                    </h4>
                    <div className="math-content">{renderMathContent(explanation)}</div>
                  </div>

                  {formula && (
                    <div className="formula-content">
                      <h4 className="text-lg font-medium mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                        Công thức liên quan:
                      </h4>
                      <div className="math-content">{renderMathContent(formula)}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
