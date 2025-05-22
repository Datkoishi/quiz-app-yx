"use client"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MathFormulaProps {
  formula: string
  display?: boolean
  className?: string
}

export function MathFormula({ formula, display = false, className = "" }: MathFormulaProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Xử lý các macro tùy chỉnh trước khi render
      const macros = {
        "\\red": "\\textcolor{red}{#1}",
        "\\yellow": "\\colorbox{yellow}{#1}",
        "\\highlight": "\\colorbox{yellow}{#1}",
        "\\important": "\\textcolor{red}{#1}",
        "\\note": "\\textcolor{blue}{#1}",
      }

      const processedFormula = formula

      // Thêm các macro vào KaTeX
      const katexOptions = {
        throwOnError: false,
        displayMode: display,
        macros: macros,
        trust: true,
        strict: false,
      }

      katex.render(processedFormula, containerRef.current, katexOptions)
    }
  }, [formula, display])

  return <div ref={containerRef} className={className} />
}
