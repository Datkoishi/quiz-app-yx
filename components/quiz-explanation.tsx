"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MathFormula } from "@/components/math-formula"

interface QuizExplanationProps {
  explanation: string
}

export function QuizExplanation({ explanation }: QuizExplanationProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Function to process explanation text and render math formulas
  const renderExplanation = (text: string) => {
    if (!text) return null

    // Regular expression to match LaTeX formulas between $$ and $$
    const parts = text.split(/(\$\$.*?\$\$)/g)

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Extract the formula without the $$ delimiters
        const formula = part.substring(2, part.length - 2)
        return <MathFormula key={index} formula={formula} display={true} />
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="mt-4">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
        {isOpen ? "Ẩn giải thích" : "Xem giải thích"}
      </Button>

      {isOpen && (
        <div className="mt-2 p-4 bg-muted/50 rounded-md">
          <div className="prose prose-sm dark:prose-invert max-w-none">{renderExplanation(explanation)}</div>
        </div>
      )}
    </div>
  )
}
